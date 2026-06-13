import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FuelRecordsTable } from "./_components/fuel-records-table";

export default function FuelRecordsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="رکورد‌ها" />
      <FuelRecordsTable />
    </div>
  );
}