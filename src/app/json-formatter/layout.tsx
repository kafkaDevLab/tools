import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/json-formatter');

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
