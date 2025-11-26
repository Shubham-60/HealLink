import { HeartPulseIcon } from '../icons/HealthcareIcons';

export default function BrandHeader({ 
  title = "HealLink", 
  description = "Manage your family's health records, appointments, and wellness details all in one secure, organized dashboard",
  logoSize = 64
}) {
  return (
    <div className="brand-header-content">
      <div className="brand-icon">
        <HeartPulseIcon size={logoSize} />
      </div>
      <h1 className="brand-title">{title}</h1>
      <p className="brand-description">{description}</p>
    </div>
  );
}
