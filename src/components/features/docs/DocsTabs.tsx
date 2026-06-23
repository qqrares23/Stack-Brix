type DocTab = 'docs' | 'api' | 'changelog';

interface DocsTabsProps {
  activeTab: DocTab;
  onTab: (t: DocTab) => void;
}

const TABS: [DocTab, string][] = [['docs', 'Guide'], ['api', 'API'], ['changelog', 'Changelog']];

export function DocsTabs({ activeTab, onTab }: DocsTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 26, borderBottom: '1px solid var(--line)', marginBottom: 30 }}>
      {TABS.map(([id, label]) => (
        <span
          key={id}
          data-tab-active={String(activeTab === id)}
          onClick={() => onTab(id)}
          style={{ cursor: 'pointer', padding: '0 2px 13px', fontSize: 15, fontWeight: 600, color: 'var(--ink-soft)', borderBottom: '2.5px solid transparent', marginBottom: -1 }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
