import { Zap, Globe, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { useLangStore, useTranslations } from '../../store/langStore';

export function Header() {
  const { lang, toggleLang } = useLangStore();
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="gap-2"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
            {lang === 'en' ? '한국어' : 'English'}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Visit Linktree"
          >
            <a
              href="https://litt.ly/voidlight"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
