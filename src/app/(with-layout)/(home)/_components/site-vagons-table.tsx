"use client";

import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { vagonService } from "@/services/vagon.service";
import { fuelRecordService } from "@/services/fuel-record.service";
import { mockSiteVagons } from "@/services/mockVagonsSite";
import type { Vagon } from "@/types/vagon";
import type { FuelRecord, CreateFuelRecordInput } from "@/types/fuel-record";

// Each row is a site vagon enriched with its localStorage match (if any)
type SiteRow = Vagon & {
  matched: Vagon | null;
};

export function SiteVagonsTable() {
  const [rows, setRows] = useState<SiteRow[]>([]);
  const [fuelTarget, setFuelTarget] = useState<Vagon | null>(null);
  const [addTarget, setAddTarget] = useState<Vagon | null>(null);

  useEffect(() => {
    hydrate();
  }, []);

  function hydrate() {
    const stored = vagonService.getAll();
    const enriched = mockSiteVagons.map((sv: Vagon) => ({
      ...sv,
      matched: stored.find((v) => v.tagNumber === sv.tagNumber) ?? null,
    }));
    setRows(enriched);
  }

  function handleAddToVagons(siteVagon: Vagon) {
    setAddTarget(siteVagon);
  }

  function handleVagonCreated() {
    setAddTarget(null);
    hydrate(); // re-match all rows against updated localStorage
  }

  function handleFuelRecordCreated() {
    setFuelTarget(null);
  }

  return (
    <>
      <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
              لوکوموتیوهای حاضر در جایگاه
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {rows.length} تگ شناسایی شد
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge color="green" label="شناخته شده" />
            <Badge color="orange" label="ناشناس" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none uppercase [&>th]:text-center">
              <TableHead className="text-right!">تگ</TableHead>
              <TableHead className="text-right!">پلاک</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-right!"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.tagNumber}
                className="text-base font-medium text-dark dark:text-white"
              >
                <TableCell className="font-mono text-sm">
                  {row.tagNumber}
                </TableCell>

                <TableCell>{row.name}</TableCell>

                <TableCell className="text-gray-500 dark:text-gray-400">
                  {row.matched?.name ?? "—"}
                </TableCell>

                <TableCell className="text-center">
                  {row.matched ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <span className="size-1.5 rounded-full bg-green-500" />
                      شناخته شده
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <span className="size-1.5 rounded-full bg-orange-500" />
                      ناشناس
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {row.matched ? (
                    <button
                      onClick={() => setFuelTarget(row.matched!)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
                    >
                      ثبت رکورد
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToVagons(row)}
                      className="rounded-lg border border-stroke px-3 py-1.5 text-xs font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
                    >
                      اضافه کردن لوکوموتیو
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {fuelTarget && (
        <AddFuelRecordModal
          vagon={fuelTarget}
          onClose={() => setFuelTarget(null)}
          onCreated={handleFuelRecordCreated}
        />
      )}

      {addTarget && (
        <AddVagonModal
          siteVagon={addTarget}
          onClose={() => setAddTarget(null)}
          onCreated={handleVagonCreated}
        />
      )}
    </>
  );
}

// ─── Add Vagon Modal ──────────────────────────────────────────────────────────

function AddVagonModal({
  siteVagon,
  onClose,
  onCreated,
}: {
  siteVagon: Vagon;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState(siteVagon.name);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name!.trim()) {
      setError("Required");
      return;
    }
    vagonService.create({ name: name!.trim(), tagNumber: siteVagon.tagNumber });
    onCreated();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-dark">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            اضافه کردن تگ
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tag number — read-only context */}
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-1 px-3 py-2 dark:bg-dark-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            تگ
          </span>
          <span className="ml-auto font-mono text-sm font-semibold text-dark dark:text-white">
            {siteVagon.tagNumber}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="پلاک" error={error}>
            <input
              ref={inputRef}
              type="text"
              value={name!}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Vagon Alpha"
              className={inputCls(!!error)}
            />
          </Field>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              لغو
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              اضافه
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Fuel Record Modal ────────────────────────────────────────────────────────

const emptyForm = (vagonId: string): CreateFuelRecordInput => ({
  vagonId,
  disNumber: "",
  personalNumber: "",
  date: new Date().toISOString().slice(0, 10),
  liters: 0,
  preset: 0,
  duration: 0,
});

function AddFuelRecordModal({
  vagon,
  onClose,
  onCreated,
}: {
  vagon: Vagon;
  onClose: () => void;
  onCreated: (record: FuelRecord) => void;
}) {
  const [form, setForm] = useState<CreateFuelRecordInput>(emptyForm(vagon.id!));
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateFuelRecordInput, string>>
  >({});
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  function set<K extends keyof CreateFuelRecordInput>(
    key: K,
    value: CreateFuelRecordInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof CreateFuelRecordInput, string>> = {};
    if (!form.disNumber.trim()) e.disNumber = "Required";
    if (!form.personalNumber.trim()) e.personalNumber = "Required";
    if (!form.date) e.date = "Required";
    if (form.liters <= 0) e.liters = "Must be greater than 0";
    if (form.duration <= 0) e.duration = "Must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const record = fuelRecordService.create(form);
    onCreated(record);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-dark">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            Submit Fuel Record
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Vagon badge — locked, not editable */}
        <div className="mb-5 flex items-center gap-2 rounded-lg bg-gray-1 px-3 py-2 dark:bg-dark-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Vagon</span>
          <span className="text-sm font-semibold text-dark dark:text-white">
            {vagon.name}
          </span>
          <span className="ml-auto font-mono text-xs text-gray-400">
            {vagon.tagNumber}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Dis Number" error={errors.disNumber}>
              <input
                ref={firstRef}
                type="text"
                value={form.disNumber}
                onChange={(e) => set("disNumber", e.target.value)}
                placeholder="e.g. D-001"
                className={inputCls(!!errors.disNumber)}
              />
            </Field>

            <Field label="Personal Number" error={errors.personalNumber}>
              <input
                type="text"
                value={form.personalNumber}
                onChange={(e) => set("personalNumber", e.target.value)}
                placeholder="e.g. P-123"
                className={inputCls(!!errors.personalNumber)}
              />
            </Field>
          </div>

          <Field label="Date" error={errors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputCls(!!errors.date)}
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Liters" error={errors.liters}>
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.liters || ""}
                onChange={(e) => set("liters", parseFloat(e.target.value) || 0)}
                placeholder="0"
                className={inputCls(!!errors.liters)}
              />
            </Field>

            <Field label="Preset" error={errors.preset}>
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.preset || ""}
                onChange={(e) => set("preset", parseFloat(e.target.value) || 0)}
                placeholder="0"
                className={inputCls(!!errors.preset)}
              />
            </Field>

            <Field label="Duration (min)" error={errors.duration}>
              <input
                type="number"
                min={0}
                value={form.duration || ""}
                onChange={(e) =>
                  set("duration", parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className={inputCls(!!errors.duration)}
              />
            </Field>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ color, label }: { color: "green" | "orange"; label: string }) {
  const styles = {
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    orange:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  const dotStyles = {
    green: "bg-green-500",
    orange: "bg-orange-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[color]}`}
    >
      <span className={`size-1.5 rounded-full ${dotStyles[color]}`} />
      {label}
    </span>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-dark dark:text-white">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2 text-sm text-dark outline-none",
    "dark:bg-dark-2 dark:text-white",
    "focus:border-primary dark:focus:border-primary",
    hasError ? "border-red-400" : "border-stroke dark:border-dark-3",
  ].join(" ");
}