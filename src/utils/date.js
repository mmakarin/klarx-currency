import originalDayJs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';

originalDayJs.extend(isSameOrBefore);
originalDayJs.extend(relativeTime);

export const dayjs = originalDayJs;

export const DATE_FORMAT = 'YYYY-MM-DD';