'use client';
import { CalendarIcon, ClockIcon } from '../icons/DashboardIcons';

export default function UpcomingAppointmentsList({ appointments = [] }) {
  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 1,
      patientName: 'Shubham',
      doctor: 'Dr. Rajesh Kumar',
      date: '2025-03-01',
      time: '10:00 AM'
    },
    {
      id: 2,
      patientName: 'Arjun',
      doctor: 'Dr. Sanjay Patel',
      date: '2025-03-05',
      time: '2:30 PM'
    },
    {
      id: 3,
      patientName: 'Priya',
      doctor: 'Dr. Meera Sharma',
      date: '2025-03-10',
      time: '11:00 AM'
    }
  ];

  const displayAppointments = appointments.length > 0 ? appointments.slice(0, 3) : mockAppointments;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        <button className="view-all-link">
          View All <span className="arrow-right">→</span>
        </button>
      </div>

      <div className="appointments-list">
        {displayAppointments.map((appointment, index) => {
          const iconStyle = getIconColor(index);
          return (
            <div key={appointment.id} className="appointment-list-item">
              <div 
                className="appointment-icon-circle"
                style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}
              >
                <ClockIcon size={20} />
              </div>
              <div className="appointment-info">
                <h3 className="appointment-list-title">{appointment.patientName}</h3>
                <p className="appointment-list-meta">{appointment.doctor}</p>
              </div>
              <div className="appointment-datetime">
                <div className="appointment-date">{formatDate(appointment.date)}</div>
                <div className="appointment-time">{appointment.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
