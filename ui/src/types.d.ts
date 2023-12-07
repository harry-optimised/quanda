export type LinkType = 'relates_to' | 'supports' | 'supported_by';

export type Link = {
  target: LightItem;
  type: LinkType;
};

export type SetLink = {
  relation_type: string;
  to_item: number;
};

export type Item = {
  project: number;
  id: number;
  primary: string;
  secondary: string;
  confidence: number;
  tags: number[];
  evidence: number[];
  links: Link[];
};

export type LightItem = Omit<Item, 'evidence' | 'links'>;

export type Position = {
  x: number;
  y: number;
};

export type System = {
  id: number;
  name: string;
  description: string;
};

export type Tag = {
  id: number;
  name: string;
  description: string;
  colour: string;
  project: number;
};

export type Project = {
  id: number;
  name: string;
  description: string;
};
