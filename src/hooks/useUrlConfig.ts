import { useEffect, useRef } from 'react';
import { useMcpStore } from '../store/mcpStore';

export function useUrlConfig() {
  const { loadFromShareUrl, setToastMessage } = useMcpStore();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const url = window.location.href;
    if (url.includes('config=')) {
      const success = loadFromShareUrl(url);
      if (success) {
        setToastMessage('Configuration loaded from URL');
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        setToastMessage('Error: Failed to load configuration from URL');
      }
    }
  }, [loadFromShareUrl, setToastMessage]);
}
