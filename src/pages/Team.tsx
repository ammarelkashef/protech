import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus,
  MoreHorizontal,
  Mail,
  Phone
} from 'lucide-react';

const teamMembers = [
  {
    id: '1',
    name: 'Mohammed Al-Hassan',
    email: 'mohammed.alhassan@company.com',
    role: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed',
    status: 'online',
    activeRequests: 8
  },
  {
    id: '2',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.alrashid@company.com',
    role: 'Sales Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    status: 'online',
    activeRequests: 12
  },
  {
    id: '3',
    name: 'Mahmoud Ibrahim',
    email: 'mahmoud.ibrahim@company.com',
    role: 'Account Executive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahmoud',
    status: 'away',
    activeRequests: 5
  },
  {
    id: '4',
    name: 'Karim Nasser',
    email: 'karim.nasser@company.com',
    role: 'Sales Representative',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
    status: 'offline',
    activeRequests: 7
  },
  {
    id: '5',
    name: 'Omar Al-Farsi',
    email: 'omar.alfarsi@company.com',
    role: 'Sales Representative',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    status: 'online',
    activeRequests: 4
  },
];

const Team = () => {
  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and permissions
            </p>
          </div>
          <Button className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search team members..." 
            className="pl-10"
          />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id}
              className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-all animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                      member.status === 'online' ? 'bg-success' :
                      member.status === 'away' ? 'bg-warning' : 'bg-muted'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Active Requests</p>
                  <p className="text-lg font-semibold text-foreground">{member.activeRequests}</p>
                </div>
                <Badge 
                  variant="secondary"
                  className={
                    member.status === 'online' ? 'bg-success/10 text-success' :
                    member.status === 'away' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                  }
                >
                  {member.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Team;
