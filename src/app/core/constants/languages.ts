import { LanguageOption } from "@types";

export const Languages: LanguageOption[] = [
  {
    displayName: 'English',
    shortName: 'EN',
    value: 'en',
  },
  {
    displayName: 'Ελληνικά',
    shortName: 'Ελ',
    value: 'el',
  },
  {
    displayName: 'עברית',
    shortName: 'עב',
    value: 'he',
    rtl: true,
  },
  {
    displayName: 'Magyar',
    shortName: 'Ma',
    value: 'hu',
  },
  {
    displayName: 'Italiana',
    shortName: 'IT',
    value: 'it',
  },
  {
    displayName: 'Pусский',
    shortName: 'Pу',
    value: 'ru',
  },
  {
    displayName: 'Українська',
    shortName: 'Ук',
    value: 'uk',
  },
];

export const LanguageImgUrls: { [key: string]: string } = {
  en: '/assets/lang-images/en.png',
  el: '/assets/lang-images/el.png',
  he: '/assets/lang-images/he.png',
  ru: '/assets/lang-images/ru.png',
  hu: '/assets/lang-images/hu.png',
  it: '/assets/lang-images/it.png',
  uk: '/assets/lang-images/uk.png',
};
