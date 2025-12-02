'use client';
import { CalendarIcon, ClockIcon } from '../icons/DashboardIcons';
import { useRouter } from 'next/navigation';

export default function UpcomingAppointmentsList({ appointments = [] }) {
  const router = useRouter();
  // Use real backend data if available; otherwise show nothing
  const displayAppointments = (appointments || []).slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getIconColor = (index) => {
    const colors = [
      { bg: 'rgba(255, 107, 107, 0.15)', color: '#FF6B6B' },
      { bg: 'rgba(255, 107, 107, 0.15)', color: '#FF6B6B' },
      { bg: 'rgba(255, 107, 107, 0.15)', color: '#FF6B6B' }
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="appointments-list-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="section-icon-wrapper">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="section-title">Upcoming Appointments</h2>
            <p className="section-subtitle">Next scheduled appointments</p>
          </div>
        </div>
        <button
         className="view-all-link"
         onClick={() => {router.push('/dashboard/appointments')}}
        >
          View All <span className="arrow-right">→</span>
        </button>
      </div>

      <div className="appointments-list">
        {displayAppointments.length === 0 ? (
          <div className="empty-row" style={{ padding: '1rem 0', color: '#64748b' }}>
            No appointments yet
          </div>
        ) : displayAppointments.map((appointment, index) => {
          const iconStyle = getIconColor(index);
          return (
            <div key={appointment._id || index} className="appointment-list-item">
              <div 
                className="appointment-icon-circle"
                style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}
              >
                <ClockIcon size={20} />
              </div>
              <div className="appointment-info">
                <h3 className="appointment-list-title">{appointment.member?.name || 'Unknown'}</h3>
                <p className="appointment-list-meta">{appointment.doctor}</p>
              </div>
              <div className="appointment-datetime">
                <div className="appointment-date">{formatDate(appointment.appointmentDate)}</div>
                <div className="appointment-time">{formatTime(appointment.appointmentDate)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
