import { Phone, LayoutDashboard, FileText, BarChart2, Users, Server, Shield, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../AuthContext'

const navGroups = [
  {
    section: 'Analytics',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', active: true },
      { icon: FileText,        label: 'Call Logs' },
      { icon: BarChart2,       label: 'Reports' },
    ],
  },
  {
    section: 'Management',
    items: [
      { icon: Users,  label: 'Customers' },
      { icon: Server, label: 'Trunks' },
      { icon: Shield, label: 'Security' },
    ],
  },
]

function NavItem({ item }) {
  const [hover, setHover] = useState(false)
  const active = item.active
  return (
    <a href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, padding: '8px 11px',
        borderRadius: 7, marginBottom: 2, textDecoration: 'none', fontSize: 13.5,
        fontWeight: active ? 600 : 500,
        color: active ? '#60a5fa' : (hover ? '#ffffff' : '#94a3b8'),
        background: active ? 'rgba(37,99,235,0.12)' : (hover ? '#1e293b' : 'transparent'),
        transition: 'all .15s',
      }}>
      <item.icon style={{ width: 17, height: 17 }} />
      {item.label}
    </a>
  )
}

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside style={{
      width: 256, position: 'fixed', left: 0, top: 0, bottom: 0,
      background: '#0f172a',
      borderRight: '1px solid #1e293b',
      display: 'flex', flexDirection: 'column', zIndex: 30,
    }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', borderBottom: '1px solid #1e293b' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 7,
          background: '#2563eb',
          display: 'grid', placeItems: 'center',
        }}>
          <Phone style={{ width: 17, height: 17, color: '#ffffff' }} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>PineVox</span>
      </div>

      <nav style={{ flex: 1, padding: '22px 12px', overflowY: 'auto' }}>
        {navGroups.map(g => (
          <div key={g.section} style={{ marginBottom: 28 }}>
            <p style={{ padding: '0 11px', marginBottom: 8, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8' }}>
              {g.section}
            </p>
            {g.items.map(item => <NavItem key={item.label} item={item} />)}
          </div>
        ))}
      </nav>

      <div style={{ padding: '14px 12px 16px', borderTop: '1px solid #1e293b' }}>
        {[{ icon: Settings, label: 'Settings' }, { icon: HelpCircle, label: 'Support' }].map(item => (
          <NavItem key={item.label} item={item} />
        ))}
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 11,
          padding: '8px 11px', borderRadius: 7, border: 'none', marginTop: 2,
          background: 'transparent', cursor: 'pointer',
          fontSize: 13.5, fontWeight: 500, color: '#f87171', textAlign: 'left',
          fontFamily: 'inherit',
        }}>
          <LogOut style={{ width: 17, height: 17 }} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}