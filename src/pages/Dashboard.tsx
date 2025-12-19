import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PipelineChart } from '@/components/dashboard/PipelineChart';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { mockRequests, getDashboardStats } from '@/data/mockData';
import { 
  Inbox, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const stats = getDashboardStats(mockRequests);

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your request pipeline and team performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Requests"
            value={stats.total}
            change={`+${stats.newThisWeek} this week`}
            changeType="positive"
            icon={Inbox}
            iconClassName="bg-primary/10"
          />
          <StatCard
            title="Active Pipeline"
            value={stats.active}
            change="In progress"
            changeType="neutral"
            icon={Clock}
            iconClassName="bg-warning/10"
          />
          <StatCard
            title="Win Rate"
            value={`${stats.winRate}%`}
            change={stats.winRate >= 50 ? '+5% vs last month' : '-3% vs last month'}
            changeType={stats.winRate >= 50 ? 'positive' : 'negative'}
            icon={TrendingUp}
            iconClassName="bg-accent/10"
          />
          <StatCard
            title="Closed Won"
            value={stats.won}
            change={`${stats.lost} lost`}
            changeType="neutral"
            icon={CheckCircle2}
            iconClassName="bg-success/10"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border p-6 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Pipeline Overview</h2>
                <p className="text-sm text-muted-foreground">Requests by stage</p>
              </div>
            </div>
            <PipelineChart data={stats.byStage} />
          </div>

          {/* Recent Requests */}
          <div className="bg-card rounded-xl border p-6 shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Requests</h2>
              <a href="/inbox" className="text-sm text-primary hover:underline">View all</a>
            </div>
            <RecentRequests requests={mockRequests} />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-card rounded-xl border p-6 shadow-sm animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                <p className="text-2xl font-bold text-foreground mt-1">2.4h</p>
              </div>
              <div className="flex items-center text-success text-sm">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                -12%
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border p-6 shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground mt-1">34%</p>
              </div>
              <div className="flex items-center text-success text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8%
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border p-6 shadow-sm animate-fade-in" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Utilization</p>
                <p className="text-2xl font-bold text-foreground mt-1">87%</p>
              </div>
              <div className="flex items-center text-warning text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +3%
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
