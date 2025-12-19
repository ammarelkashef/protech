import { Request, StageConfig } from '@/types/request';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  stage: StageConfig;
  requests: Request[];
  onCardClick?: (request: Request) => void;
}

export const KanbanColumn = ({ stage, requests, onCardClick }: KanbanColumnProps) => {
  return (
    <div className="kanban-column min-w-[280px] max-w-[280px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn('w-2.5 h-2.5 rounded-full', stage.color)} />
          <h3 className="font-semibold text-sm text-foreground">{stage.label}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {requests.length}
          </span>
        </div>
        <button className="p-1 hover:bg-muted rounded transition-colors">
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {requests.map((request, index) => (
          <div 
            key={request.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <KanbanCard 
              request={request} 
              onClick={() => onCardClick?.(request)}
            />
          </div>
        ))}
        
        {requests.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-center py-8">
            <p className="text-sm text-muted-foreground">No requests</p>
          </div>
        )}
      </div>
    </div>
  );
};
