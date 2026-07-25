// language.service.ts
import { Injectable, signal } from '@angular/core';

export type SupportedLanguage = 'fr' | 'en';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    // Signal réactif pour la langue actuelle (par défaut FR ou stockée en localStorage)
    currentLang = signal<SupportedLanguage>(
        (localStorage.getItem('app_lang') as SupportedLanguage) || 'fr'
    );

    setLanguage(lang: SupportedLanguage): void {
        this.currentLang.set(lang);
        localStorage.setItem('app_lang', lang);
    }
}