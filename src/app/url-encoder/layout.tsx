import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/url-encoder');

export default function UrlEncoderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
