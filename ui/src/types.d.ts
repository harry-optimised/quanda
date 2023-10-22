export type Link = {
  target: number;
  relation: string;
  primary: string;
  secondary: string;
  tags: number[];
};

export type SetLink = {
  relation_type: string;
  to_item: number;
};

export type Item = {
  id: number;
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
