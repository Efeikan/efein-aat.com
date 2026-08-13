"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  FileUp,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type FormState = {
  projectType: string;
  location: string;
  area: string;
  deedStatus: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  kvkk: boolean;
  website: string;
};

type FormErrors = Partial<Record<keyof FormState | "file", string>>;

const initialForm: FormState = {
  projectType: "",
  location: "",
  area: "",
  deedStatus: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
  kvkk: false,
  website: "",
};

function formatPhoneTR(raw: string) {
  const digits = raw.replace(/\D/g, "").replace(/^90/, "").slice(0, 10);
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ].filter(Boolean);
  if (!digits) return "";
  return `+90 ${parts.join(" ")}`.trim();
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, "").replace(/^90/, "");
}

export default function QuoteForm() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState<FormState>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const projectTypes = t("quote.projectTypes") as string[];
  const deedStatuses = t("quote.deedStatuses") as string[];

  const inputClass =
    "w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-600 transition-colors";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2";

  const validate = () => {
    const next: FormErrors = {};
    if (!form.projectType) next.projectType = t("quote.errors.required") as string;
    if (!form.location.trim()) next.location = t("quote.errors.required") as string;
    if (!form.area.trim()) next.area = t("quote.errors.required") as string;
    else if (!/^\d+([.,]\d+)?$/.test(form.area.trim())) {
      next.area = t("quote.errors.area") as string;
    }
    if (!form.deedStatus) next.deedStatus = t("quote.errors.required") as string;
    if (!form.name.trim()) next.name = t("quote.errors.required") as string;
    const digits = phoneDigits(form.phone);
    if (digits.length !== 10) next.phone = t("quote.errors.phone") as string;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = t("quote.errors.email") as string;
    }
    if (!form.kvkk) next.kvkk = t("quote.errors.kvkk") as string;
    if (file && file.size > 5 * 1024 * 1024) {
      next.file = t("quote.errors.fileSize") as string;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "phone") {
      setForm((prev) => ({ ...prev, phone: formatPhoneTR(value) }));
      return;
    }
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, kvkk: e.target.checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        body.append(key, String(value));
      });
      if (file) body.append("file", file);

      const res = await fetch("/api/quote", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string }).error ||
            (t("quote.error") as string)
        );
      }

      setForm(initialForm);
      setFile(null);
      setErrors({});
      setToast(true);
      setTimeout(() => setToast(false), 5500);
    } catch (err) {
      setErrors({
        notes:
          err instanceof Error
            ? err.message
            : (t("quote.error") as string),
      });
    } finally {
      setLoading(false);
    }
  };

  const fileLabel = useMemo(() => {
    if (!file) return t("quote.fileHint") as string;
    return `${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
  }, [file, t]);

  return (
    <section
      id="teklif-formu"
      className="py-20 lg:py-28 bg-[var(--bg-primary)] scroll-mt-28"
      ref={ref}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-10 lg:mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-900/30 text-primary-300 rounded-full text-sm font-medium mb-4">
            {t("quote.sectionTag") as string}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
            {t("quote.title") as string}
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {t("quote.subtitle") as string}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/20 space-y-5"
          noValidate
        >
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={onChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="projectType" className={labelClass}>
                {t("quote.projectType") as string} *
              </label>
              <select
                id="projectType"
                name="projectType"
                value={form.projectType}
                onChange={onChange}
                className={inputClass}
              >
                <option value="">{t("quote.selectPlaceholder") as string}</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <p className="mt-1.5 text-xs text-red-400">{errors.projectType}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                {t("quote.location") as string} *
              </label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder={t("quote.locationPlaceholder") as string}
                className={inputClass}
              />
              {errors.location && (
                <p className="mt-1.5 text-xs text-red-400">{errors.location}</p>
              )}
            </div>

            <div>
              <label htmlFor="area" className={labelClass}>
                {t("quote.area") as string} *
              </label>
              <input
                id="area"
                name="area"
                value={form.area}
                onChange={onChange}
                placeholder={t("quote.areaPlaceholder") as string}
                className={inputClass}
                inputMode="decimal"
              />
              {errors.area && (
                <p className="mt-1.5 text-xs text-red-400">{errors.area}</p>
              )}
            </div>

            <div>
              <label htmlFor="deedStatus" className={labelClass}>
                {t("quote.deedStatus") as string} *
              </label>
              <select
                id="deedStatus"
                name="deedStatus"
                value={form.deedStatus}
                onChange={onChange}
                className={inputClass}
              >
                <option value="">{t("quote.selectPlaceholder") as string}</option>
                {deedStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.deedStatus && (
                <p className="mt-1.5 text-xs text-red-400">{errors.deedStatus}</p>
              )}
            </div>

            <div>
              <label htmlFor="name" className={labelClass}>
                {t("quote.name") as string} *
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder={t("quote.namePlaceholder") as string}
                className={inputClass}
                autoComplete="name"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                {t("quote.phone") as string} *
              </label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="+90 5xx xxx xx xx"
                className={inputClass}
                inputMode="tel"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className={labelClass}>
                {t("quote.email") as string} *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder={t("quote.emailPlaceholder") as string}
                className={inputClass}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className={labelClass}>
                {t("quote.notes") as string}
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows={4}
                placeholder={t("quote.notesPlaceholder") as string}
                className={`${inputClass} resize-y min-h-[110px]`}
              />
              {errors.notes && (
                <p className="mt-1.5 text-xs text-red-400">{errors.notes}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="file" className={labelClass}>
                {t("quote.file") as string}
              </label>
              <label
                htmlFor="file"
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-4 text-sm text-[var(--text-secondary)] hover:border-primary-600 transition-colors"
              >
                <FileUp className="h-5 w-5 text-primary-400 shrink-0" />
                <span className="truncate">{fileLabel}</span>
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-primary-300"
                >
                  <X className="h-3.5 w-3.5" />
                  {t("quote.removeFile") as string}
                </button>
              )}
              {errors.file && (
                <p className="mt-1.5 text-xs text-red-400">{errors.file}</p>
              )}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="kvkk"
              checked={form.kvkk}
              onChange={onChange}
              className="mt-1 h-4 w-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)] text-primary-600 focus:ring-primary-500/40"
            />
            <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t("quote.kvkk") as string}
            </span>
          </label>
          {errors.kvkk && (
            <p className="-mt-3 text-xs text-red-400">{errors.kvkk}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary-600 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-black/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("quote.sending") as string}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("quote.submit") as string}
              </>
            )}
          </button>
        </motion.form>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-6 left-1/2 z-[110] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-primary-700/50 bg-[var(--bg-card)] px-5 py-4 shadow-2xl shadow-black/40"
            role="status"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-900/40 text-primary-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                  {t("quote.successTitle") as string}
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {t("quote.success") as string}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
