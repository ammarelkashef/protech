import { Request } from '@/types/request';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Paperclip, MessageSquare, CheckSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  request: Request;
  onClick?: () => void;
}

export const KanbanCard = ({ request, onClick }: KanbanCardProps) => {
  const initials = request.senderName.split(' ').map(n => n[0]).join('');
  const hasAttachments = request.attachments.length > 0;
  const hasNotes = request.notes.length > 0;
  const hasTasks = request.tasks.length > 0;

  return (
    <div 
      className="kanban-card"
      onClick={onClick}
      draggable
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-sm text-foreground line-clamp-2 flex-1 pr-2">
          {request.subject}
        </h4>
        {request.priority && (
          <div className={cn(
            'w-2 h-2 rounded-full flex-shrink-0 mt-1.5',
            request.priority === 'high' && 'bg-destructive',
            request.priority === 'medium' && 'bg-warning',
            request.priority === 'low' && 'bg-success'
          )} />
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mb-3">
        {request.senderName}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasAttachments && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Paperclip className="w-3.5 h-3.5" />
              <span className="text-xs">{request.attachments.length}</span>
            </div>
          )}
          {hasNotes && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-xs">{request.notes.length}</span>
            </div>
          )}
          {hasTasks && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="text-xs">{request.tasks.length}</span>
            </div>
          )}
        </div>
        
        {request.assignedTo ? (
          <Avatar className="h-6 w-6">
            <AvatarImage src={request.assignedToAvatar} />
            <AvatarFallback className="text-[10px]">
              {request.assignedTo.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(request.receivedAt, { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
};
