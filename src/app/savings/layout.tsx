import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/savings');

export default function SavingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
