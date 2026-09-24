import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/image-convert');

export default function ImageConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
