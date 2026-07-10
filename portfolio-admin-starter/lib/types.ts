export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
  icon: string;
  published: boolean;
  sortOrder: number;
};

export type Certificate = {
  id: string;
  slug: string;
  title: string;
  issuer: string;
  issuedAt: string;
  issuedAtLabel: string;
  description: string;
  skills: string[];
  image: string;
  icon: string;
  published: boolean;
  sortOrder: number;
};
