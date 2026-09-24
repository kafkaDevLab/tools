import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/password-generator');

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
