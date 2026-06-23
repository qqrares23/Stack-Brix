import { PageTreeSidebar } from '../components/features/editor/PageTreeSidebar';
import { InsertToolbar } from '../components/features/editor/InsertToolbar';
import { EditorBlock } from '../components/features/editor/EditorBlock';
import { PublishPanel } from '../components/features/editor/PublishPanel';
import { SubmitModal } from '../components/features/editor/SubmitModal';
import { useEditor } from '../hooks/useEditor';
import { useAdminContext } from '../App';

export default function EditorPage() {
  const { docTitle, setDocTitle, docSubtitle, setDocSubtitle, blocks, selectedBlock, setSelectedBlock, updateBlock, removeBlock, moveBlock, addBlock, submitted, setSubmitted } = useEditor();
  const { enqueue } = useAdminContext();

  // When auth is wired up, replace `author` / `initials` / `color` with values
  // from the Appwrite session user. See developer_docs.md → "Editor / submitDoc".
  const submitDoc = () => {
    const id = 'sub-' + Date.now();
    const item = {
      id,
      name: docTitle || 'Untitled',
      author: 'you',
      initials: (docTitle || 'U').slice(0, 2).toUpperCase(),
      color: '#FF4438',
      cat: 'Utilities',
      version: 'v1.0.0',
      submitted: 'just now',
      status: 'pending' as const,
      desc: docSubtitle || '',
      links: [],
      mine: true,
    };
    enqueue(item);
    setSubmitted(id);
  };

  return (
    <main style={{ display: 'grid', gridTemplateColumns: '238px 1fr 286px', height: 'calc(100vh - 65px)' }}>
      <PageTreeSidebar />

      <section style={{ overflowY: 'auto', background: 'var(--bg)' }}>
        <InsertToolbar onAdd={addBlock} />
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 120px' }}>
          <input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Page title" style={{ width: '100%', border: 0, outline: 0, background: 'transparent', fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 40, letterSpacing: -1, color: 'var(--ink)', marginBottom: 6 }} />
          <input value={docSubtitle} onChange={(e) => setDocSubtitle(e.target.value)} placeholder="Add a short summary…" style={{ width: '100%', border: 0, outline: 0, background: 'transparent', fontFamily: "'Plus Jakarta Sans'", fontSize: 17, color: 'var(--ink-soft)', marginBottom: 30 }} />

          {blocks.map((b) => (
            <EditorBlock
              key={b.id}
              block={b}
              active={b.id === selectedBlock}
              onSelect={() => setSelectedBlock(b.id)}
              onChange={(text) => updateBlock(b.id, text)}
              onUp={() => moveBlock(b.id, -1)}
              onDown={() => moveBlock(b.id, 1)}
              onRemove={() => removeBlock(b.id)}
            />
          ))}

          <button onClick={() => addBlock('text')} className="hbords hink" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 0 12px', border: '1.5px dashed var(--line)', background: 'transparent', color: 'var(--ink-soft)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 14, padding: '10px 16px', borderRadius: 11, cursor: 'pointer' }}>
            <span style={{ fontSize: 17, lineHeight: 1 }}>+</span> Add a block
          </button>
        </div>
      </section>

      <PublishPanel onSubmit={submitDoc} />

      {submitted && <SubmitModal onClose={() => setSubmitted(false)} />}
    </main>
  );
}
