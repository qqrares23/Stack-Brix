import type { BlockType } from '../types/editor';

export const BLOCK_DEFAULTS: Record<BlockType, string> = {
  h2: 'New heading',
  text: 'Write something…',
  code: '-- your code here',
  callout: 'Tip — add a helpful note.',
};
