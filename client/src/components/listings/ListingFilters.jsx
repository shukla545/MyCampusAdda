import FormCheckbox from '../forms/FormCheckbox.jsx';
import FormInput from '../forms/FormInput.jsx';
import FormSelect from '../forms/FormSelect.jsx';

export default function ListingFilters({ type, filters, setFilters }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-950">Filters</h3>
        <button className="text-sm font-semibold text-brand" onClick={() => setFilters({})}>Reset</button>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Min price" type="number" value={filters.minPrice || ''} onChange={(e) => update('minPrice', e.target.value)} />
          <FormInput label="Max price" type="number" value={filters.maxPrice || ''} onChange={(e) => update('maxPrice', e.target.value)} />
        </div>
        {type === 'pg' ? (
          <>
            <FormSelect label="Gender" value={filters.gender || ''} onChange={(e) => update('gender', e.target.value)}>
              <option value="">Any</option><option value="boys">Boys</option><option value="girls">Girls</option><option value="co-living">Co-living</option>
            </FormSelect>
            <FormInput label="Sharing type" value={filters.sharingType || ''} onChange={(e) => update('sharingType', e.target.value)} placeholder="Double sharing" />
            <FormCheckbox label="Food included" checked={filters.foodIncluded || false} onChange={(e) => update('foodIncluded', e.target.checked)} />
          </>
        ) : (
          <>
            <FormSelect label="Food type" value={filters.foodType || ''} onChange={(e) => update('foodType', e.target.value)}>
              <option value="">Any</option><option value="veg">Veg</option><option value="non-veg">Non-veg</option><option value="both">Both</option>
            </FormSelect>
            <FormSelect label="Meals" value={filters.meals || ''} onChange={(e) => update('meals', e.target.value)}>
              <option value="">Any</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option>
            </FormSelect>
            <FormCheckbox label="Trial available" checked={filters.trialAvailable || false} onChange={(e) => update('trialAvailable', e.target.checked)} />
          </>
        )}
        <FormCheckbox label="Verified only" checked={filters.verified || false} onChange={(e) => update('verified', e.target.checked)} />
        <FormCheckbox label="Featured only" checked={filters.featured || false} onChange={(e) => update('featured', e.target.checked)} />
      </div>
    </aside>
  );
}
