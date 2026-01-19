import { Header } from './components/layout/Header';
import { Toolbar } from './components/layout/Toolbar';
import { ServerCard } from './components/editor/ServerCard';
import { JsonPreview } from './components/editor/JsonPreview';
import { EmptyState } from './components/editor/EmptyState';
import { ToastNotification } from './components/editor/ToastNotification';
import { useMcpStore } from './store/mcpStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useUrlConfig } from './hooks/useUrlConfig';

function App() {
  const { servers } = useMcpStore();
  
  useKeyboardShortcuts();
  useUrlConfig();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Toolbar />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Servers
              {servers.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({servers.length})
                </span>
              )}
            </h2>
            
            {servers.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {servers.map((server) => (
                  <ServerCard key={server.key} server={server} />
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <JsonPreview />
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <p>
          Made by{' '}
          <a
            href="https://github.com/VoidLight00"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            VoidLight
          </a>
        </p>
      </footer>
      
      <ToastNotification />
    </div>
  );
}

export default App;
