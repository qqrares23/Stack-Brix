import { HeroSection } from '../components/features/hub/HeroSection';
import { CategoryFilter } from '../components/features/hub/CategoryFilter';
import { LibraryCard } from '../components/features/hub/LibraryCard';
import { useLibraries } from '../hooks/useLibraries';

export default function HubPage() {
  const { libraries, categories, activeCat, setActiveCat, search, setSearch, catTitle } = useLibraries();

  return (
    <main>
      <HeroSection search={search} onSearch={setSearch} />

      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '236px 1fr', gap: 34, padding: '38px 28px 72px' }}>
        <CategoryFilter categories={categories} activeCat={activeCat} onSelect={setActiveCat} />

        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 26, margin: 0 }}>
              {catTitle} <span style={{ color: 'var(--ink-soft)', fontWeight: 600, fontSize: 17 }}>· {libraries.length} {libraries.length === 1 ? 'library' : 'libraries'}</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'var(--ink-soft)', fontWeight: 600 }}>
              Sort
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink)', background: 'var(--surface)', border: '1.5px solid var(--line)', padding: '7px 12px', borderRadius: 9, cursor: 'pointer' }}>
                Most popular
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" /></svg>
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(296px,1fr))', gap: 18 }}>
            {libraries.map((lib) => <LibraryCard key={lib.name} lib={lib} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
