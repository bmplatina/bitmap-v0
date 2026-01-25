import PreventExit from "@/components/common/prevent-exit";

export default async function PublishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <PreventExit />
    </>
  );
}
