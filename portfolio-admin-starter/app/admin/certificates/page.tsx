import { ContentManager } from '../../../components/admin/content-manager';
import { initialCertificates } from '../../../lib/mock-data';

export default function CertificatesPage() {
  return <ContentManager mode="certificates" initialItems={initialCertificates} />;
}
