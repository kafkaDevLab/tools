import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/dividend');

export default function DividendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
