import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Settings,
  LogOut, FileText, GraduationCap, Menu, X
} from 'lucide-react';

const navConfig = {
  Admin: [
    { icon: LayoutDashboard, label: 'Dashboard',   path: '/admin' },
  ],
  Student: [
    { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard' },
    { icon: FileText,        label: 'Transcripts', path: '/transcript' },
  ],
};

const roleColors = {
  Admin:    { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc' },
  Student:  { bg: 'rgba(245,158,11,0.15)', text: '#fcd34d' },
};

const Sidebar = ({ role = 'Admin', userName = 'Administrator' }) => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const navItems   = navConfig[role] || navConfig.Admin;
  const roleColor  = roleColors[role] || roleColors.Admin;
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const sidebarContent = (
    <aside style={{
      width: '260px',
      background: 'rgba(10, 10, 15, 0.97)',
      backdropFilter: 'blur(24px)',
      borderRight: '1px solid var(--border-color)',
      padding: '28px 0',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Logo + mobile close */}
      <div style={{ padding: '0 24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h2 className="text-gradient" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <GraduationCap size={20} color="var(--accent-primary)" />
            Rising Legacy
          </h2>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', paddingLeft: '28px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Grading System
          </span>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', padding: '4px', borderRadius: '6px',
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* User Badge */}
      <div style={{ padding: '0 16px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '11px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontWeight: '600', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>
              {userName}
            </p>
            <span style={{
              fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.04em',
              padding: '1px 8px', borderRadius: '9999px',
              background: roleColor.bg, color: roleColor.text,
            }}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        <p style={{
          fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em',
          color: 'var(--text-muted)', padding: '0 12px', marginBottom: '8px'
        }}>Navigation</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.path}
                end={item.path.split('/').length <= 2}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: 'var(--border-radius-sm)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.9rem',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none',
                })}
                className="sidebar-nav-link"
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign Out */}
      <div style={{ padding: '12px' }}>
        <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '10px' }} />
        <button
          onClick={() => navigate('/auth')}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            width: '100%', padding: '10px 14px',
            background: 'transparent', border: '1px solid transparent',
            borderRadius: 'var(--border-radius-sm)',
            color: '#f87171', fontWeight: '500', fontSize: '0.9rem',
            cursor: 'pointer', transition: 'all var(--transition-fast)',
          }}
          className="logout-btn"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* === DESKTOP: sticky sidebar === */}
      <div className="sidebar-desktop">
        <div style={{ width: '260px', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
          {sidebarContent}
        </div>
      </div>

      {/* === MOBILE: top bar + drawer === */}
      <div className="sidebar-mobile-bar">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--text-primary)', cursor: 'pointer',
            padding: '6px', borderRadius: '8px',
            display: 'flex', alignItems: 'center',
          }}
        >
          <Menu size={24} />
        </button>
        <span className="text-gradient" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '1.1rem' }}>
          Rising Legacy
        </span>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'var(--accent-gradient)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontWeight: '700', fontSize: '0.85rem',
        }}>
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 998, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 999,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
