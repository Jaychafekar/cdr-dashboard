export default function FilterBar({ filters, onFilterChange, cities }) {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-card border rounded-xl">
      <input
        type="text"
        placeholder="🔍 Search caller name..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <select
        value={filters.city}
        onChange={(e) => onFilterChange('city', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">🏙️ All Cities</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">📊 All Status</option>
        <option value="success">✅ Success</option>
        <option value="failed">❌ Failed</option>
      </select>
      <select
        value={filters.direction}
        onChange={(e) => onFilterChange('direction', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">↔️ All Directions</option>
        <option value="inbound">📥 Inbound</option>
        <option value="outbound">📤 Outbound</option>
      </select>
      <button
        onClick={() => onFilterChange('reset')}
        className="border rounded-lg px-4 py-2 text-sm hover:bg-muted transition-colors"
      >
        Reset
      </button>
    </div>
  )
}