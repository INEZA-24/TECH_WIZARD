import { ContentManager } from '../../../components/admin/content-manager';
import { initialCertificates } from '../../../lib/mock-data';
import { listCertificateAssets } from '../../../lib/certificate-assets';

export default async function CertificatesPage() {
  const certificateAssets = await listCertificateAssets();

  return <ContentManager mode="certificates" initialItems={initialCertificates} certificateAssets={certificateAssets} />;
}
