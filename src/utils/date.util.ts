import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(relativeTime)

type PossiblyADate = Date | string | number
export const toUTC = (date: PossiblyADate, format: string) => {
    try {
        // return `${dayjs(date).utc().format(format)} UTC`
        return dayjs(date).utc().format(format)
    } catch {
        return 'Not a date'
    }
}

export const DAYJS_FORMATS = {
    dateLong: (date: PossiblyADate) => `${toUTC(date, 'dddd, MMMM D, YYYY ∙ hh:mm A')} UTC`,
    date: (date: PossiblyADate) => toUTC(date, 'ddd. MMM. D ∙ hh:mm A'),
    dateShort: (date: PossiblyADate) => toUTC(date, 'MMM. D ∙ hh:mm A'),
    dateChart: (date: PossiblyADate) => toUTC(date, 'MMM. D'),
    day: (date: PossiblyADate) => toUTC(date, 'MMM D'),
    timeAgo: (date: PossiblyADate) => dayjs(date).utc().fromNow(),
}

export const getDurationBetween = ({
    startTs,
    endTs,
    showYears = true,
    showMonths = true,
    showWeeks = true,
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
}: {
    startTs: number
    endTs: number
    showYears?: boolean
    showMonths?: boolean
    showWeeks?: boolean
    showDays?: boolean
    showHours?: boolean
    showMinutes?: boolean
    showSeconds?: boolean
}): {
    // details
    inSeconds: number
    inMinutes: number
    inHours: number
    inDays: number
    inWeeks: number
    inMonths: number
    inYears: number

    // format
    oneLiner: string
    humanize: string
} => {
    // get details
    const diffInMilliseconds = dayjs(endTs).diff(startTs)
    const diffDuration = dayjs.duration(diffInMilliseconds)
    const inSeconds = Math.floor(diffDuration.asSeconds()) % 60
    const inMinutes = Math.floor(diffDuration.asMinutes()) % 60
    const inHours = Math.floor(diffDuration.asHours()) % 24
    const inDays = Math.floor(diffDuration.asDays()) % 7
    const inWeeks = Math.floor(diffDuration.asWeeks()) % 52
    const inMonths = Math.floor(diffDuration.asMonths()) % 12
    const inYears = Math.floor(diffDuration.asYears())

    // format
    let oneLiner = ''
    if (showYears && inYears) oneLiner += `${inYears} year${inYears > 1 ? 's' : ''}, `
    if (showMonths && inMonths) oneLiner += `${inMonths} month${inMonths > 1 ? 's' : ''}, `
    if (showWeeks && inWeeks) oneLiner += `${inWeeks} week${inWeeks > 1 ? 's' : ''}, `
    if (showDays && inDays) oneLiner += `${inDays} day${inDays > 1 ? 's' : ''}, `
    if (showHours && inHours) oneLiner += `${inHours} hour${inHours > 1 ? 's' : ''}, `
    if (showMinutes && inMinutes) oneLiner += `${inMinutes} minute${inMinutes > 1 ? 's' : ''}, `
    if (showSeconds && inSeconds) oneLiner += `${inSeconds} second${inSeconds > 1 ? 's' : ''}, `

    return {
        // details
        inSeconds,
        inMinutes,
        inHours,
        inDays,
        inWeeks,
        inMonths,
        inYears,

        // format
        oneLiner: oneLiner ? oneLiner.slice(0, -2).trim() : 'now',
        humanize: diffDuration.humanize(),
    }
}
