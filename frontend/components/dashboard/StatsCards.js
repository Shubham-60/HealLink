'use client';
import { FileTextIcon, CalendarIcon, UsersIcon, ChartBarIcon } from '../icons/DashboardIcons';

export default function StatsCards({ stats = {} }) {
  const cards = [
    {
      title: 'Total Records',
      value: stats.records || 0,
      icon: FileTextIcon,
      color: 'var(--primary)',
      bgColor: 'rgba(37,99,235,0.08)'
    },
    {
      title: 'Upcoming Appointments',
      value: stats.appointments || 0,
      icon: CalendarIcon,
      color: 'var(--primary)',
      bgColor: 'rgba(37,99,235,0.08)'
    },
    {
      title: 'Family Members',
      value: stats.familyMembers || 0,
      icon: UsersIcon,
      color: 'var(--primary)',
      bgColor: 'rgba(37,99,235,0.08)'
    },
    {
      title: 'Recently Added',
      value: stats.recentlyAdded || 0,
      icon: ChartBarIcon,
      color: 'var(--primary)',
      bgColor: 'rgba(37,99,235,0.08)'
    },
  ];

  return (
    <div className="stats-horizontal-grid">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="stat-card-horizontal">
            <div className="stat-content">
              <h3 className="stat-title-horizontal">{card.title}</h3>
              <p className="stat-value-horizontal">{card.value}</p>
            </div>
            <div
              className="stat-icon-circular"
              style={{ backgroundColor: card.bgColor, color: card.color }}
            >
              <Icon size={26} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
