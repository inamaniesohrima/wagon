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
import { fuelRecordService } from "@/services/fuel-record.service";
import { vagonService } from "@/services/vagon.service";
import type { FuelRecord, CreateFuelRecordInput } from "@/types/fuel-record";
import type { Vagon } from "@/types/vagon";

export function FuelRecordsTable() {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [vagons, setVagons] = useState<Vagon[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRecords(fuelRecordService.getAll());
    setVagons(vagonService.getAll());
  }, []);

  function handleCreated(record: FuelRecord) {
    setRecords((prev) => [...prev, record]);
    setOpen(false);
  }

  function handleDelete(id: string) {
    fuelRecordService.delete(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  function vagonName(id: string) {
    return vagons.find((v) => v.id === id)?.name ?? id;
  }

  return (
    <>
      <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            رکورد‌های سوخت‌رسانی
          </h2>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <span aria-hidden="true">+</span>  رکورد جدید
          </button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none uppercase [&>th]:text-center">
              <TableHead className="text-left!">لوکوموتیو</TableHead>
              <TableHead>شماره دیسپنسر</TableHead>
              <TableHead>کد پرسنلی</TableHead>
              <TableHead>تاریخ</TableHead>
              <TableHead>مقدار سوخت</TableHead>
              <TableHead>مقدار ورودی</TableHead>
              <TableHead>مدت زمان</TableHead>
              {/* <TableHead /> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-sm text-gray-500"
                >
                  رکوردی ثبت نشده
                </TableCell>
              </TableRow>
            )}
            {records.map((record) => (
              <TableRow
                key={record.id}
                className="text-center text-base font-medium text-dark dark:text-white"
              >
                <TableCell className="text-left!">
                  {vagonName(record.vagonId)}
                </TableCell>
                <TableCell>{record.disNumber}</TableCell>
                <TableCell>{record.personalNumber}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.liters} L</TableCell>
                <TableCell>{record.preset}</TableCell>
                <TableCell>{record.duration} min</TableCell>
                {/* <TableCell>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {open && (
        <AddFuelRecordModal
          vagons={vagons}
          onClose={() => setOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const EMPTY_FORM: CreateFuelRecordInput = {
  vagonId: "",
  disNumber: "",
  personalNumber: "",
  date: new Date().toISOString().slice(0, 10),
  liters: 0,
  preset: 0,
  duration: 0,
};

function AddFuelRecordModal({
  vagons,
  onClose,
  onCreated,
}: {
  vagons: Vagon[];
  onClose: () => void;
  onCreated: (record: FuelRecord) => void;
}) {
  const [form, setForm] = useState<CreateFuelRecordInput>({
    ...EMPTY_FORM,
    vagonId: vagons[0]?.id ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateFuelRecordInput, string>>>({});
  const firstInputRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  function set<K extends keyof CreateFuelRecordInput>(key: K, value: CreateFuelRecordInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof CreateFuelRecordInput, string>> = {};
    if (!form.vagonId) e.vagonId = "Required";
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
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            ثبت سوخت‌گیری
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Vagon */}
          <Field label="لوکوموتیو" error={errors.vagonId}>
            <select
              ref={firstInputRef}
              value={form.vagonId}
              onChange={(e) => set("vagonId", e.target.value)}
              className={inputCls(!!errors.vagonId)}
            >
              <option value="">Select a vagon…</option>
              {vagons.map((v) => (
                <option key={v.id} value={v.id!}>
                  {v.name!} — {v.tagNumber!}
                </option>
              ))}
            </select>
          </Field>

          {/* Two-column row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="دیسپنسر" error={errors.disNumber}>
              <input
                type="text"
                value={form.disNumber}
                onChange={(e) => set("disNumber", e.target.value)}
                placeholder="e.g. D-001"
                className={inputCls(!!errors.disNumber)}
              />
            </Field>

            <Field label="شماره پرسنل" error={errors.personalNumber}>
              <input
                type="text"
                value={form.personalNumber}
                onChange={(e) => set("personalNumber", e.target.value)}
                placeholder="e.g. P-123"
                className={inputCls(!!errors.personalNumber)}
              />
            </Field>
          </div>

          {/* Date */}
          <Field label="تاریخ" error={errors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputCls(!!errors.date)}
            />
          </Field>

          {/* Three-column row */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="مقدار به لیتر" error={errors.liters}>
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

            <Field label="پریست" error={errors.preset}>
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

            <Field label="مدت سوخت‌گیری (دقیقه)" error={errors.duration}>
              <input
                type="number"
                min={0}
                value={form.duration || ""}
                onChange={(e) => set("duration", parseInt(e.target.value) || 0)}
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
              لغو
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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