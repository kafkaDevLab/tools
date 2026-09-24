import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/base64');

export default function Base64Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
