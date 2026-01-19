import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Trash2, X, Plus, Server, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useMcpStore } from '../../store/mcpStore';
import type { ServerEntry } from '../../types/mcp';
import { cn } from '../../lib/utils';

interface ServerCardProps {
  server: ServerEntry;
}

export function ServerCard({ server }: ServerCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  
  const {
    updateServer,
    removeServer,
    duplicateServer,
    addArg,
    updateArg,
    removeArg,
    addEnv,
    updateEnv,
    removeEnv,
    setToastMessage,
  } = useMcpStore();

  const handleKeyChange = (newKey: string) => {
    updateServer(server.key, { key: newKey });
  };

  const handleTypeChange = (type: 'stdio' | 'sse') => {
    updateServer(server.key, { 
      type,
      command: type === 'stdio' ? '' : undefined,
      args: type === 'stdio' ? [] : undefined,
      url: type === 'sse' ? '' : undefined,
    });
  };

  const handleDuplicate = () => {
    duplicateServer(server.key);
    setToastMessage('Server duplicated');
  };

  const handleDelete = () => {
    removeServer(server.key);
    setToastMessage('Server removed');
  };

  const envEntries = Object.entries(server.env || {});

  return (
    <div className="glass-card overflow-hidden transition-all duration-200">
      <div 
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md",
          server.type === 'stdio' ? 'bg-blue-500/20' : 'bg-green-500/20'
        )}>
          {server.type === 'stdio' ? (
            <Server className="h-4 w-4 text-blue-400" />
          ) : (
            <Globe className="h-4 w-4 text-green-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-sm font-medium truncate">
            {server.key || 'Unnamed Server'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {server.type === 'stdio' ? server.command || 'No command' : server.url || 'No URL'}
          </p>
        </div>
        
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDuplicate}
            aria-label="Duplicate server"
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            aria-label="Delete server"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {collapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {!collapsed && (
        <div className="border-t border-border/40 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`key-${server.key}`}>Server Key</Label>
              <Input
                id={`key-${server.key}`}
                value={server.key}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="my-server"
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={server.type === 'stdio' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTypeChange('stdio')}
                  className="flex-1"
                >
                  <Server className="h-4 w-4 mr-2" />
                  stdio
                </Button>
                <Button
                  type="button"
                  variant={server.type === 'sse' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTypeChange('sse')}
                  className="flex-1"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  sse
                </Button>
              </div>
            </div>
          </div>

          {server.type === 'stdio' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor={`command-${server.key}`}>Command</Label>
                <Input
                  id={`command-${server.key}`}
                  value={server.command || ''}
                  onChange={(e) => updateServer(server.key, { command: e.target.value })}
                  placeholder="npx, python, node..."
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Arguments</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addArg(server.key)}
                    className="h-7 gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Arg
                  </Button>
                </div>
                
                {(server.args || []).length > 0 ? (
                  <div className="space-y-2">
                    {(server.args || []).map((arg, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={arg}
                          onChange={(e) => updateArg(server.key, index, e.target.value)}
                          placeholder={`Argument ${index + 1}`}
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArg(server.key, index)}
                          aria-label="Remove argument"
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No arguments</p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`url-${server.key}`}>URL</Label>
              <Input
                id={`url-${server.key}`}
                value={server.url || ''}
                onChange={(e) => updateServer(server.key, { url: e.target.value })}
                placeholder="https://example.com/sse"
                className="font-mono"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Environment Variables</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addEnv(server.key)}
                className="h-7 gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Env
              </Button>
            </div>
            
            {envEntries.length > 0 ? (
              <div className="space-y-2">
                {envEntries.map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <Input
                      value={key}
                      onChange={(e) => updateEnv(server.key, key, e.target.value, value)}
                      placeholder="KEY"
                      className="font-mono w-1/3"
                    />
                    <Input
                      value={value}
                      onChange={(e) => updateEnv(server.key, key, key, e.target.value)}
                      placeholder="value"
                      className="font-mono flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEnv(server.key, key)}
                      aria-label="Remove environment variable"
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No environment variables</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
