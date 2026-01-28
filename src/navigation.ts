import {createNavigation} from 'next-intl/navigation';
import {locales} from './i18n/settings';
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation({locales});
