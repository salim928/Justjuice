import { readCatalog } from "@/lib/products";
import AdminEditor from "@/components/admin/AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const catalog = await readCatalog();
  return <AdminEditor initialCatalog={catalog} />;
}
