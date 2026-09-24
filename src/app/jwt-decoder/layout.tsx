import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/jwt-decoder');

export default function JwtDecoderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
