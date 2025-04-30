import { HeaderInvoices } from "./components/HeaderInvoices";
import { ListaPedidos } from "./components/ListaPedidos";

export default async function InvoicesPage() {
  return (
    <div>
      <HeaderInvoices />
      <ListaPedidos />
    </div>
  );
}
