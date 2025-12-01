'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Button from '@/components/ui/Button';
import { CalendarIcon, TrashIcon, CheckCircleIcon, ClockIcon } from '@/components/icons/DashboardIcons';
import { authApi, appointmentApi, tokenManager } from '@/lib/api';

export default function AppointmentsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useMemo(() => tokenManager.get(), []);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const [profile, appts] = await Promise.all([
          authApi.getProfile(token),
          appointmentApi.getAll(token),
        ]);
        setUser(profile.user);
        setAppointments(appts.appointments || []);
      } catch (err) {
        console.error('Load appointments failed:', err);
        if (err.status === 401) {
          tokenManager.remove();
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router, token]);

  const deleteAppointment = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      await appointmentApi.remove(token, id);
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <DashboardLayout user={user}>
      <DashboardHeader
        title={<><span>Appointments</span></>}
        subtitle="Schedule and manage family appointments"
        actions={(
          <Button
            variant="outline"
            className="btn-new-appointment"
            onClick={() => router.push('/dashboard/appointments/new')}
          >
            <CalendarIcon size={18} />
            New Appointment
          </Button>
        )}
      />

      {loading ? (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading appointments...</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-row">No appointments yet</td>
                </tr>
              )}

              {appointments.map((a) => {
                const isCompleted = a.status === 'completed';
                const isCancelled = a.status === 'cancelled';
                const isUpcoming = a.status === 'scheduled' || (!isCompleted && !isCancelled);
                return (
                  <tr key={a._id}>
                    <td>{user?.name || 'You'}</td>
                    <td>{a.doctor}</td>
                    <td>{formatDate(a.appointmentDate)}</td>
                    <td>{formatTime(a.appointmentDate)}</td>
                    <td>
                      {isCompleted && (
                        <span className="status-pill status-completed"><CheckCircleIcon size={14} /> Completed</span>
                      )}
                      {isUpcoming && (
                        <span className="status-pill status-upcoming"><ClockIcon size={14} /> Upcoming</span>
                      )}
                      {isCancelled && (
                        <span className="status-pill status-cancelled">Cancelled</span>
                      )}
                    </td>
                    <td className="notes-cell">{a.notes || '-'}</td>
                    <td className="actions-cell">
                      <button className="table-btn danger" onClick={() => deleteAppointment(a._id)}>
                        <TrashIcon size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
