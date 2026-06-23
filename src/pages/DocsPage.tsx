import { useState } from 'react';
import { DocsSidebar } from '../components/features/docs/DocsSidebar';
import { DocsArticle } from '../components/features/docs/DocsArticle';
import { DocsToc } from '../components/features/docs/DocsToc';

type DocTab = 'docs' | 'api' | 'changelog';

// `navGroups` will come from the Appwrite "pages" collection for the selected library.
// See developer_docs.md → "Docs page / DocsSidebar" for the query shape.
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('');
  const [tab, setTab] = useState<DocTab>('docs');

  return (
    <main style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '266px 1fr 218px', gap: 0 }}>
      <DocsSidebar navGroups={[]} activeSection={activeSection} onSelect={setActiveSection} />
      <DocsArticle activeTab={tab} onTab={setTab} />
      <DocsToc />
    </main>
  );
}
