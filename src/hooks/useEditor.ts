import { useState, useCallback } from 'react';
import { BLOCK_DEFAULTS } from '../data';
import type { Block, BlockType } from '../types/editor';

let UID = 0;

// Replace empty initial state with a document fetched from Appwrite.
// See developer_docs.md → "Editor / useEditor" for the document schema.
export function useEditor() {
  const [docTitle, setDocTitle]       = useState('');
  const [docSubtitle, setDocSubtitle] = useState('');
  const [blocks, setBlocks]           = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string>('');
  const [submitted, setSubmitted]     = useState<string | false>(false);

  const updateBlock = useCallback((id: string, text: string) => {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, text } : b)));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  }, []);

  const moveBlock = useCallback((id: string, dir: -1 | 1) => {
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= bs.length) return bs;
      const arr = [...bs];
      const [item] = arr.splice(i, 1);
      arr.splice(j, 0, item);
      return arr;
    });
  }, []);

  const addBlock = useCallback((type: BlockType) => {
    const id = 'b' + ++UID;
    setBlocks((bs) => [...bs, { id, type, text: BLOCK_DEFAULTS[type] }]);
    setSelectedBlock(id);
  }, []);

  return {
    docTitle, setDocTitle,
    docSubtitle, setDocSubtitle,
    blocks,
    selectedBlock, setSelectedBlock,
    submitted, setSubmitted,
    updateBlock, removeBlock, moveBlock, addBlock,
  };
}
