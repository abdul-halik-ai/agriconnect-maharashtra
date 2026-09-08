import { BuyerSidebar } from "@/components/layout/BuyerSidebar";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <BuyerSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
