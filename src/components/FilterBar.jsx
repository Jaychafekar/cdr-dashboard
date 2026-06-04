export default function FilterBar({ filters, onFilterChange, cities }) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      background: '#ffffff', border: '1px solid #e2e8f0',
      borderRadius: 10, padding: '12px 16px', boxShadow: '0 1px 2px 0 rgba(15,23,42,0.05)',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[
          { key: 'city',      label: 'All Cities',     options: cities.map(c => ({ value: c, label: c })) },
          { key: 'status',    label: 'All Status',     options: [{ value: 'success', label: 'Completed' }, { value: 'failed', label: 'Failed' }] },
          { key: 'direction', label: 'All Directions', options: [{ value: 'inbound', label: 'Inbound' }, { value: 'outbound', label: 'Outbound' }] },
        ].map(f => (
          <select key={f.key} value={filters[f.key]} onChange={e => onFilterChange(f.key, e.target.value)}
            style={{
              padding: '7px 30px 7px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              background: '#f8fafc', border: '1px solid #e2e8f0',
              color: '#334155', appearance: 'none', outline: 'none', fontWeight: 500,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: 16,
            }}
          >
            <option value="">{f.label}</option>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}

        {/* Date Range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={e => onFilterChange('startDate', e.target.value)}
            style={{
              padding: '7px 10px', borderRadius: 8, fontSize: 13,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              color: '#334155', outline: 'none', cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: 12, color: '#94a3b8' }}>to</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={e => onFilterChange('endDate', e.target.value)}
            style={{
              padding: '7px 10px', borderRadius: 8, fontSize: 13,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              color: '#334155', outline: 'none', cursor: 'pointer',
            }}
          />
        </div>

        {(filters.city || filters.status || filters.direction || filters.search || filters.startDate || filters.endDate) && (
          <button onClick={() => onFilterChange('reset')} style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer',
          }}>
            Clear
          </button>
        )}
      </div>
      <span style={{ fontSize: 12.5, color: '#64748b' }}>
        Updated just now · <strong style={{ color: '#0f172a' }}>{filters.totalRecords || 0}</strong> records
      </span>
    </div>
  )
}