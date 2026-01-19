import { Server, Plus, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { useMcpStore } from '../../store/mcpStore';

const EXAMPLE_CONFIG = {
  mcpServers: {
    'filesystem': {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/allowed/dir'],
    },
    'github': {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: 'your-token-here'
      }
    },
    'memory': {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory']
    }
  }
};

export function EmptyState() {
  const { addServer, importJson, setToastMessage } = useMcpStore();

  const handleLoadExample = () => {
    importJson(EXAMPLE_CONFIG);
    setToastMessage('Example configuration loaded');
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
        <Server className="h-8 w-8 text-primary" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">No servers configured</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Start by adding a new MCP server or load an existing configuration file.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={addServer} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Server
        </Button>
        
        <Button variant="outline" onClick={handleLoadExample} className="gap-2">
          <Upload className="h-4 w-4" />
          Load Example
        </Button>
      </div>
      
      <div className="mt-12 w-full max-w-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Popular MCP Servers
        </h3>
        <div className="grid gap-2 text-left">
          {[
            { name: 'filesystem', desc: 'File system access' },
            { name: 'github', desc: 'GitHub API integration' },
            { name: 'memory', desc: 'Knowledge graph memory' },
            { name: 'puppeteer', desc: 'Browser automation' },
            { name: 'sqlite', desc: 'SQLite database' },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/40"
            >
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <Server className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-mono text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
