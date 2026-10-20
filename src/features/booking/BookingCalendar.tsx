import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { fi, sv, es, enGB } from "date-fns/locale";
import { ArrowLeft, Mail, Video } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/i18n/LanguageProvider";

const locales = { fi, sv, es, en: enGB };
const copy = {
  fi: { day: "Valitse päivä", details: "Videopalaverin tiedot", time: "Toivottu kellonaika", zone: "Suomen aikaa (Europe/Helsinki)", email: "Sähköpostiosoite", change: "Vaihda päivää", send: "Lähetä varauspyyntö sähköpostilla", subject: "Videopalaverin varauspyyntö", date: "Päivä" },
  sv: { day: "Välj dag", details: "Uppgifter för videomötet", time: "Önskad tid", zone: "Finsk tid (Europe/Helsinki)", email: "E-postadress", change: "Byt dag", send: "Skicka bokningsförfrågan via e-post", subject: "Bokningsförfrågan för videomöte", date: "Datum" },
  es: { day: "Elige un día", details: "Datos de la videollamada", time: "Hora deseada", zone: "Hora de Finlandia (Europe/Helsinki)", email: "Correo electrónico", change: "Cambiar día", send: "Enviar solicitud por correo", subject: "Solicitud de reserva de videollamada", date: "Fecha" },
  en: { day: "Choose a day", details: "Video meeting details", time: "Preferred time", zone: "Finland time (Europe/Helsinki)", email: "Email address", change: "Change day", send: "Send booking request by email", subject: "Video meeting booking request", date: "Date" },
};

export function BookingCalendar() {
  const { lang, tr } = useLang();
  const text = copy[lang];
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !time || !email) return;
    const body = `${text.date}: ${format(date, "yyyy-MM-dd")}\n${text.time}: ${time}\n${text.zone}\n${text.email}: ${email}`;
    window.location.href = `mailto:info@tgnservices.fi?subject=${encodeURIComponent(text.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-8 md:py-10">
      <div className="mb-6 text-center">
        <Video className="mx-auto mb-3 size-6 text-primary" aria-hidden="true" />
        <h1 className="text-3xl md:text-4xl">{tr.book.title}</h1>
      </div>
      {!date ? (
        <div className="mx-auto w-fit max-w-full rounded-md border border-border bg-background p-4 shadow-[var(--shadow-soft)]">
          <h2 className="mb-3 text-center text-xl">{text.day}</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={locales[lang]}
            weekStartsOn={1}
            className="pointer-events-auto [--cell-size:2.25rem] sm:[--cell-size:3rem]"
          />
        </div>
      ) : (
        <form onSubmit={submit} className="mx-auto max-w-md space-y-5 rounded-md border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <div>
            <h2 className="text-2xl">{text.details}</h2>
            <p className="mt-2 text-primary" aria-live="polite">{format(date, "PPPP", { locale: locales[lang] })}</p>
            <Button type="button" variant="ghost" className="mt-2 -ml-3" onClick={() => { setDate(undefined); setTime(""); }}>
              <ArrowLeft aria-hidden="true" />{text.change}
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-time">{text.time}</Label>
            <Input id="booking-time" type="time" required value={time} onChange={(event) => setTime(event.target.value)} aria-describedby="booking-zone" />
            <p id="booking-zone" className="text-sm text-muted-foreground">{text.zone}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-email">{text.email}</Label>
            <Input id="booking-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <Button type="submit" className="h-auto min-h-10 w-full whitespace-normal py-3"><Mail aria-hidden="true" />{text.send}</Button>
        </form>
      )}
    </section>
  );
}