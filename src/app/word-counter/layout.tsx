import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/word-counter');

export default function WordCounterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
