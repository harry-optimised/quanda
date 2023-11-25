export type LinkType = 'relates_to' | 'supports' | 'supported_by';

export type Link = {
  target: LightItem;
  type: LinkType;
};

export type SetLink = {
  relation_type: string;
  to_item: number;
};

export type LightItem = {
  id: number;
  primary: string;
  secondary: string;
  confidence: number;
  tags: number[];
  frozen: boolean;
  priority: boolean;
  system: number;
};

export type Item = {
  id: number;
  position: Position;
  primary: string;
  secondary: string;
  confidence: number;
  tags: number[];
  evidence: number[];
  frozen: boolean;
  priority: boolean;
  system: number;
  links: Link[];
};

export type Position = {
  x: number;
  y: number;
};

export type System = {
  id: number;
  name: string;
  description: string;
};

export type TagColour =
  | 'teal'
  | 'blue'
  | 'purple'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'neutral';

export type Tag = {
  id: number;
  name: string;
  description: string;
  colour: TagColour;
};
