import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/image-resize');

export default function ImageResizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
