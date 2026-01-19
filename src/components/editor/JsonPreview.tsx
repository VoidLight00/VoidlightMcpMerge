import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useMcpStore } from '../../store/mcpStore';
import { useTranslations } from '../../store/langStore';
import { stringifyMcpJson } from '../../types/mcp';

export function JsonPreview() {
  const [copied, setCopied] = useState(false);
  const { exportJson, setToastMessage } = useMcpStore();
  const t = useTranslations();

  const config = exportJson();
  const json = stringifyMcpJson(config);
  const lines = json.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setToastMessage(t.jsonCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToastMessage(t.copyFailed);
    }
  };

  return (
    <div className="glass-card overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-border/40">
        <h2 className="text-sm font-medium">{t.jsonPreview}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1.5"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              {t.copied}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              {t.copy}
            </>
          )}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 bg-black/20">
        <pre className="font-mono text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-muted-foreground/50 w-8 text-right pr-4">
                  {i + 1}
                </span>
                <span className="flex-1">
                  {highlightJson(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function highlightJson(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const patterns = [
    { regex: /^(\s*)(".*?")(:)/, classes: ['', 'text-blue-400', 'text-muted-foreground'] },
    { regex: /".*?"/, className: 'text-green-400' },
    { regex: /\b(true|false|null)\b/, className: 'text-yellow-400' },
    { regex: /\b\d+\b/, className: 'text-orange-400' },
    { regex: /[{}[\],]/, className: 'text-muted-foreground' },
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index === 0) {
        if ('classes' in pattern && pattern.classes) {
          const fullMatch = match[0];
          const groups = match.slice(1);
          groups.forEach((group, i) => {
            if (group) {
              parts.push(
                <span key={key++} className={pattern.classes[i]}>
                  {group}
                </span>
              );
            }
          });
          remaining = remaining.slice(fullMatch.length);
        } else {
          parts.push(
            <span key={key++} className={pattern.className}>
              {match[0]}
            </span>
          );
          remaining = remaining.slice(match[0].length);
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return <>{parts}</>;
}
