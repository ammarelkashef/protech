import { Request, RequestStage } from '@/types/request';

const generateId = () => Math.random().toString(36).substr(2, 9);

const names = [
  'Mohammed Al-Hassan', 'Ahmed Al-Rashid', 'Mahmoud Ibrahim', 'Karim Nasser', 
  'Omar Al-Farsi', 'Youssef Al-Qasim', 'Khalid Al-Zahrani', 'Hassan Al-Majid',
  'Faisal Al-Otaibi', 'Tariq Al-Harbi'
];

const companies = [
  'TechCorp Industries', 'Global Solutions Inc', 'Innovate Labs', 
  'Summit Enterprises', 'Nexus Digital', 'Prime Consulting', 
  'Atlas Manufacturing', 'Vertex Systems', 'Horizon Group', 'Stellar Tech'
];

const subjects = [
  'Partnership Inquiry for Q1 2025',
  'Request for Proposal - Enterprise Solution',
  'Product Demo Request',
  'Pricing Information Needed',
  'Integration Capabilities Question',
  'Custom Development Inquiry',
  'Support Package Options',
  'Bulk Order Discount Request',
  'Technical Consultation Request',
  'Strategic Partnership Opportunity'
];

const stages: RequestStage[] = ['new', 'under_review', 'contacted', 'proposal_sent', 'negotiation', 'won', 'lost'];

const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahmoud',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
];

export const generateMockRequests = (count: number = 25): Request[] => {
  return Array.from({ length: count }, (_, i) => {
    const name = names[i % names.length];
    const company = companies[i % companies.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const stage = stages[Math.floor(Math.random() * stages.length)];
    
    return {
      id: generateId(),
      senderName: name,
      senderEmail: `${name.toLowerCase().replace(/\s+/g, '.').replace(/-/g, '')}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      subject: subjects[i % subjects.length],
      body: `Hi,\n\nI'm reaching out from ${company} regarding a potential collaboration opportunity. We've been following your company's growth and believe there could be significant synergies between our organizations.\n\nWe're particularly interested in:\n- Your enterprise solutions\n- Integration capabilities\n- Custom development options\n\nWould you be available for a call this week to discuss further?\n\nBest regards,\n${name}\n${company}`,
      attachments: Math.random() > 0.7 ? [
        {
          id: generateId(),
          name: 'requirements.pdf',
          size: 245000,
          type: 'application/pdf',
          url: '#'
        }
      ] : [],
      receivedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      stage,
      category: 'customer',
      assignedTo: Math.random() > 0.3 ? names[Math.floor(Math.random() * 5)] : undefined,
      assignedToAvatar: Math.random() > 0.3 ? avatars[Math.floor(Math.random() * 5)] : undefined,
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      notes: Math.random() > 0.5 ? [
        {
          id: generateId(),
          content: 'Initial contact made. They seem very interested in our enterprise plan.',
          author: names[Math.floor(Math.random() * 5)],
          authorAvatar: avatars[Math.floor(Math.random() * 5)],
          createdAt: new Date(Date.now() - (daysAgo - 1) * 24 * 60 * 60 * 1000)
        }
      ] : [],
      tasks: Math.random() > 0.6 ? [
        {
          id: generateId(),
          title: 'Follow up with proposal',
          assignedTo: names[Math.floor(Math.random() * 5)],
          assignedToAvatar: avatars[Math.floor(Math.random() * 5)],
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ] : [],
      emailHistory: [
        {
          id: generateId(),
          direction: 'inbound' as const,
          from: `${name.toLowerCase().replace(/\s+/g, '.').replace(/-/g, '')}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
          to: 'info@company.com',
          subject: subjects[i % subjects.length],
          body: `Hi,\n\nI'm reaching out from ${company} regarding a potential collaboration opportunity. We've been following your company's growth and believe there could be significant synergies between our organizations.\n\nWe're particularly interested in:\n- Your enterprise solutions\n- Integration capabilities\n- Custom development options\n\nWould you be available for a call this week to discuss further?\n\nBest regards,\n${name}\n${company}`,
          sentAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
          sentBy: name
        }
      ]
    };
  });
};

export const mockRequests = generateMockRequests(25);

export const getDashboardStats = (requests: Request[]) => {
  const total = requests.length;
  const byStage = stages.reduce((acc, stage) => {
    acc[stage] = requests.filter(r => r.stage === stage).length;
    return acc;
  }, {} as Record<RequestStage, number>);
  
  const won = byStage.won;
  const lost = byStage.lost;
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
  
  const newThisWeek = requests.filter(r => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return r.receivedAt >= weekAgo;
  }).length;
  
  return {
    total,
    byStage,
    won,
    lost,
    winRate,
    newThisWeek,
    active: total - won - lost
  };
};
