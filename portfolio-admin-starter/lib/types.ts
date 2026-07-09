export type Project = {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  githubUrl: string;
  liveDemoUrl: string;
  techStack: string[];
  featured: boolean;
  published: boolean;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  description: string;
  issueDate: string;
  thumbnailImage: string;
  certificateFile: string;
  verificationUrl?: string;
};
