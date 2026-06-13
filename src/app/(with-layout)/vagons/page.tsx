import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VagonsTable } from "./_components/vagons-table";

export default function VagonsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="لوکوموتیوها" />
      <VagonsTable />
    </div>
  );
}