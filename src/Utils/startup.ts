export function startWithAssetRecovery({load, ready, fontFamily}: {load: () => Promise<unknown>; ready: () => void | Promise<void>; fontFamily?: string}): void {
  const status = document.createElement('div');
  status.setAttribute('role', 'status');
  Object.assign(status.style, {position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: '1000', padding: '12px', color: '#fff', background: '#222'});
  document.body.appendChild(status);
  let loading = false;
  let started = false;
  let fontTimeout: ReturnType<typeof setTimeout> | undefined;
  const begin = async () => {
    if (loading || started) return;
    clearTimeout(fontTimeout);
    loading = true;
    status.setAttribute('role', 'status');
    status.textContent = 'Loading game assets...';
    try {
      await load();
      await ready();
      started = true;
      status.remove();
    } catch (error) {
      console.error({event: 'asset-load-failed', error});
      status.setAttribute('role', 'alert');
      status.textContent = 'Unable to load the game. Please try again. ';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Retry';
      retry.onclick = () => { void begin(); };
      status.appendChild(retry);
    } finally { loading = false; }
  };
  status.textContent = 'Loading game assets...';
  if (!fontFamily) { void begin(); return; }
  Object.assign(window, {WebFontConfig: {google: {families: [fontFamily]}, active: () => { void begin(); }, inactive: () => { void begin(); }}});
  const script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  script.async = true;
  script.onerror = () => { void begin(); };
  fontTimeout = setTimeout(() => { void begin(); }, 3000);
  document.head.appendChild(script);
}
