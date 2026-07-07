import { getLanguageAttributes } from "../metadata/get-language-attribute";

/**
 * Creates a DateTimeFormat instance based on WordPress settings.
 *
 * @returns {Promise<Intl.DateTimeFormat>} The formatter instance.
 */
export async function getDateTimeFormatter(): Promise<Intl.DateTimeFormat> {
    const dateFormat = await getOption('date_format') ?? 'F j, Y';
    const lang = await getLanguageAttributes();

    const dateTimeOptionsMap: Record<string, Intl.DateTimeFormatOptions> = {
        'd': { day: '2-digit' },
        'j': { day: 'numeric' },

        'l': { weekday: 'long' },
        'D': { weekday: 'short' },

        'm': { month: '2-digit' },
        'n': { month: 'numeric' },
        'F': { month: 'long' },
        'M': { month: 'short' },

        'Y': { year: 'numeric' },
        'y': { year: '2-digit' },

        'a': { hour12: true },
        'A': { hour12: true },

        'g': { hour: 'numeric', hour12: true },
        'h': { hour: '2-digit', hour12: true },
        'G': { hour: 'numeric', hour12: false },
        'H': { hour: '2-digit', hour12: false },

        'i': { minute: '2-digit' },
        's': { second: '2-digit' },

        'T': { timeZoneName: 'short' }
    };

    const dateTimeOptions = dateFormat.split('').reduce((options, char) => {
        if (dateTimeOptionsMap[char]) {
            return { ...options, ...dateTimeOptionsMap[char] };
        }
        return options;
    }, {} as Intl.DateTimeFormatOptions);

    return new Intl.DateTimeFormat(lang.replace('_', '-'), dateTimeOptions);
}
