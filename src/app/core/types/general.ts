export interface SelectOption {
  displayName: string;
  value: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface LanguageOption {
  displayName: string;
  shortName: string;
  value: string;
  rtl?: boolean;
}
