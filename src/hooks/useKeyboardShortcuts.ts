import { useEffect } from 'react';
import { useMcpStore } from '../store/mcpStore';
import { stringifyMcpJson } from '../types/mcp';

export function useKeyboardShortcuts() {
  const { addServer, exportJson, setToastMessage } = useMcpStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 's') {
        e.preventDefault();
        const config = exportJson();
        const json = stringifyMcpJson(config);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'claude_desktop_config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setToastMessage('Configuration saved');
      }

      if (modifier && e.key === 'n') {
        e.preventDefault();
        addServer();
        setToastMessage('New server added');
      }

      if (modifier && e.key === 'c' && !window.getSelection()?.toString()) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const config = exportJson();
          const json = stringifyMcpJson(config);
          navigator.clipboard.writeText(json).then(() => {
            setToastMessage('JSON copied to clipboard');
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addServer, exportJson, setToastMessage]);
}
