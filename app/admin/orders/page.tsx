import { listOrders } from "@/lib/orders";
import OrdersList from "@/components/admin/OrdersList";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  return <OrdersList initialOrders={orders} />;
}
