import { isAuthenticated } from "@/lib/auth";
import { listOrders } from "@/lib/orders";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "JustJuice — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) {
    return <AdminLogin />;
  }
  const orders = await listOrders();
  const pending = orders.filter(
    (o) => o.status === "new" || o.status === "confirmed"
  ).length;
  return <AdminShell pendingOrderCount={pending}>{children}</AdminShell>;
}
