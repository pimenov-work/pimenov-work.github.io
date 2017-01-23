import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import { NAME } from './constants';

export const getFilter = state => state[NAME].filter;
export const getHistory = state => state[NAME].history;

export const getHistoryData = createSelector(
  [getHistory],
  (history) => {
    const { data } = history;
    return sortBy(data, datum => new Date(datum.date).getTime() * (-1));
  }
);
