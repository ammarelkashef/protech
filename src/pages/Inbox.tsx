import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequestDetail } from '@/components/request/RequestDetail';
import { mockRequests } from '@/data/mockData';
import { Request, STAGE_CONFIG } from '@/types/request';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Archive,
  Trash2,
  Tag,
  Paperclip
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const Inbox = () => {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setDetailOpen(true);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleStageChange = (requestId: string, newStage: Request['stage']) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, stage: newStage } : r));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  const filteredRequests = requests
    .filter(r => 
      searchQuery === '' ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.senderEmail.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());

  return (
    <AppLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b bg-background">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
              <p className="text-muted-foreground mt-1">
                {filteredRequests.length} messages
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search inbox..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="px-6 py-3 bg-muted/50 border-b flex items-center gap-4 animate-fade-in">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
              <Button variant="ghost" size="sm">
                <Tag className="w-4 h-4 mr-2" />
                Categorize
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {filteredRequests.map((request, index) => {
            const stage = STAGE_CONFIG.find(s => s.id === request.stage);
            const isSelected = selectedIds.has(request.id);
            
            return (
              <div 
                key={request.id}
                className={cn(
                  'flex items-center gap-4 px-6 py-4 border-b hover:bg-muted/30 cursor-pointer transition-colors animate-fade-in',
                  isSelected && 'bg-primary/5'
                )}
                style={{ animationDelay: `${index * 20}ms` }}
                onClick={() => handleRequestClick(request)}
              >
                <Checkbox 
                  checked={isSelected}
                  onClick={(e) => toggleSelect(request.id, e)}
                />
                
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.senderName}`} />
                  <AvatarFallback>{request.senderName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground truncate">
                      {request.senderName}
                    </span>
                    {request.attachments.length > 0 && (
                      <Paperclip className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                    {request.priority === 'high' && (
                      <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-foreground truncate font-medium">
                    {request.subject}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {request.body.split('\n')[0]}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(request.receivedAt, { addSuffix: true })}
                  </span>
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
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
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

export default Inbox;
