// Reader preferences are scoped to the authenticated reader and immutable text.
// Missing identity never falls back to a shared browser-wide preference key.
const PREFIX = 'second-language-context-translations-v1:';
const valid = value => typeof value === 'string' && value.length > 0 && value.length <= 256;
export function createContextTranslationState({storage, eventTarget = globalThis} = {}) {
  if (storage === undefined) { try { storage = globalThis.localStorage; } catch {} }
  let key = null, scope = '', values = {}, memory = new Map();
  const volatileKeys = new Set();
  const listeners = new Set();
  const read = () => {
    if (!key || volatileKeys.has(key)) return memory.get(scope) || {};
    try {
      const parsed = JSON.parse(storage?.getItem(key) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? Object.fromEntries(Object.entries(parsed).filter(([id, state]) => valid(id) && state === true)) : {};
    } catch { volatileKeys.add(key); return memory.get(scope) || {}; }
  };
  const notify = id => { for (const listener of listeners) listener(id); };
  const changed = event => {
    if (key && (event.key === key || event.key === null)) { values = read(); memory.set(scope, {...values}); notify(null); }
  };
  eventTarget?.addEventListener?.('storage', changed);
  return {
    setScope({readerUserId, digest} = {}) {
      scope = JSON.stringify([valid(readerUserId) ? readerUserId : null, digest || null]);
      key = valid(readerUserId) && /^[a-f0-9]{64}$/.test(digest || '') && typeof storage?.getItem === 'function' && typeof storage?.setItem === 'function'
        ? PREFIX + JSON.stringify([readerUserId, digest]) : null;
      values = {}; values = read(); memory.set(scope, {...values}); notify(null);
    },
    revealed(id) { return values[id] === true; },
    toggle(id) {
      if (!valid(id)) return;
      values = read();
      if (values[id] === true) delete values[id]; else values[id] = true;
      memory.set(scope, {...values});
      if (key) { try { storage.setItem(key, JSON.stringify(values)); } catch { volatileKeys.add(key); } }
      notify(id);
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    clearScope() { key = null; scope = ''; values = {}; memory = new Map(); notify(null); },
    destroy() { eventTarget?.removeEventListener?.('storage', changed); listeners.clear(); }
  };
}
