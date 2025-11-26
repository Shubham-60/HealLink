import { 
  MedicalRecordIcon, 
  CalendarHeartIcon, 
  ShieldCheckIcon 
} from '../icons/HealthcareIcons';

export default function FeatureList({ features }) {
  const defaultFeatures = [
    {
      icon: MedicalRecordIcon,
      title: "Family Health Records",
      description: "Keep all medical documents organized for every family member."
    },
    {
      icon: CalendarHeartIcon,
      title: "Smart Appointments",
      description: "Track visits, set reminders, and manage follow-ups easily."
    },
    {
      icon: ShieldCheckIcon,
      title: "Bank-Level Security",
      description: "Your health data is encrypted and private"
    }
  ];

  const featuresToDisplay = features || defaultFeatures;

  return (
    <div className="brand-features">
      {featuresToDisplay.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div key={index} className="feature-item">
            <div className="feature-icon">
              <IconComponent size={24} />
            </div>
            <div className="feature-text">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
