export type Post = {
  userId: string;
  title: string;
  slug: string;
  createdAt: string;
  content: string;
  html: string;
  published: boolean;
  tags: string[];
};

export type Tag = {
  name: string;
  count: number;
};
