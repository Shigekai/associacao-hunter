export default function HuntersLayout({
  children,
  sheet,
}: LayoutProps<'/hunters'>) {
  return (
    <>
      {children}
      {sheet}
    </>
  );
}
