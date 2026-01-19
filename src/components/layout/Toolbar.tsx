import { useRef, useState } from 'react';
import { Plus, Upload, Download, Copy, Share2, Trash2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useMcpStore } from '../../store/mcpStore';
import { parseMcpJson, stringifyMcpJson } from '../../types/mcp';
import { ShareModal } from '../editor/ShareModal';
import { AddServerModal } from '../editor/AddServerModal';

export function Toolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [addServerModalOpen, setAddServerModalOpen] = useState(false);
  
  const { 
    servers, 
    clearAll, 
    importJson, 
    exportJson,
    setToastMessage 
  } = useMcpStore();

  const handleLoadJson = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseMcpJson(content);
      
      if (result instanceof Error) {
        setToastMessage(`Error: ${result.message}`);
      } else {
        importJson(result);
        setToastMessage('Configuration loaded successfully');
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveJson = () => {
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
  };

  const handleCopyJson = async () => {
    const config = exportJson();
    const json = stringifyMcpJson(config);
    
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setToastMessage('JSON copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToastMessage('Failed to copy to clipboard');
    }
  };

  const handleClearAll = () => {
    if (servers.length === 0) return;
    if (confirm('Are you sure you want to clear all servers?')) {
      clearAll();
      setToastMessage('All servers cleared');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 p-4 border-b border-border/40 bg-card/50">
        <Button onClick={() => setAddServerModalOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Server
        </Button>
        
        <Button onClick={handleLoadJson} variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Load JSON
        </Button>
        
        <Button onClick={handleSaveJson} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Save JSON
        </Button>
        
        <Button onClick={handleCopyJson} variant="outline" size="sm" className="gap-2">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          Copy JSON
        </Button>
        
        <Button 
          onClick={() => setShareModalOpen(true)} 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        
        <div className="flex-1" />
        
        <Button 
          onClick={handleClearAll} 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={servers.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Load JSON file"
        />
      </div>
      
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} />
      <AddServerModal open={addServerModalOpen} onOpenChange={setAddServerModalOpen} />
    </>
  );
}
