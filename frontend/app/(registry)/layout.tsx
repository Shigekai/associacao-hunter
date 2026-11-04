import { SiteHeader } from '@/components/SiteHeader';

export default function RegistryLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
