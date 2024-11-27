import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

export const formatDateToUkrainianLocale = (date: Date): string => {
    const timeZone = 'Europe/Kyiv';
    const dateInUkrainianTime = toZonedTime(date, timeZone);

    return format(dateInUkrainianTime, 'MMMM dd, yyyy');
};
