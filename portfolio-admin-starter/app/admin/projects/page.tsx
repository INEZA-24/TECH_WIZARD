import { ContentManager } from '../../../components/admin/content-manager';
import { initialProjects } from '../../../lib/mock-data';

export default function ProjectsPage() {
  return <ContentManager mode="projects" initialItems={initialProjects} />;
}
