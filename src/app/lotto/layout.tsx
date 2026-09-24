import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/lotto');

export default function LottoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
