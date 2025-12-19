import { Request, STAGE_CONFIG } from '@/types/request';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RecentRequestsProps {
  requests: Request[];
}

export const RecentRequests = ({ requests }: RecentRequestsProps) => {
  const recentRequests = [...requests]
    .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {recentRequests.map((request, index) => {
        const stage = STAGE_CONFIG.find(s => s.id === request.stage);
        return (
          <div 
            key={request.id} 
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.senderName}`} />
              <AvatarFallback>{request.senderName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{request.subject}</p>
              <p className="text-sm text-muted-foreground truncate">{request.senderName}</p>
            </div>
            <div className="text-right">
              <Badge 
                variant="secondary"
                className={cn(
                  'text-xs',
                  stage?.id === 'new' && 'bg-primary/10 text-primary',
                  stage?.id === 'won' && 'bg-success/10 text-success',
                  stage?.id === 'lost' && 'bg-destructive/10 text-destructive'
                )}
              >
                {stage?.label}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(request.receivedAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
