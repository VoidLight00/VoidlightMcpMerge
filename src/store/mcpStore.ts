import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ServerEntry, McpConfig } from '../types/mcp';
import { serverEntryToMcpServer, mcpServerToEntry } from '../types/mcp';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

interface McpStore {
  servers: ServerEntry[];
  toastMessage: string | null;

  addServer: () => void;
  updateServer: (key: string, updates: Partial<ServerEntry>) => void;
  removeServer: (key: string) => void;
  duplicateServer: (key: string) => void;
  clearAll: () => void;
  
  importJson: (config: McpConfig) => void;
  exportJson: () => McpConfig;
  
  addArg: (serverKey: string) => void;
  updateArg: (serverKey: string, index: number, value: string) => void;
  removeArg: (serverKey: string, index: number) => void;
  
  addEnv: (serverKey: string) => void;
  updateEnv: (serverKey: string, oldKey: string, newKey: string, value: string) => void;
  removeEnv: (serverKey: string, envKey: string) => void;
  
  generateShareUrl: () => string;
  loadFromShareUrl: (url: string) => boolean;
  
  setToastMessage: (message: string | null) => void;
}

function generateUniqueKey(servers: ServerEntry[]): string {
  const existingKeys = new Set(servers.map(s => s.key));
  let counter = 1;
  let newKey = `server-${counter}`;
  while (existingKeys.has(newKey)) {
    counter++;
    newKey = `server-${counter}`;
  }
  return newKey;
}

export const useMcpStore = create<McpStore>()(
  persist(
    (set, get) => ({
      servers: [],
      toastMessage: null,

      addServer: () => {
        set((state) => ({
          servers: [
            ...state.servers,
            {
              key: generateUniqueKey(state.servers),
              type: 'stdio',
              command: '',
              args: [],
              env: {},
            },
          ],
        }));
      },

      updateServer: (key, updates) => {
        set((state) => ({
          servers: state.servers.map((server) =>
            server.key === key ? { ...server, ...updates } : server
          ),
        }));
      },

      removeServer: (key) => {
        set((state) => ({
          servers: state.servers.filter((server) => server.key !== key),
        }));
      },

      duplicateServer: (key) => {
        set((state) => {
          const serverToDuplicate = state.servers.find((s) => s.key === key);
          if (!serverToDuplicate) return state;

          const newKey = generateUniqueKey(state.servers);
          const duplicated: ServerEntry = {
            ...serverToDuplicate,
            key: newKey,
            args: serverToDuplicate.args ? [...serverToDuplicate.args] : [],
            env: serverToDuplicate.env ? { ...serverToDuplicate.env } : {},
          };

          return { servers: [...state.servers, duplicated] };
        });
      },

      clearAll: () => {
        set({ servers: [] });
      },

      importJson: (config) => {
        const entries: ServerEntry[] = [];
        for (const [key, server] of Object.entries(config.mcpServers)) {
          entries.push(mcpServerToEntry(key, server));
        }
        set({ servers: entries });
      },

      exportJson: () => {
        const { servers } = get();
        const mcpServers: Record<string, ReturnType<typeof serverEntryToMcpServer>> = {};
        for (const entry of servers) {
          if (entry.key.trim()) {
            mcpServers[entry.key] = serverEntryToMcpServer(entry);
          }
        }
        return { mcpServers };
      },

      addArg: (serverKey) => {
        set((state) => ({
          servers: state.servers.map((server) =>
            server.key === serverKey
              ? { ...server, args: [...(server.args || []), ''] }
              : server
          ),
        }));
      },

      updateArg: (serverKey, index, value) => {
        set((state) => ({
          servers: state.servers.map((server) => {
            if (server.key !== serverKey) return server;
            const newArgs = [...(server.args || [])];
            newArgs[index] = value;
            return { ...server, args: newArgs };
          }),
        }));
      },

      removeArg: (serverKey, index) => {
        set((state) => ({
          servers: state.servers.map((server) => {
            if (server.key !== serverKey) return server;
            const newArgs = [...(server.args || [])];
            newArgs.splice(index, 1);
            return { ...server, args: newArgs };
          }),
        }));
      },

      addEnv: (serverKey) => {
        set((state) => ({
          servers: state.servers.map((server) => {
            if (server.key !== serverKey) return server;
            const env = server.env || {};
            let counter = 1;
            let newKey = `KEY_${counter}`;
            while (newKey in env) {
              counter++;
              newKey = `KEY_${counter}`;
            }
            return { ...server, env: { ...env, [newKey]: '' } };
          }),
        }));
      },

      updateEnv: (serverKey, oldKey, newKey, value) => {
        set((state) => ({
          servers: state.servers.map((server) => {
            if (server.key !== serverKey) return server;
            const env = { ...(server.env || {}) };
            if (oldKey !== newKey) {
              delete env[oldKey];
            }
            env[newKey] = value;
            return { ...server, env };
          }),
        }));
      },

      removeEnv: (serverKey, envKey) => {
        set((state) => ({
          servers: state.servers.map((server) => {
            if (server.key !== serverKey) return server;
            const env = { ...(server.env || {}) };
            delete env[envKey];
            return { ...server, env };
          }),
        }));
      },

      generateShareUrl: () => {
        const config = get().exportJson();
        const compressed = compressToEncodedURIComponent(JSON.stringify(config));
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?config=${compressed}`;
      },

      loadFromShareUrl: (url) => {
        try {
          const urlObj = new URL(url);
          const compressed = urlObj.searchParams.get('config');
          if (!compressed) return false;
          
          const jsonString = decompressFromEncodedURIComponent(compressed);
          if (!jsonString) return false;
          
          const config = JSON.parse(jsonString) as McpConfig;
          get().importJson(config);
          return true;
        } catch {
          return false;
        }
      },

      setToastMessage: (message) => {
        set({ toastMessage: message });
      },
    }),
    {
      name: 'voidlight-mcp-storage',
      partialize: (state) => ({ servers: state.servers }),
    }
  )
);
