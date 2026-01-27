import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './settings';

export default getRequestConfig(async ({ requestLocale }) => {
  const resolved = await requestLocale;
  const candidate = (resolved ?? defaultLocale) as string;
  const locale = locales.includes(candidate) ? candidate : defaultLocale;
  return {
    locale,
    messages: (await import(`../lib/dictionary/${locale}.json`)).default
  };
});
