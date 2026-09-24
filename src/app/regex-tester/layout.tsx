import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/regex-tester');

export default function RegexTesterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
