import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { t, type Lang } from "./translations";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; tr: (typeof t)["fi"] };

const LanguageContext = createContext<Ctx>({ lang: "fi", setLang: () => {}, tr: t.fi });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fi");

  useEffect(() => {
    const stored = window.localStorage.getItem("cys-lang") as Lang | null;
    if (stored && stored in t) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("cys-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
