'use client';
import { CalendarIcon, EditIcon, TrashIcon } from '@/components/icons/DashboardIcons';

export default function FamilyMemberCard({ member, onEdit, onDelete }) {
  const { _id, name, relationship, dateOfBirth, avatar } = member;

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dateOfBirth);

  const getRelationshipColor = (rel) => {
    const colors = {
      'Self': 'relationship-self',
      'Spouse': 'relationship-spouse',
      'Son': 'relationship-son',
      'Daughter': 'relationship-daughter',
      'Father': 'relationship-father',
      'Mother': 'relationship-mother',
    };
    return colors[rel] || 'relationship-default';
  };

  const getAvatarColor = (name) => {
    const colors = [
      'avatar-teal',
      'avatar-orange',
      'avatar-purple',
      'avatar-pink',
      'avatar-blue',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="family-member-card">
      <div className="member-card-header">
        <div className={`member-avatar ${getAvatarColor(name)}`}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="member-info">
          <h3 className="member-name">{name}</h3>
          <span className={`relationship-badge ${getRelationshipColor(relationship)}`}>
            {relationship}
          </span>
        </div>
      </div>

      <div className="member-card-body">
        <div className="member-detail">
          <CalendarIcon size={16} className="detail-icon" />
          <span className="detail-label">DOB:</span>
          <span className="detail-value">{formatDate(dateOfBirth)}</span>
        </div>
        <div className="member-detail">
          <span className="detail-label">Age:</span>
          <span className="detail-value-bold">{age} years</span>
        </div>
      </div>

      <div className="member-card-actions">
        <button 
          className="member-action-btn edit-btn" 
          onClick={() => onEdit && onEdit(member)}
        >
          <EditIcon size={16} />
          Edit
        </button>
        <button 
          className="member-action-btn delete-btn-icon" 
          onClick={() => onDelete && onDelete(_id)}
          aria-label="Delete member"
        >
          <TrashIcon size={18} />
        </button>
      </div>
    </div>
  );
}
