import { 
  LayoutDashboard, 
  Inbox, 
  Kanban, 
  Settings, 
  Users, 
  ChevronDown,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import protechLogo from '@/assets/protech-logo.webp';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Pipeline', href: '/pipeline', icon: Kanban },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
        <img src={protechLogo} alt="Saudi ProTech" className="h-10 w-auto" />
        <span className="text-sm font-semibold text-sidebar-foreground leading-tight">Saudi ProTech</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn('nav-item', isActive && 'active')}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-primary-foreground">JD</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-sidebar-foreground">John Doe</p>
            <p className="text-xs text-sidebar-foreground/60">Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />
        </button>
      </div>
    </aside>
  );
};
