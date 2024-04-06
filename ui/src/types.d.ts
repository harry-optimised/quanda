export type Thought = {
  id: string;
  content: string;
  entry: string;
  tags: string[];
};

export type Entry = {
  id: string;
  date: string;
  thoughts: Thought[];
};

export type Tag = {
  id: string;
  name: string;
  description: string;
  colour: string;
};
