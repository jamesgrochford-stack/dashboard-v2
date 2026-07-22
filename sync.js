// =============================================================
// Shared cloud-sync helper for the dashboard.
// Each page calls initCloudSync({...}) once with its config:
//   appKey         — string row key in the public.app_state table
//   syncedKeys     — exact localStorage keys to mirror
//   syncedPrefixes — localStorage key prefixes to mirror (e.g. 'goals:')
//   onApplied      — optional callback after remote state has been applied
//
// Requires:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="sync.js" defer></script>
// =============================================================
(function () {
  'use strict';

  // Prefer Vercel env vars (served via /api/config → window.DASH_*). No
  // hardcoded fallback here on purpose -- a page opened without /api/config
  // (e.g. a plain local static-file server) must fail safely rather than
  // silently syncing to the real production project.
  const SUPABASE_URL = (typeof window !== 'undefined' && window.DASH_SUPABASE_URL) || '';
  const SUPABASE_KEY = (typeof window !== 'undefined' && window.DASH_SUPABASE_KEY) || '';

  window.initCloudSync = function (config) {
    const appKey = config && config.appKey;
    const syncedKeys = (config && config.syncedKeys) || [];
    const syncedPrefixes = (config && config.syncedPrefixes) || [];
    const onApplied = config && config.onApplied;
    // Optional per-key merge hook: { [key]: (localVal, remoteVal) => mergedVal }.
    // When present for a key, applyRemote() uses the merged result instead of
    // blindly overwriting with the remote value. Every caller that doesn't
    // pass this gets byte-identical behavior to before -- opt-in only.
    const mergeFns = (config && config.merge) || {};
    if (!appKey) return;
    if (!window.supabase) return;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn('[sync] Supabase not configured (no window.DASH_SUPABASE_URL/KEY from /api/config) -- sync disabled for "' + appKey + '".');
      return;
    }
    if (SUPABASE_URL.indexOf('PASTE-') === 0 || SUPABASE_KEY.indexOf('PASTE-') === 0) return;

    let supa = null;
    let pushTimer = null;
    let suppressSync = false;
    let lastSyncedJson = null;

    function matches(k) {
      if (!k) return false;
      if (syncedKeys.indexOf(k) !== -1) return true;
      for (let i = 0; i < syncedPrefixes.length; i++) {
        if (k.indexOf(syncedPrefixes[i]) === 0) return true;
      }
      return false;
    }
    function listAllKeys() {
      const out = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (matches(k)) out.push(k);
      }
      return out;
    }
    function collect() {
      const out = {};
      for (const k of listAllKeys()) {
        const v = localStorage.getItem(k);
        if (v == null) continue;
        try { out[k] = JSON.parse(v); } catch (e) { out[k] = v; }
      }
      return out;
    }

    const origSet = localStorage.setItem.bind(localStorage);
    const origRemove = localStorage.removeItem.bind(localStorage);
    localStorage.setItem = function (k, v) {
      origSet(k, v);
      try { if (!suppressSync && matches(k)) schedulePush(); } catch (e) {}
    };
    localStorage.removeItem = function (k) {
      origRemove(k);
      try { if (!suppressSync && matches(k)) schedulePush(); } catch (e) {}
    };

    function applyRemote(remote) {
      if (!remote || typeof remote !== 'object') return false;
      suppressSync = true;
      let changed = false;
      let needsRepush = false;
      try {
        for (const k of Object.keys(remote)) {
          if (!matches(k)) continue;
          const local = localStorage.getItem(k);
          let incoming;
          if (typeof mergeFns[k] === 'function') {
            let localVal = null;
            try { localVal = local == null ? null : JSON.parse(local); } catch (e) {}
            let merged;
            try { merged = mergeFns[k](localVal, remote[k]); } catch (e) { merged = remote[k]; }
            incoming = JSON.stringify(merged);
            // If the merge produced something beyond what remote alone had
            // (i.e. local held data remote didn't know about yet), the
            // merged result needs to go back up so other devices get it too.
            if (incoming !== JSON.stringify(remote[k])) needsRepush = true;
          } else {
            incoming = JSON.stringify(remote[k]);
          }
          if (local !== incoming) {
            try { origSet(k, incoming); changed = true; } catch (e) {}
          }
        }
        for (const k of listAllKeys()) {
          if (!(k in remote)) {
            if (typeof mergeFns[k] === 'function') { needsRepush = true; continue; }
            try { origRemove(k); changed = true; } catch (e) {}
          }
        }
      } finally { suppressSync = false; }
      if (needsRepush) schedulePush();
      if (changed && typeof onApplied === 'function') {
        try { onApplied(); } catch (e) {}
      }
      return changed;
    }

    async function pushNow() {
      if (!supa) return;
      const state = collect();
      const json = JSON.stringify(state);
      if (json === lastSyncedJson) return;
      try {
        const { error } = await supa.from('app_state').upsert(
          { key: appKey, data: state, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
        if (!error) lastSyncedJson = json;
      } catch (e) {}
    }
    function schedulePush() {
      clearTimeout(pushTimer);
      pushTimer = setTimeout(pushNow, 250);
    }
    function flushOnUnload() {
      const state = collect();
      const json = JSON.stringify(state);
      if (json === lastSyncedJson) return;
      try {
        fetch(SUPABASE_URL + '/rest/v1/app_state?on_conflict=key', {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({ key: appKey, data: state, updated_at: new Date().toISOString() }),
          keepalive: true,
        }).catch(() => {});
        lastSyncedJson = json;
      } catch (e) {}
    }

    (async function init() {
      supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      try {
        const { data, error } = await supa
          .from('app_state').select('data').eq('key', appKey).maybeSingle();
        if (!error && data && data.data && Object.keys(data.data).length > 0) {
          lastSyncedJson = JSON.stringify(data.data);
          applyRemote(data.data);
        } else if (Object.keys(collect()).length > 0) {
          schedulePush();
        }
      } catch (e) {}
      supa.channel('app_state_' + appKey)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'app_state',
          filter: 'key=eq.' + appKey,
        }, (payload) => {
          if (!payload.new || !payload.new.data) return;
          const incoming = JSON.stringify(payload.new.data);
          if (incoming === lastSyncedJson) return;
          lastSyncedJson = incoming;
          applyRemote(payload.new.data);
        })
        .subscribe();
    })();

    window.addEventListener('beforeunload', flushOnUnload);
    window.addEventListener('pagehide', flushOnUnload);
    // beforeunload/pagehide are known-unreliable on mobile Safari / PWA
    // home-screen contexts -- visibilitychange is the recommended, more
    // reliable signal for "the user is backgrounding or closing this".
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushOnUnload();
    });
    window.addEventListener('storage', (e) => {
      if (e.key && matches(e.key)) schedulePush();
    });
  };
})();
