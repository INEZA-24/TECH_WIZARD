export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
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
  certificateFile: string;
  icon: string;
  published: boolean;
  sortOrder: number;
};
