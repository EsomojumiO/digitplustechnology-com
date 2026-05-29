export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Global shell (header/footer/widgets) lives in the root layout.
  // This group layout simply renders children.
  return <>{children}</>;
}
