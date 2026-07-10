import { readdir } from 'node:fs/promises';
import path from 'node:path';

const CERTIFICATE_ASSET_DIR = path.join(process.cwd(), 'public', 'certificates');
const CERTIFICATE_PUBLIC_BASE_PATH = '/certificates';
const ALLOWED_CERTIFICATE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.pdf']);

export type CertificateAsset = {
  filename: string;
  assetKey: string;
  publicPath: string;
  extension: string;
};

export async function listCertificateAssets(): Promise<CertificateAsset[]> {
  let entries;

  try {
    entries = await readdir(CERTIFICATE_ASSET_DIR, { encoding: 'utf8', withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const extension = path.extname(entry.name).toLowerCase();
      return {
        filename: entry.name,
        assetKey: entry.name,
        publicPath: resolveCertificatePublicPath(entry.name),
        extension,
      };
    })
    .filter((asset) => ALLOWED_CERTIFICATE_EXTENSIONS.has(asset.extension))
    .sort((a, b) => a.filename.localeCompare(b.filename));
}

export function resolveCertificatePublicPath(assetKey: string) {
  const filename = path.basename(assetKey);
  return `${CERTIFICATE_PUBLIC_BASE_PATH}/${encodeURIComponent(filename)}`;
}
