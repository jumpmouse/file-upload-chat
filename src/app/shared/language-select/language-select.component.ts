import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Languages, LanguageImgUrls } from '@constants/languages';
import { SelectComponent } from '../select/select.component';
import { LanguageOption } from '@types';

@Component({
  selector: 'flw-language-select',
  standalone: true,
  imports: [SelectComponent],
  templateUrl: './language-select.component.html',
  styleUrl: './language-select.component.scss',
})
export class LanguageSelectComponent {
  readonly languages: LanguageOption[] = Languages;
  selectedLanguage!: string;
  langImageUrls: { [key: string]: string } = LanguageImgUrls;

  languageChanged(event: string): void {
    this.selectedLanguage = event;
    const langUrlSegment = event === 'en' ? '' : `/${event}`;
    window.location.href = `${window.location.origin}${langUrlSegment}`;
  }

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.selectedLanguage = this.locale;
  }
}
