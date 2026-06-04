import Sidebar from './components/Sidebar'
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  { q: 'What is a CDR?', a: 'A Call Detail Record (CDR) is a data record produced by a telephone exchange that documents the details of a telephone call — including the numbers involved, the start time, duration, and cost.' },
  { q: 'Why are some calls marked as Failed?', a: 'Calls under 10 seconds are classified as failed/dropped. This could indicate unanswered calls, network issues, or spam attempts.' },
  { q: 'What does the Security Risk Score mean?', a: 'The risk score is calculated based on the number of high cost calls, suspicious short calls, and after-hours activity. A score of 70+ is high risk.' },
  { q: 'How do I export call data?', a: 'Go to Call Logs page and click the Export CSV button at the top right. This will download all current filtered records as a CSV file.' },
  { q: 'What is the difference between Inbound and Outbound?', a: 'Inbound calls are received by your system. Outbound calls are made from your system to external numbers. Trunks page shows the split.' },
  { q: 'How often does the data refresh?', a: 'The dashboard fetches data from the CDR API each time you load the page. You can adjust the refresh interval in Settings.' },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <Sidebar activePage="Support" />
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

        <header style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
          <h1 style={{ fontSize: 19, fontWeight: 600, color: '#0f172a' }}>Support</h1>
        </header>

        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>

          {/* Quick Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: Book, label: 'Documentation', desc: 'Read the full platform guide', color: '#2563eb', bg: '#eff6ff' },
              { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with our support team', color: '#059669', bg: '#ecfdf5' },
              { icon: Mail, label: 'Email Support', desc: 'support@pinevox.com', color: '#7c3aed', bg: '#f5f3ff' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', boxShadow: '0 1px 2px rgba(15,23,42,0.05)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px rgba(15,23,42,0.05)'}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: m.bg, display: 'grid', placeItems: 'center', marginBottom: 12 }}>
                  <m.icon style={{ width: 17, height: 17, color: m.color }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{m.label}</p>
                <p style={{ fontSize: 12.5, color: '#64748b' }}>{m.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'grid', placeItems: 'center' }}>
                <HelpCircle style={{ width: 15, height: 15, color: '#2563eb' }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Frequently Asked Questions</h3>
            </div>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp style={{ width: 16, height: 16, color: '#64748b', flexShrink: 0 }} />
                    : <ChevronDown style={{ width: 16, height: 16, color: '#64748b', flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 16px', fontSize: 13.5, color: '#475569', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Platform Info */}
          <div style={{ background: '#0f172a', borderRadius: 12, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>PineVox CDR Platform</p>
              <p style={{ fontSize: 12.5, color: '#64748b' }}>Built by Jay Chafekar · London Success Academy Internship · 2026</p>
            </div>
            <a href="https://github.com/Jaychafekar/cdr-dashboard" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', textDecoration: 'none' }}>
              <ExternalLink style={{ width: 13, height: 13, color: '#94a3b8' }} />
              <span style={{ fontSize: 12.5, color: '#94a3b8' }}>View on GitHub</span>
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}