import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { fi, sv, es, enGB } from "date-fns/locale";
import { ArrowLeft, Mail, Video } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/i18n/LanguageProvider";
import { submitBookingRequest } from "./booking.functions";

const locales = { fi, sv, es, en: enGB };
const copy = {
  fi: { day: "Valitse päivä", details: "Videopalaverin tiedot", time: "Toivottu kellonaika", zone: "Suomen aikaa (Europe/Helsinki)", email: "Sähköpostiosoite", change: "Vaihda päivää", send: "Lähetä varauspyyntö", sent: "Varauspyyntö lähetetty", sentBody: "Kiitos varauspyynnöstäsi! Palaamme sinulle sähköpostitse erikseen.", error: "Lähettäminen ei onnistunut. Yritä hetken päästä uudelleen." },
  sv: { day: "Välj dag", details: "Uppgifter för videomötet", time: "Önskad tid", zone: "Finsk tid (Europe/Helsinki)", email: "E-postadress", change: "Byt dag", send: "Skicka bokningsförfrågan", sent: "Bokningsförfrågan skickad", sentBody: "Tack för din bokningsförfrågan! Vi återkommer separat via e-post.", error: "Det gick inte att skicka. Försök igen om en stund." },
  es: { day: "Elige un día", details: "Datos de la videollamada", time: "Hora deseada", zone: "Hora de Finlandia (Europe/Helsinki)", email: "Correo electrónico", change: "Cambiar día", send: "Enviar solicitud", sent: "Solicitud enviada", sentBody: "¡Gracias por tu solicitud! Nos pondremos en contacto contigo por correo electrónico.", error: "No se pudo enviar. Inténtalo de nuevo en un momento." },
  en: { day: "Choose a day", details: "Video meeting details", time: "Preferred time", zone: "Finland time (Europe/Helsinki)", email: "Email address", change: "Change day", send: "Send booking request", sent: "Booking request sent", sentBody: "Thank you for your booking request! We will follow up separately by email.", error: "Sending failed. Please try again in a moment." },
};

export function BookingCalendar() {
  const { lang, tr } = useLang();
  const text = copy[lang];
  const sendBooking = useServerFn(submitBookingRequest);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !time || !email || pending) return;
    const form = event.currentTarget;
    const website = String(new FormData(form).get("website") ?? "");
    setPending(true);
    setFailed(false);
    try {
      const result = await sendBooking({
        data: {
          meetingDate: format(date, "yyyy-MM-dd"),
          preferredTime: time,
          email,
          lang,
          website,
          idempotencyKey: idempotencyKey.current,
        },
      });
      if (result.ok) setSent(true);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-8 md:py-10">
      <div className="mb-6 text-center">
        <Video className="mx-auto mb-3 size-6 text-primary" aria-hidden="true" />
        <h1 className="text-3xl md:text-4xl">{tr.book.title}</h1>
      </div>
      {sent ? (
        <div className="mx-auto max-w-md rounded-md border border-border bg-background p-6 text-center shadow-[var(--shadow-soft)]" aria-live="polite">
          <Mail className="mx-auto mb-3 size-6 text-primary" aria-hidden="true" />
          <h2 className="text-2xl">{text.sent}</h2>
          <p className="mt-3 text-muted-foreground">{text.sentBody}</p>
        </div>
      ) : !date ? (
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
          <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><Label htmlFor="booking-website">Website</Label><Input id="booking-website" name="website" tabIndex={-1} autoComplete="off" /></div>
          <div className="space-y-2">
            <Label htmlFor="booking-time">{text.time}</Label>
            <Input id="booking-time" type="time" required value={time} onChange={(event) => setTime(event.target.value)} aria-describedby="booking-zone" />
            <p id="booking-zone" className="text-sm text-muted-foreground">{text.zone}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-email">{text.email}</Label>
            <Input id="booking-email" type="email" autoComplete="email" maxLength={255} required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          {failed && <p className="text-sm text-destructive" role="alert">{text.error}</p>}
          <Button type="submit" disabled={pending} className="h-auto min-h-10 w-full whitespace-normal py-3"><Mail aria-hidden="true" />{text.send}</Button>
        </form>
      )}
    </section>
  );
}
