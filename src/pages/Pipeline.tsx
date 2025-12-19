import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { RequestDetail } from '@/components/request/RequestDetail';
import { mockRequests } from '@/data/mockData';
import { Request } from '@/types/request';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';

const Pipeline = () => {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCardClick = (request: Request) => {
    setSelectedRequest(request);
    setDetailOpen(true);
  };

  const handleStageChange = (requestId: string, newStage: Request['stage']) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, stage: newStage } : r));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  const filteredRequests = requests.filter(
    r => r.category === 'customer' && (
      searchQuery === '' ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.senderName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <AppLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b bg-background">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
              <p className="text-muted-foreground mt-1">
                Manage your request workflow
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button variant="ghost" size="sm" className="rounded-none border-r">
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search requests..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden p-6 pt-4">
          <KanbanBoard 
            requests={filteredRequests} 
            onCardClick={handleCardClick}
          />
        </div>

        {/* Request Detail Dialog */}
        <RequestDetail 
          request={selectedRequest}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStageChange={handleStageChange}
        />
      </div>
    </AppLayout>
  );
};

export default Pipeline;
