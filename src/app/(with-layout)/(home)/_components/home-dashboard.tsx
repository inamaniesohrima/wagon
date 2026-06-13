"use client";

import { useMemo, useSyncExternalStore } from "react";
import { OverviewCard } from "./overview-cards/card";
import * as icons from "./overview-cards/icons";
import { PaymentsOverviewChart } from "@/components/Charts/payments-overview/chart";
import { standardFormat } from "@/lib/format-number";
import { fuelRecordService } from "@/services/fuel-record.service";
import type { FuelRecord } from "@/types/fuel-record";
import { SiteVagonsTable } from "./site-vagons-table";

export function HomeDashboard() {
  const recordsSnapshot = useSyncExternalStore(
    subscribeToFuelRecords,
    getFuelRecordsSnapshot,
    () => "[]",
  );
  const records = useMemo(
    () => JSON.parse(recordsSnapshot) as FuelRecord[],
    [recordsSnapshot],
  );

  const totalLiters = useMemo(
    () => records.reduce((sum, record) => sum + record.liters, 0),
    [records],
  );

  const fuelByDay = useMemo(() => {
    const grouped = records.reduce<Record<string, number>>((acc, record) => {
      acc[record.date] = (acc[record.date] ?? 0) + record.liters;
      return acc;
    }, {});

    const data = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, liters]) => ({ x: date, y: liters }));

    return data.length > 0 ? data : [{ x: "No records", y: 0 }];
  }, [records]);

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
      {/* <div className="col-span-12 grid gap-4 sm:grid-cols-2 xl:col-span-5 2xl:gap-7.5"> */}
      <div className="col-span-12 flex flex-col gap-6 xl:col-span-3 2xl:gap-7.5">
        <OverviewCard
          label="مجموع کل سوخت‌گیری انجام شده"
          data={{
            value: `${standardFormat(totalLiters)} L`,
            growthRate: 0,
          }}
          Icon={icons.Profit}
          showGrowth={false}
        />

        <OverviewCard
          label="تعداد کل سوخت‌گیری‌ها"
          data={{
            value: records.length,
            growthRate: 0,
          }}
          Icon={icons.Product}
          showGrowth={false}
        />
      </div>

      {/* <div className="col-span-12 grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7"> */}
       <div className="col-span-12 grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            آمار سوخت‌رسانی
          </h2>
          <span className="text-sm font-medium text-dark-6">
            سوخت‌رسانی روزانه به لیتر
          </span>
        </div>

        <PaymentsOverviewChart
          colors={["#3FD97F"]}
          series={[
            {
              name: "Liters",
              data: fuelByDay,
            },
          ]}
        />
      </div>

      <div className="col-span-12">
        <SiteVagonsTable />
      </div>
    </div>
  );
}

function subscribeToFuelRecords(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === "fuel_records") onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener("fuel-records-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("fuel-records-change", onStoreChange);
  };
}

function getFuelRecordsSnapshot() {
  return JSON.stringify(fuelRecordService.getAll());
}

// function emitFuelRecordsChange() {
//   window.dispatchEvent(new Event("fuel-records-change"));
// }
