export interface JournalPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading?: string;
      paragraphs: string[];
      quote?: string;
      image?: string;
      caption?: string;
    }[];
    conclusion: string;
  };
}

export const journalPosts: JournalPost[] = [];
