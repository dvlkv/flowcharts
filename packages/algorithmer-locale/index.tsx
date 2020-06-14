import { createContext, Fragment, memo } from "preact/compat";
import { useContext, useState } from "preact/hooks";

type Locales = 'RU' | 'EN';
type LocalizedTextStore<T extends string> = { [TLocale in Locales]: { [TKey in T]: string } }

export function useDictionary<T extends string>(dictionary: LocalizedTextStore<T>): LocalizedTextStore<T> {
  return dictionary;
}

import { dictionary } from "./dictionary";

const LocaleContext = createContext<{ locale: Locales, setLocale: (locale: Locales) => void }>({
  locale: 'RU',
  setLocale: () => { throw new Error('Cannot use setLocale outside locale context') }
});

type SpanProps = { text: keyof typeof dictionary[Locales] };

export const Span = memo(({ text }: SpanProps) => {
  // Just subscribe to context updates
  let localeContext = useContext(LocaleContext);

  return <Fragment>{dictionary[localeContext.locale][text]}</Fragment>;
});

type LocaleProviderProps = { children: any, defaultLocale: Locales }

export const LocaleProvider = memo(({ children, defaultLocale }: LocaleProviderProps) => {
  let [locale, setLocale] = useState<Locales>(defaultLocale);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
})
