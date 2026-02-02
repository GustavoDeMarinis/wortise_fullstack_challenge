export type Article = {
  id: string;
  title: string;
  content: string;

  authorId: string;
  authorName: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
