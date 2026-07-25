// language.service.ts
import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = 'fr' | 'en';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private translate = inject(TranslateService);
    private readonly STORAGE_KEY = 'app_lang';

    readonly currentLang = signal<SupportedLanguage>(this.getInitialLanguage());

    constructor() {
        const initial = this.currentLang();

        // 1. Définir la langue par défaut ET la langue à utiliser
        this.translate.use(initial);

        // 2. Synchroniser les changements futurs
        effect(() => {
            this.translate.use(this.currentLang());
        });
    }

    setLanguage(lang: SupportedLanguage): void {
        this.currentLang.set(lang);
        localStorage.setItem(this.STORAGE_KEY, lang);
    }

    private getInitialLanguage(): SupportedLanguage {
        const savedLang = localStorage.getItem(this.STORAGE_KEY) as SupportedLanguage | null;
        if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
            return savedLang;
        }

        const browserLang = navigator.language || (navigator as any).userLanguage || '';
        const primaryLang = browserLang.toLowerCase().split('-')[0];

        return primaryLang === 'en' ? 'en' : 'fr';
    }
}