import { useState, type FormEvent, type ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-4xl leading-tight md:text-5xl">{title}</h1>
        {lead && <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground">{lead}</p>}
      </div>
    </section>
  );
}

export function ContactForm({
  fields,
  labels,
}: {
  fields: { key: string; label: string; type?: string; textarea?: boolean }[];
  labels: { submit: string; thanks: string };
}) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-sm border border-border bg-card p-10 text-center shadow-[var(--shadow-soft)]">
        <p className="font-[family-name:var(--font-display)] text-2xl">{labels.thanks}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-sm border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
    >
      {fields.map((f) => (
        <div key={f.key} className="space-y-2">
          <label className="eyebrow block" htmlFor={f.key}>
            {f.label}
          </label>
          {f.textarea ? (
            <textarea
              id={f.key}
              rows={5}
              required
              className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring"
            />
          ) : (
            <input
              id={f.key}
              type={f.type ?? "text"}
              required
              className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full rounded-sm bg-primary px-6 py-3.5 text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
      >
        {labels.submit}
      </button>
    </form>
  );
}

export function ServiceDetail({
  title,
  body,
  items,
  children,
}: {
  title: string;
  body: string;
  items: string[];
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="text-3xl">{title}</h2>
      <div className="hairline mt-5 w-24" />
      <p className="mt-6 text-muted-foreground">{body}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="rounded-sm border border-border bg-card px-5 py-4 text-sm">
            {i}
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}
