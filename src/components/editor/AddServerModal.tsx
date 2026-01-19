import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useMcpStore } from '../../store/mcpStore';
import type { McpConfig } from '../../types/mcp';
import { cn } from '../../lib/utils';

interface AddServerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ValidationResult {
  status: 'valid' | 'warning' | 'error';
  message: string;
}

const DEFAULT_JSON = `{
  "mcpServers": {
    "serverKey": {
      "command": "command",
      "args": ["arg1", "arg2"],
      "env": { "key": "value" }
    }
  }
}`;

export function AddServerModal({ open, onOpenChange }: AddServerModalProps) {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const { servers, importJson, setToastMessage } = useMcpStore();

  const existingKeys = useMemo(() => new Set(servers.map(s => s.key)), [servers]);

  const validation = useMemo((): ValidationResult => {
    if (!jsonInput.trim()) {
      return { status: 'error', message: 'JSON을 입력해주세요.' };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (e) {
      const error = e as SyntaxError;
      return { 
        status: 'error', 
        message: `JSON 형식이 올바르지 않습니다: ${error.message}` 
      };
    }

    if (typeof parsed !== 'object' || parsed === null) {
      return { status: 'error', message: 'JSON은 객체 형식이어야 합니다.' };
    }

    const obj = parsed as Record<string, unknown>;

    if (!('mcpServers' in obj)) {
      return { status: 'error', message: 'mcpServers 객체가 없습니다.' };
    }

    if (typeof obj.mcpServers !== 'object' || obj.mcpServers === null) {
      return { status: 'error', message: 'mcpServers 객체가 올바르지 않습니다.' };
    }

    const mcpServers = obj.mcpServers as Record<string, unknown>;
    const serverKeys = Object.keys(mcpServers);

    if (serverKeys.length === 0) {
      return { status: 'error', message: 'mcpServers에 서버가 정의되어 있지 않습니다.' };
    }

    for (const key of serverKeys) {
      const server = mcpServers[key] as Record<string, unknown>;
      
      if (typeof server !== 'object' || server === null) {
        return { status: 'error', message: `"${key}" 서버의 형식이 올바르지 않습니다.` };
      }

      const hasCommand = 'command' in server;
      const hasUrl = 'url' in server;

      if (!hasCommand && !hasUrl) {
        return { 
          status: 'error', 
          message: `"${key}" 서버에 command 또는 url이 필요합니다.` 
        };
      }

      if (hasCommand && hasUrl) {
        return { 
          status: 'error', 
          message: `"${key}" 서버에 command와 url을 동시에 사용할 수 없습니다.` 
        };
      }
    }

    const duplicates = serverKeys.filter(key => existingKeys.has(key));
    if (duplicates.length > 0) {
      const dupList = duplicates.map(k => `"${k}"`).join(', ');
      return { 
        status: 'warning', 
        message: `${dupList} 서버가 이미 존재합니다. 추가하면 기존 서버가 덮어씌워집니다.` 
      };
    }

    const serverCount = serverKeys.length;
    return { 
      status: 'valid', 
      message: `유효한 JSON 형식입니다. ${serverCount}개의 서버가 정의되어 있습니다.` 
    };
  }, [jsonInput, existingKeys]);

  const canAdd = validation.status === 'valid' || validation.status === 'warning';

  const handleAdd = () => {
    if (!canAdd) return;

    try {
      const parsed = JSON.parse(jsonInput) as McpConfig;
      const currentExport = useMcpStore.getState().exportJson();

      const mergedConfig: McpConfig = {
        mcpServers: {
          ...currentExport.mcpServers,
          ...parsed.mcpServers
        }
      };

      importJson(mergedConfig);
      
      const addedCount = Object.keys(parsed.mcpServers).length;
      setToastMessage(`${addedCount}개의 서버가 추가되었습니다.`);
      onOpenChange(false);
      setJsonInput(DEFAULT_JSON);
    } catch {
      setToastMessage('Error: 서버 추가에 실패했습니다.');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setJsonInput(DEFAULT_JSON);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Server JSON</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={cn(
              "relative rounded-lg border-2 transition-colors",
              validation.status === 'valid' && "border-green-500/50",
              validation.status === 'warning' && "border-yellow-500/50",
              validation.status === 'error' && "border-red-500/50"
            )}
          >
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-64 p-4 bg-black/30 rounded-lg font-mono text-sm resize-none focus:outline-none"
              placeholder="MCP 서버 JSON을 입력하세요..."
              spellCheck={false}
            />
          </div>

          <div
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg text-sm",
              validation.status === 'valid' && "bg-green-500/10 text-green-400",
              validation.status === 'warning' && "bg-yellow-500/10 text-yellow-400",
              validation.status === 'error' && "bg-red-500/10 text-red-400"
            )}
          >
            {validation.status === 'valid' && (
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            {validation.status === 'warning' && (
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            {validation.status === 'error' && (
              <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <p>{validation.message}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!canAdd}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
