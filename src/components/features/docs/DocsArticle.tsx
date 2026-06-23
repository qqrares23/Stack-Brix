import { CodeBlock, InlineCode } from '../../ui/CodeBlock';
import { Callout } from '../../ui/Callout';
import { DocsTabs } from './DocsTabs';

type DocTab = 'docs' | 'api' | 'changelog';

interface DocsArticleProps {
  activeTab: DocTab;
  onTab: (t: DocTab) => void;
}

export function DocsArticle({ activeTab, onTab }: DocsArticleProps) {
  return (
    <article style={{ minWidth: 0, padding: '34px 48px 90px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 18 }}>
        Explore <span style={{ opacity: 0.5 }}>/</span> Utilities <span style={{ opacity: 0.5 }}>/</span> <span style={{ color: 'var(--ink)' }}>Maid</span>
      </div>

      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 42, letterSpacing: -1, margin: '0 0 10px' }}>Quick Start</h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 22px', maxWidth: 640 }}>
        A Maid tracks tasks — connections, instances, functions — and cleans them all up in one call. Perfect for components that need tidy teardown.
      </p>

      <DocsTabs activeTab={activeTab} onTab={onTab} />

      <h2 id="install" style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 25, margin: '0 0 12px', scrollMarginTop: 80 }}>Installation</h2>
      <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink)', margin: '0 0 16px' }}>
        Add Maid to your project with <InlineCode>wally</InlineCode>, or drop the module straight into <InlineCode>ReplicatedStorage</InlineCode>.
      </p>

      <CodeBlock lang="wally.toml">
        <span style={{ color: '#7C84A8' }}>[dependencies]</span>{'\n'}
        Maid = <span style={{ color: '#86E29B' }}>"quenty/maid@1.3.0"</span>
      </CodeBlock>

      <h2 id="usage" style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 25, margin: '0 0 12px', scrollMarginTop: 80 }}>Basic usage</h2>
      <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink)', margin: '0 0 16px' }}>
        Create a maid, give it tasks, and call <InlineCode>:DoCleaning()</InlineCode> when you're done.
      </p>

      <CodeBlock lang="lua">
        <span style={{ color: '#C792EA' }}>local</span> Maid = <span style={{ color: '#82AAFF' }}>require</span>(ReplicatedStorage.Maid){'\n\n'}
        <span style={{ color: '#C792EA' }}>local</span> maid = Maid.<span style={{ color: '#82AAFF' }}>new</span>(){'\n\n'}
        maid:<span style={{ color: '#82AAFF' }}>GiveTask</span>(part.Touched:<span style={{ color: '#82AAFF' }}>Connect</span>(<span style={{ color: '#C792EA' }}>function</span>(hit){'\n'}
        {'    '}<span style={{ color: '#82AAFF' }}>print</span>(<span style={{ color: '#86E29B' }}>"Touched by"</span>, hit.Name){'\n'}
        <span style={{ color: '#C792EA' }}>end</span>)){'\n\n'}
        <span style={{ color: '#5C648E' }}>-- later, tear everything down at once</span>{'\n'}
        maid:<span style={{ color: '#82AAFF' }}>DoCleaning</span>()
      </CodeBlock>

      <Callout>
        Assigning to a named key (<span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>maid.con = …</span>) replaces and cleans the previous task automatically.
      </Callout>

      <h2 id="api" style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 25, margin: '0 0 16px', scrollMarginTop: 80 }}>API reference</h2>
      <div style={{ border: '1.5px solid var(--line)', borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ padding: '16px 20px', background: 'var(--surface-2)', borderBottom: '1.5px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', background: 'var(--green)', padding: '3px 9px', borderRadius: 6, letterSpacing: '.5px' }}>METHOD</span>
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>maid:GiveTask(<span style={{ color: 'var(--brand-ink)' }}>task</span>) <span style={{ color: 'var(--ink-soft)' }}>→ number</span></code>
          </div>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink)', margin: '0 0 16px' }}>Registers a task for later cleanup. Returns the index it was stored at.</p>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--ink-soft)', marginBottom: 10 }}>Parameters</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: '10px 18px', alignItems: 'baseline', fontSize: 14 }}>
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, color: 'var(--brand-ink)' }}>task</code>
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: 'var(--blue)' }}>RBXScriptConnection | Instance | function | table</code>
            <span style={{ color: 'var(--ink-soft)', lineHeight: 1.5 }}>The thing to clean up. Connections are disconnected, instances destroyed, functions called.</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 38 }}>
        <a href="#" className="hbords" style={{ flex: 1, textDecoration: 'none', color: 'var(--ink)', padding: '16px 18px', border: '1.5px solid var(--line)', borderRadius: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 3 }}>← Previous</div>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 16 }}>Installation</div>
        </a>
        <a href="#" className="hbords" style={{ flex: 1, textDecoration: 'none', color: 'var(--ink)', padding: '16px 18px', border: '1.5px solid var(--line)', borderRadius: 14, textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 3 }}>Next →</div>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 16 }}>Cleaning up</div>
        </a>
      </div>
    </article>
  );
}
