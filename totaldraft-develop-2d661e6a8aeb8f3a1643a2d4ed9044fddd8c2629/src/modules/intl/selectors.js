import { NAME } from './constants';

export const getLocale = state => state[NAME].locale;
export const getIntl = state => state[NAME];
