"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  ACCEPTED_FILE_MIME_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_MESSAGE_LENGTH,
  MAX_TOTAL_FILE_SIZE,
  acceptedFileLabel,
  formatFileSize,
} from "../lib/contact-constraints";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormFields | "files", string>>;
type Status = { type: "idle" | "success" | "error"; message?: string };

const initialFields: FormFields = { firstName: "", lastName: "", email: "", message: "" };

function newRequestId() {
  return `${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function validate(fields: FormFields, files: File[]): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.firstName.trim()) errors.firstName = "Bitte Vornamen angeben.";
  if (!fields.lastName.trim()) errors.lastName = "Bitte Nachnamen angeben.";
  if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  if (!fields.message.trim()) errors.message = "Bitte kurz beschreiben, worum es geht.";
  if (fields.message.length > MAX_MESSAGE_LENGTH) errors.message = `Bitte maximal ${MAX_MESSAGE_LENGTH.toLocaleString("de-DE")} Zeichen verwenden.`;
  if (files.length > MAX_FILES) errors.files = `Bitte höchstens ${MAX_FILES} Dateien auswählen.`;
  if (files.some((file) => file.size > MAX_FILE_SIZE)) errors.files = "Eine Datei überschreitet die erlaubten 5 MB.";
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_FILE_SIZE) errors.files = "Die Dateien überschreiten zusammen die erlaubten 10 MB.";
  return errors;
}

export function ContactForm() {
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(newRequestId());

  useEffect(() => {
    if (status.type === "error" && Object.keys(errors).length > 0) summaryRef.current?.focus();
  }, [errors, status.type]);

  const setField = (name: keyof FormFields, value: string) => {
    if (fields[name] !== value) requestIdRef.current = newRequestId();
    setFields((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    if (status.type !== "idle") setStatus({ type: "idle" });
  };

  const handleFiles = (selected: File[]) => {
    const nextFiles = [...files];
    const seen = new Set(files.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
    selected.forEach((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (!seen.has(key)) {
        nextFiles.push(file);
        seen.add(key);
      }
    });

    if (nextFiles.length !== files.length) requestIdRef.current = newRequestId();

    const invalidType = nextFiles.find((file) => file.type && !ACCEPTED_FILE_MIME_TYPES.includes(file.type as (typeof ACCEPTED_FILE_MIME_TYPES)[number]));
    setFiles(nextFiles.slice(0, MAX_FILES));
    if (nextFiles.length > MAX_FILES) setErrors((current) => ({ ...current, files: `Bitte höchstens ${MAX_FILES} Dateien auswählen.` }));
    else if (invalidType) setErrors((current) => ({ ...current, files: `„${invalidType.name}“ ist kein erlaubtes Format.` }));
    else if (nextFiles.some((file) => file.size > MAX_FILE_SIZE)) setErrors((current) => ({ ...current, files: "Eine Datei überschreitet die erlaubten 5 MB." }));
    else if (nextFiles.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_FILE_SIZE) setErrors((current) => ({ ...current, files: "Die Dateien überschreiten zusammen die erlaubten 10 MB." }));
    else setErrors((current) => ({ ...current, files: undefined }));
  };

  const removeFile = (index: number) => {
    if (index >= 0 && index < files.length) requestIdRef.current = newRequestId();
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setErrors((current) => ({ ...current, files: undefined }));
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const selected = Array.from(input.files ?? []);
    input.value = "";
    handleFiles(selected);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields, files);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Bitte die markierten Angaben prüfen." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle" });
    const payload = new FormData();
    payload.set("firstName", fields.firstName.trim());
    payload.set("lastName", fields.lastName.trim());
    payload.set("email", fields.email.trim());
    payload.set("message", fields.message.trim());
    payload.set("requestId", requestIdRef.current);
    files.forEach((file) => payload.append("files", file));

    try {
      const response = await fetch("/api/contact", { method: "POST", body: payload });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        setStatus({ type: "error", message: result.message || "Der Versand ist fehlgeschlagen. Bitte erneut versuchen." });
        return;
      }
      setFields(initialFields);
      setFiles([]);
      setErrors({});
      setStatus({ type: "success", message: "Danke. Ihre Anfrage wurde übermittelt." });
      requestIdRef.current = newRequestId();
      formRef.current?.reset();
    } catch {
      setStatus({ type: "error", message: "Der Versand ist momentan nicht erreichbar. Bitte erneut versuchen." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const errorEntries = Object.entries(errors).filter(([, message]) => message) as Array<[keyof FieldErrors, string]>;

  return (
    <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="form-intro">
        <p className="eyebrow">ANFRAGE SENDEN</p>
        <h3>Beschreiben Sie kurz, was ansteht.</h3>
        <p>Fotos oder Unterlagen können Sie direkt anhängen. Die Anfrage wird an <a href="mailto:neustand.service@gmail.com">neustand.service@gmail.com</a> gesendet.</p>
      </div>

      {status.type === "error" && errorEntries.length > 0 && (
        <div className="form-error-summary" ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="form-error-title">
          <strong id="form-error-title">Bitte prüfen:</strong>
          <ul>
            {errorEntries.map(([field, message]) => (
              <li key={field}><a href={`#${field}`}>{message}</a></li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-grid-two">
        <div className="field">
          <Label htmlFor="firstName">Vorname <span aria-hidden="true">*</span></Label>
          <Input id="firstName" name="firstName" autoComplete="given-name" value={fields.firstName} onChange={(event) => setField("firstName", event.target.value)} aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "firstName-error" : undefined} />
          {errors.firstName && <p className="field-error" id="firstName-error">{errors.firstName}</p>}
        </div>
        <div className="field">
          <Label htmlFor="lastName">Nachname <span aria-hidden="true">*</span></Label>
          <Input id="lastName" name="lastName" autoComplete="family-name" value={fields.lastName} onChange={(event) => setField("lastName", event.target.value)} aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "lastName-error" : undefined} />
          {errors.lastName && <p className="field-error" id="lastName-error">{errors.lastName}</p>}
        </div>
      </div>

      <div className="field">
        <Label htmlFor="email">E-Mail-Adresse <span aria-hidden="true">*</span></Label>
        <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={fields.email} onChange={(event) => setField("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
        {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
      </div>

      <div className="field">
        <Label htmlFor="message">Ihre Nachricht <span aria-hidden="true">*</span></Label>
        <Textarea id="message" name="message" rows={6} maxLength={MAX_MESSAGE_LENGTH} value={fields.message} onChange={(event) => setField("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : "message-help"} />
        <p className="field-help" id="message-help">Zum Beispiel: Raum, gewünschte Arbeiten und was bereits bekannt ist.</p>
        {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
      </div>

      <div className="field">
        <Label htmlFor="files">Fotos oder Unterlagen <span className="label-optional">optional</span></Label>
        <div className="file-picker-control">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="file-picker-button btn btn-outline"
            aria-controls="files"
            aria-describedby={errors.files ? "files-help files-error" : "files-help"}
            aria-invalid={Boolean(errors.files)}
            onClick={openFilePicker}
            disabled={isSubmitting}
          >
            Dateien auswählen
          </Button>
          <input
            ref={fileInputRef}
            className="file-input-native-hidden"
            id="files"
            name="files"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileInputChange}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
        <p className="field-help" id="files-help">{acceptedFileLabel()}</p>
        <p className="file-selection-status" role="status" aria-live="polite">
          {files.length === 0
            ? "Keine Dateien ausgewählt"
            : files.length === 1
              ? "1 Datei ausgewählt"
              : files.length + " Dateien ausgewählt"}
        </p>
        {errors.files && <p className="field-error" id="files-error">{errors.files}</p>}
        {files.length > 0 && (
          <ul className="file-list" aria-label="Ausgewählte Dateien">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                <span><strong>{file.name}</strong><small>{formatFileSize(file.size)}</small></span>
                    <button
                      type="button"
                      className="file-remove"
                      aria-label={`Datei ${file.name} entfernen`}
                      onClick={() => removeFile(index)}
                    >
                      Datei entfernen
                    </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-trap" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="privacy-hint">Mit dem Absenden werden Ihre Angaben zur Bearbeitung der Anfrage per E-Mail verarbeitet. Details: <Link href="/datenschutzerklaerung">Datenschutzerklärung</Link>.</p>
      <Button className="button-dark form-submit" variant="dark" size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Wird gesendet …" : "Anfrage senden"} <span aria-hidden="true">↗</span>
      </Button>
      <div className={`form-status form-status-${status.type}`} aria-live="polite">{status.message}</div>
    </form>
  );
}
