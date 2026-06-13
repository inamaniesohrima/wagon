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
import type { Vagon, CreateVagonInput } from "@/types/vagon";

export function VagonsTable() {
  const [vagons, setVagons] = useState<Vagon[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setVagons(vagonService.getAll());
  }, []);

  function handleCreated(vagon: Vagon) {
    setVagons((prev) => [...prev, vagon]);
    setOpen(false);
  }

  function handleDelete(id: string) {
    vagonService.delete(id);
    setVagons((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <>
      <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Vagons
          </h2>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <span aria-hidden="true">+</span> Add Vagon
          </button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none uppercase [&>th]:text-center">
              <TableHead className="text-left!">Name / Plate</TableHead>
              <TableHead>Tag Number</TableHead>
              <TableHead>Created</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {vagons.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-gray-500"
                >
                  No vagons yet. Add one to get started.
                </TableCell>
              </TableRow>
            )}
            {vagons.map((vagon) => (
              <TableRow
                key={vagon.id}
                className="text-center text-base font-medium text-dark dark:text-white"
              >
                <TableCell className="text-left!">{vagon.name}</TableCell>
                <TableCell>{vagon.tagNumber}</TableCell>
                <TableCell>
                  {new Date(vagon.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDelete(vagon.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {open && (
        <AddVagonModal onClose={() => setOpen(false)} onCreated={handleCreated} />
      )}
    </>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function AddVagonModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (vagon: Vagon) => void;
}) {
  const [form, setForm] = useState<CreateVagonInput>({
    name: "",
    tagNumber: "",
  });
  const [errors, setErrors] = useState<Partial<CreateVagonInput>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  function validate(): boolean {
    const e: Partial<CreateVagonInput> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.tagNumber.trim()) e.tagNumber = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const vagon = vagonService.create(form);
    onCreated(vagon);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-dark">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            Add Vagon
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
          <Field
            label="Name / Plate Number"
            error={errors.name}
          >
            <input
              ref={firstInputRef}
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. 34 ABC 001"
              className={inputCls(!!errors.name)}
            />
          </Field>

          <Field label="Tag Number" error={errors.tagNumber}>
            <input
              type="text"
              value={form.tagNumber}
              onChange={(e) => setForm({ ...form, tagNumber: e.target.value })}
              placeholder="e.g. T-42"
              className={inputCls(!!errors.tagNumber)}
            />
          </Field>

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
              Save
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
    hasError
      ? "border-red-400"
      : "border-stroke dark:border-dark-3",
  ].join(" ");
}