import { Request, STAGE_CONFIG } from '@/types/request';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  requests: Request[];
  onCardClick?: (request: Request) => void;
}

export const KanbanBoard = ({ requests, onCardClick }: KanbanBoardProps) => {
  const groupedRequests = STAGE_CONFIG.reduce((acc, stage) => {
    acc[stage.id] = requests.filter(r => r.stage === stage.id);
    return acc;
  }, {} as Record<string, Request[]>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {STAGE_CONFIG.map((stage) => (
        <KanbanColumn
          key={stage.id}
          stage={stage}
          requests={groupedRequests[stage.id] || []}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};
