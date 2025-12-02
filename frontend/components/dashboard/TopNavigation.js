'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HeartPulseMarkIcon } from '../icons/HealthcareIcons';
import { HomeIcon, FileTextIcon, CalendarIcon, LogOutIcon, UsersIcon } from '../icons/DashboardIcons';
import { tokenManager } from '@/lib/api';
import { useUser } from '@/components/auth/UserProvider';

export default function TopNavigation({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user: ctxUser } = useUser();
  const effectiveUser = user || ctxUser;

  const logout = () => {
    tokenManager.remove();
    router.push('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { label: 'Records', path: '/dashboard/records', icon: FileTextIcon },
    { label: 'Appointments', path: '/dashboard/appointments', icon: CalendarIcon },
    { label: 'Family', path: '/dashboard/family', icon: UsersIcon },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-nav-header">
      <div className="top-nav-container">
        <div className="top-nav-brand">
          <div className="brand-logo-wrapper">
            <HeartPulseMarkIcon size={40} className="brand-logo" />
          </div>
          <div className="brand-name">
            <span className="brand-heal">Heal</span>
            <span className="brand-link">Link</span>
          </div>
        </div>

        <nav className="top-nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/dashboard'
              ? pathname === '/dashboard'
              : (pathname === item.path || pathname.startsWith(item.path + '/'));
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`top-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="top-nav-right">
          <div 
            className="top-nav-user-wrapper"
            ref={dropdownRef}
          >
            <div 
              className="top-nav-user"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar-small">
                {effectiveUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="user-name-small">{effectiveUser?.name || 'User'}</span>
            </div>
            
            {showDropdown && (
              <div className="user-dropdown">
                <button onClick={logout} className="dropdown-logout-btn">
                  <LogOutIcon size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
