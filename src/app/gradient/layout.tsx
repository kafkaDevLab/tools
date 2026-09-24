import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/gradient');

export default function GradientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
