import logo from "@/assets/tgs-logo-g.png";

export function TemporaryLogoPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background px-6 py-12"
      aria-label="T & G Services"
    >
      <img
        src={logo}
        alt="T & G Services"
        className="h-auto max-h-[70vh] w-auto max-w-[min(80vw,32rem)] object-contain"
      />
    </main>
  );
}
