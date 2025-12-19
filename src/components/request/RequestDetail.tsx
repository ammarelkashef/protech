import { useState } from 'react';
import { Request, RequestStage, STAGE_CONFIG } from '@/types/request';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmailComposer } from '@/components/email/EmailComposer';
import { 
  Mail, 
  Calendar, 
  Paperclip, 
  MessageSquare, 
  CheckSquare,
  Send,
  UserPlus,
  Reply,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  User,
  Building2,
  Plus
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RequestDetailProps {
  request: Request | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStageChange?: (requestId: string, newStage: RequestStage) => void;
}

export const RequestDetail = ({ request, open, onOpenChange, onStageChange }: RequestDetailProps) => {
  const [replyMode, setReplyMode] = useState(false);
  const [replyAs, setReplyAs] = useState<'personal' | 'company'>('company');
  const [replyTo, setReplyTo] = useState('');
  const [replyCc, setReplyCc] = useState('');
  const [replyBcc, setReplyBcc] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  if (!request) return null;

  const stage = STAGE_CONFIG.find(s => s.id === request.stage);
  const emailHistory = request.emailHistory || [];

  // Default signature
  const emailSignature = `
Best regards,
Saudi ProTech Team
info@saudiprotech.com`;

  // When entering reply mode, pre-fill the To field and signature
  const handleStartReply = () => {
    setReplyTo(request.senderEmail);
    setReplyCc('');
    setReplyBcc('');
    setReplyBody(`\n\n${emailSignature}`);
    setReplyMode(true);
  };

  const handleStageChange = (newStage: RequestStage) => {
    if (onStageChange) {
      onStageChange(request.id, newStage);
      toast.success(`Status changed to ${STAGE_CONFIG.find(s => s.id === newStage)?.label}`);
    }
  };
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    toast.success('Note added');
    setNewNote('');
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    toast.success('Task created');
    setNewTaskTitle('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold text-foreground leading-tight truncate">
                {request.subject}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {/* Status Selector */}
                <Select value={request.stage} onValueChange={(val) => handleStageChange(val as RequestStage)}>
                  <SelectTrigger className="w-[160px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_CONFIG.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <div className={cn('w-2 h-2 rounded-full', s.color)} />
                          {s.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {request.priority && (
                  <Badge 
                    variant="outline"
                    className={cn(
                      'text-xs',
                      request.priority === 'high' && 'border-destructive text-destructive',
                      request.priority === 'medium' && 'border-warning text-warning',
                      request.priority === 'low' && 'border-success text-success'
                    )}
                  >
                    {request.priority} priority
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden flex">
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Sender Info Bar */}
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.senderName}`} />
                  <AvatarFallback>{request.senderName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{request.senderName}</p>
                  <p className="text-sm text-muted-foreground">{request.senderEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{format(request.receivedAt, 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="email" className="flex-1 flex flex-col min-h-0">
              <TabsList className="shrink-0 w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="email" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email History
                </TabsTrigger>
                <TabsTrigger 
                  value="comments" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Comments ({request.notes.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Tasks ({request.tasks.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-4 space-y-4">
                    {/* Email History */}
                    <div className="space-y-4">
                      {emailHistory.map((email, idx) => (
                        <div 
                          key={email.id}
                          className={cn(
                            "rounded-lg border p-4",
                            email.direction === 'outbound' ? 'bg-primary/5 ml-8' : 'bg-card mr-8'
                          )}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className={cn(
                              "p-1.5 rounded-full",
                              email.direction === 'inbound' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                            )}>
                              {email.direction === 'inbound' ? (
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{email.direction === 'inbound' ? 'From:' : 'To:'}</span>
                                <span className="text-muted-foreground">{email.direction === 'inbound' ? email.from : email.to}</span>
                              </div>
                              {email.direction === 'outbound' && email.sentAs && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                  {email.sentAs === 'company' ? (
                                    <Building2 className="w-3 h-3" />
                                  ) : (
                                    <User className="w-3 h-3" />
                                  )}
                                  Sent as {email.sentAs === 'company' ? 'company account' : 'personal'}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              {format(email.sentAt, 'MMM d, h:mm a')}
                            </div>
                          </div>
                          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                            {email.body}
                          </pre>
                        </div>
                      ))}
                    </div>

                    {/* Attachments */}
                    {request.attachments.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          Attachments
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {request.attachments.map(att => (
                            <div 
                              key={att.id}
                              className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm cursor-pointer hover:bg-muted transition-colors"
                            >
                              <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="flex-1 truncate">{att.name}</span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {(att.size / 1024).toFixed(0)} KB
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Section */}
                    <div className="border-t pt-4 mt-4">
                      {!replyMode ? (
                        <Button onClick={handleStartReply} className="w-full">
                          <Reply className="w-4 h-4 mr-2" />
                          Reply to Email
                        </Button>
                      ) : (
                        <EmailComposer
                          to={replyTo}
                          onToChange={setReplyTo}
                          cc={replyCc}
                          onCcChange={setReplyCc}
                          bcc={replyBcc}
                          onBccChange={setReplyBcc}
                          body={replyBody}
                          onBodyChange={setReplyBody}
                          replyAs={replyAs}
                          onReplyAsChange={setReplyAs}
                          onSend={(attachments) => {
                            toast.success(`Reply sent as ${replyAs === 'company' ? 'company account' : 'personal account'} with ${attachments.length} attachment(s)`);
                            setReplyBody('');
                            setReplyMode(false);
                          }}
                          onCancel={() => setReplyMode(false)}
                          draftKey={`request-${request.id}`}
                        />
                      )}
                    </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="flex-1 m-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {request.notes.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No comments yet. Add the first comment below.
                      </div>
                    ) : (
                      request.notes.map(note => (
                        <div key={note.id} className="flex gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={note.authorAvatar} />
                            <AvatarFallback className="text-xs">
                              {note.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{note.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-sm text-foreground">{note.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Add Comment */}
                <div className="border-t p-4 shrink-0">
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Add a comment..." 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[60px] flex-1"
                    />
                  </div>
                  <Button 
                    onClick={handleAddNote} 
                    disabled={!newNote.trim()}
                    className="mt-2 w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="flex-1 m-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {request.tasks.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No tasks yet. Create the first task below.
                      </div>
                    ) : (
                      request.tasks.map(task => (
                        <div 
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                        >
                          <input 
                            type="checkbox" 
                            checked={task.status === 'completed'}
                            className="w-4 h-4 rounded border-border"
                            readOnly
                          />
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm font-medium truncate',
                              task.status === 'completed' && 'line-through text-muted-foreground'
                            )}>
                              {task.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Due {format(task.dueDate, 'MMM d, yyyy')}
                            </p>
                          </div>
                          {task.assignedTo && (
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarImage src={task.assignedToAvatar} />
                              <AvatarFallback className="text-xs">
                                {task.assignedTo.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Add Task */}
                <div className="border-t p-4 shrink-0">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="New task title..." 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-64 border-l bg-muted/20 p-4 shrink-0 hidden lg:block">
            <h3 className="text-sm font-medium mb-4">Details</h3>
            
            {/* Assignee */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Assigned to</p>
              {request.assignedTo ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={request.assignedToAvatar} />
                    <AvatarFallback className="text-xs">
                      {request.assignedTo.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{request.assignedTo}</span>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            {/* Meta Info */}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Received</p>
                <p className="font-medium">{format(request.receivedAt, 'MMM d, yyyy')}</p>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(request.receivedAt, { addSuffix: true })}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <Badge variant="secondary" className="capitalize">{request.category.replace('_', ' ')}</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
