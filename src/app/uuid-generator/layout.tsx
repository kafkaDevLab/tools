import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/uuid-generator');

export default function UuidGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
