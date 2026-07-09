import type { Certificate, Project } from './types';

export const initialProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Tech Wizard Portfolio',
    description: 'Personal portfolio showcasing projects, certifications, and creative technology work.',
    coverImage: '/images/new-profile.png',
    githubUrl: 'https://github.com/',
    liveDemoUrl: 'https://example.com',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    featured: true,
    published: true,
  },
  {
    id: 'project-2',
    name: 'AI Support Bot',
    description: 'A lightweight chatbot concept for answering common support questions.',
    coverImage: '/images/flash.png',
    githubUrl: 'https://github.com/',
    liveDemoUrl: 'https://example.com',
    techStack: ['Python', 'NLP', 'Automation'],
    featured: false,
    published: true,
  },
];

export const initialCertificates: Certificate[] = [
  {
    id: 'certificate-1',
    title: 'Python Programming',
    issuer: 'Harvard / edX',
    description: 'Foundational programming concepts, Python syntax, and problem solving.',
    issueDate: '2025-01-12',
    thumbnailImage: '/images/Harvard_certificate_for_python-1.png',
    certificateFile: '/images/Harvard_certificate_for_python-1.png',
    verificationUrl: 'https://example.com',
  },
  {
    id: 'certificate-2',
    title: 'HTML and CSS',
    issuer: 'edX',
    description: 'Responsive web design fundamentals and clean interface structure.',
    issueDate: '2025-03-28',
    thumbnailImage: '/images/HTML AND CSS CERTIFICATE EDX-1.png',
    certificateFile: '/images/HTML AND CSS CERTIFICATE EDX-1.png',
  },
];
