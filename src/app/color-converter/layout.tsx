import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/color-converter');

export default function ColorConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
