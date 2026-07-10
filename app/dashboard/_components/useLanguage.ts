"use client";
import { useState, useEffect } from "react";
import { getTranslation } from "./translations";

export function useLanguage() {
  const [lang, setLang] = useState("auto");

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem("preferred_language") || "auto");
    };

    // Load initial language
    handleStorageChange();

    // Listen for custom event triggered from settings page
    window.addEventListener("languageChanged", handleStorageChange);
    
    return () => window.removeEventListener("languageChanged", handleStorageChange);
  }, []);

  const t = (text: string) => getTranslation(lang, text as any);

  return { lang, t };
}
