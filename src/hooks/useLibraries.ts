import { useState, useMemo } from 'react';
import type { Library, Category } from '../types/library';

// Replace `libraries` and `categories` with data fetched from Appwrite.
// See developer_docs.md → "Hub page / useLibraries" for the query shape.
export function useLibraries(
  initialLibraries: Library[] = [],
  initialCategories: Category[] = [],
) {
  const [libraries] = useState<Library[]>(initialLibraries);
  const [categories] = useState<Category[]>(initialCategories);
  const [activeCat, setActiveCat] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo<Library[]>(() => {
    let libs = activeCat === 'all' ? libraries : libraries.filter((l) => l.cat === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      libs = libs.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.author.toLowerCase().includes(q) ||
          l.desc.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return libs;
  }, [libraries, activeCat, search]);

  const activeCategory = useMemo<Category | undefined>(
    () => categories.find((c) => c.id === activeCat),
    [categories, activeCat],
  );

  return {
    libraries: filtered,
    categories,
    activeCat,
    setActiveCat,
    search,
    setSearch,
    catTitle: activeCategory?.label ?? 'All libraries',
  };
}
