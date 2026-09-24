import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/qr-generator');

export default function QrGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
