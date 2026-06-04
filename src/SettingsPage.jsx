import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Settings, User, Bell, Shield, Database, Save } from 'lucide-react'
import { useAuth } from './AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    emailAlerts: false,
    highCostThreshold: '800',
    refreshInterval: '30',
    timezone: 'Europe/London',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Section = ({ icon: Icon, title, children }) => (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'grid', placeItems: 'center' }}>
          <Icon style={{ width: 15, height: 15, color: '#2563eb' }} />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{title}</h3>
      </div>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )

  const Field = ({ label, desc, children }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13.5, fontWeight: 500, color: '#0f172a', marginBottom: 3 }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: '#64748b' }}>{desc}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )

  const Input = ({ value, onChange, type = 'text', width = 200 }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      style={{ width, padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', background: '#f8fafc' }}
    />
  )

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: value ? '#2563eb' : '#e2e8f0', position: 'relative', transition: 'background .2s',
      }}>
      <span style={{
        position: 'absolute', top: 2, left: value ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%', background: '#ffffff',
        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <Sidebar activePage="Settings" />
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
          <h1 style={{ fontSize: 19, fontWeight: 600, color: '#0f172a' }}>Settings</h1>
          <button
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: saved ? '#10b981' : '#2563eb', border: 'none', cursor: 'pointer', transition: 'background .2s' }}>
            <Save style={{ width: 14, height: 14, color: '#ffffff' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>{saved ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </header>

        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>

          <Section icon={User} title="Profile">
            <Field label="Full Name" desc="Your display name across the platform">
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </Field>
            <Field label="Email Address" desc="Used for login and notifications">
              <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" />
            </Field>
            <Field label="Role" desc="Your access level">
              <span style={{ padding: '6px 12px', borderRadius: 8, background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{user?.role || 'analyst'}</span>
            </Field>
          </Section>

          <Section icon={Bell} title="Notifications">
            <Field label="Dashboard Alerts" desc="Show alerts for suspicious activity on dashboard">
              <Toggle value={form.notifications} onChange={v => setForm(p => ({ ...p, notifications: v }))} />
            </Field>
            <Field label="Email Alerts" desc="Receive email notifications for high cost calls">
              <Toggle value={form.emailAlerts} onChange={v => setForm(p => ({ ...p, emailAlerts: v }))} />
            </Field>
          </Section>

          <Section icon={Shield} title="Security Thresholds">
            <Field label="High Cost Alert Threshold" desc="Flag calls above this amount as suspicious">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>$</span>
                <Input value={form.highCostThreshold} onChange={e => setForm(p => ({ ...p, highCostThreshold: e.target.value }))} type="number" width={120} />
              </div>
            </Field>
          </Section>

          <Section icon={Database} title="Data & Display">
            <Field label="Auto Refresh Interval" desc="How often the dashboard refreshes data">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Input value={form.refreshInterval} onChange={e => setForm(p => ({ ...p, refreshInterval: e.target.value }))} type="number" width={80} />
                <span style={{ fontSize: 13, color: '#64748b' }}>seconds</span>
              </div>
            </Field>
            <Field label="Timezone" desc="Used for displaying timestamps">
              <select
                value={form.timezone}
                onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', background: '#f8fafc', width: 200 }}
              >
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                <option value="Asia/Karachi">Asia/Karachi (GMT+5)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
              </select>
            </Field>
          </Section>

        </div>
      </main>
    </div>
  )
}