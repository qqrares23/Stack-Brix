export type BlockType = 'h2' | 'text' | 'code' | 'callout';

export interface Block {
  id: string;
  type: BlockType;
  text: string;
}
