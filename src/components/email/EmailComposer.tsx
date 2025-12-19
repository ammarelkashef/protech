import { useState, useEffect, useRef, useCallback } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Send,
  Paperclip,
  X,
  Maximize2,
  Minimize2,
  User,
  Building2,
  FileText,
  Image,
  File,
  Save,
} from 'lucide-react';

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface EmailComposerProps {
  to: string;
  onToChange: (value: string) => void;
  cc: string;
  onCcChange: (value: string) => void;
  bcc: string;
  onBccChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  replyAs: 'personal' | 'company';
  onReplyAsChange: (value: 'personal' | 'company') => void;
  onSend: (attachments: Attachment[]) => void;
  onCancel: () => void;
  disabled?: boolean;
  draftKey?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total
const ALLOWED_FILE_TYPES = [
  'image/*',
  'application/pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
  '.csv',
  '.zip',
];

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const EmailComposer = ({
  to,
  onToChange,
  cc,
  onCcChange,
  bcc,
  onBccChange,
  body,
  onBodyChange,
  replyAs,
  onReplyAsChange,
  onSend,
  onCancel,
  disabled = false,
  draftKey,
}: EmailComposerProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  // Calculate total attachment size
  const totalAttachmentSize = attachments.reduce((sum, att) => sum + att.size, 0);

  // Auto-save draft
  useEffect(() => {
    if (!draftKey || !isDirty) return;

    const saveDraft = () => {
      const draft = {
        to,
        cc,
        bcc,
        body,
        replyAs,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(`email-draft-${draftKey}`, JSON.stringify(draft));
      setLastSaved(new Date());
      setIsDirty(false);
    };

    const interval = setInterval(saveDraft, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [to, cc, bcc, body, replyAs, draftKey, isDirty]);

  // Load draft on mount
  useEffect(() => {
    if (!draftKey) return;
    
    const savedDraft = localStorage.getItem(`email-draft-${draftKey}`);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Only restore if there's content
        if (draft.body && draft.body.length > 0) {
          onToChange(draft.to || to);
          onCcChange(draft.cc || cc);
          onBccChange(draft.bcc || bcc);
          onBodyChange(draft.body);
          onReplyAsChange(draft.replyAs || replyAs);
          toast.info('Draft restored');
        }
      } catch (e) {
        // Invalid draft, ignore
      }
    }
  }, [draftKey]);

  // Mark as dirty when content changes
  useEffect(() => {
    setIsDirty(true);
  }, [to, cc, bcc, body, replyAs]);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    let totalNewSize = 0;

    Array.from(files).forEach((file) => {
      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" exceeds 10MB limit`);
        return;
      }

      totalNewSize += file.size;

      // Check total size
      if (totalAttachmentSize + totalNewSize > MAX_TOTAL_SIZE) {
        toast.error('Total attachment size exceeds 25MB limit');
        return;
      }

      newAttachments.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      });
    });

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
      toast.success(`${newAttachments.length} file(s) attached`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [totalAttachmentSize]);

  // Remove attachment
  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  }, []);

  // Manual save draft
  const saveDraft = useCallback(() => {
    if (!draftKey) return;
    
    const draft = {
      to,
      cc,
      bcc,
      body,
      replyAs,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(`email-draft-${draftKey}`, JSON.stringify(draft));
    setLastSaved(new Date());
    setIsDirty(false);
    toast.success('Draft saved');
  }, [to, cc, bcc, body, replyAs, draftKey]);

  // Handle send
  const handleSend = () => {
    if (!to.trim() || !body.trim()) {
      toast.error('Please fill in recipient and message');
      return;
    }
    
    // Clear draft on send
    if (draftKey) {
      localStorage.removeItem(`email-draft-${draftKey}`);
    }
    
    onSend(attachments);
  };

  // Get file icon
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-background flex flex-col'
    : 'space-y-3';

  return (
    <div ref={composerRef} className={containerClasses}>
      {/* Header for fullscreen mode */}
      {isFullscreen && (
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Compose Email</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(false)}
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      )}

      <div className={cn(isFullscreen && 'flex-1 overflow-y-auto p-4', 'space-y-3')}>
        {/* Reply As Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Reply as:</span>
          <Select value={replyAs} onValueChange={(v) => onReplyAsChange(v as 'personal' | 'company')}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company Account
                </div>
              </SelectItem>
              <SelectItem value="personal">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Account
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* Fullscreen toggle */}
          {!isFullscreen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fullscreen mode</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* To, CC, BCC Fields */}
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-12">To:</span>
            <Input
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-12">CC:</span>
            <Input
              value={cc}
              onChange={(e) => onCcChange(e.target.value)}
              placeholder="cc@example.com"
              className="flex-1 h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-12">BCC:</span>
            <Input
              value={bcc}
              onChange={(e) => onBccChange(e.target.value)}
              placeholder="bcc@example.com"
              className="flex-1 h-8"
            />
          </div>
        </div>

        {/* Rich Text Editor */}
        <RichTextEditor
          content={body}
          onChange={onBodyChange}
          placeholder="Write your reply..."
          minHeight={isFullscreen ? '400px' : '250px'}
          dir="auto"
          className={cn(isFullscreen && 'flex-1')}
        />

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments ({attachments.length})
              </span>
              <span className="text-xs text-muted-foreground">
                {formatSize(totalAttachmentSize)} / 25 MB
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((att) => (
                <Badge
                  key={att.id}
                  variant="secondary"
                  className="flex items-center gap-2 pr-1 py-1"
                >
                  {getFileIcon(att.type)}
                  <span className="max-w-[150px] truncate">{att.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({formatSize(att.size)})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-destructive/20"
                    onClick={() => removeAttachment(att.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className={cn(
        'flex items-center gap-2',
        isFullscreen && 'p-4 border-t'
      )}>
        <Button onClick={handleSend} disabled={disabled || !to.trim() || !body.trim()}>
          <Send className="w-4 h-4 mr-2" />
          Send Reply
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        {/* Attachment button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach files (max 10MB each, 25MB total)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Save draft button */}
        {draftKey && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveDraft}
                  className="ml-auto"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Save draft
                {lastSaved && (
                  <span className="block text-xs text-muted-foreground">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Auto-save indicator */}
        {lastSaved && (
          <span className="text-xs text-muted-foreground ml-auto">
            Auto-saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};
