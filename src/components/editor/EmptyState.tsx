import { Server, Plus, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { useMcpStore } from '../../store/mcpStore';
import { useTranslations, useLangStore } from '../../store/langStore';

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

const POPULAR_SERVERS = {
  en: [
    { name: 'filesystem', desc: 'File system access' },
    { name: 'github', desc: 'GitHub API integration' },
    { name: 'memory', desc: 'Knowledge graph memory' },
    { name: 'puppeteer', desc: 'Browser automation' },
    { name: 'sqlite', desc: 'SQLite database' },
  ],
  ko: [
    { name: 'filesystem', desc: '파일 시스템 접근' },
    { name: 'github', desc: 'GitHub API 연동' },
    { name: 'memory', desc: '지식 그래프 메모리' },
    { name: 'puppeteer', desc: '브라우저 자동화' },
    { name: 'sqlite', desc: 'SQLite 데이터베이스' },
  ],
};

interface EmptyStateProps {
  onAddServer: () => void;
}

export function EmptyState({ onAddServer }: EmptyStateProps) {
  const { importJson, setToastMessage } = useMcpStore();
  const t = useTranslations();
  const lang = useLangStore((state) => state.lang);

  const handleLoadExample = () => {
    importJson(EXAMPLE_CONFIG);
    setToastMessage(t.configLoaded);
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
        <Server className="h-8 w-8 text-primary" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">{t.noServers}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {t.noServersDesc}
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onAddServer} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.addServer}
        </Button>
        
        <Button variant="outline" onClick={handleLoadExample} className="gap-2">
          <Upload className="h-4 w-4" />
          {t.loadExample}
        </Button>
      </div>
      
      <div className="mt-12 w-full max-w-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          {t.popularServers}
        </h3>
        <div className="grid gap-2 text-left">
          {POPULAR_SERVERS[lang].map((item) => (
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
