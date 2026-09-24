import { createToolMetadata } from '@/lib/seo/metadata';

export const metadata = createToolMetadata('/vat-calculator');

export default function VatCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
