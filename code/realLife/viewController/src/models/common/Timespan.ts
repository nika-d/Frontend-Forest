export default class Timespan {
    static DATE_TIME_FORMATTER = new Intl.DateTimeFormat('de-DE', {
        weekday: 'short',
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin',
    })

    static DATE_FORMATTER = new Intl.DateTimeFormat('de-DE', {
        weekday: 'short',
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'Europe/Berlin',
    })
    static TIME_FORMATTER = new Intl.DateTimeFormat('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin',
    })

    readonly start: Date
    readonly end: Date

    constructor(startZeit: string, endZeit: string) {
        this.start = new Date(startZeit)
        this.end = new Date(endZeit)
        this.start.toString = () => Timespan.DATE_TIME_FORMATTER.format(this.start)
        this.end.toString = () => Timespan.TIME_FORMATTER.format(this.end)
    }
    formattedStartDate(): string {
        return Timespan.DATE_FORMATTER.format(this.start)
    }
    formattedStartTime(): string {
        return Timespan.TIME_FORMATTER.format(this.start)
    }
    formattedEndTime(): string {
        return Timespan.TIME_FORMATTER.format(this.end)
    }

    static welcheStartetZuerst(timespan1: Timespan, timespan2: Timespan): Timespan {
        return timespan1.start < timespan2.start ? timespan1 : timespan2
    }

    static startZeitenSindGleich(timespan1: Timespan, timespan2: Timespan): boolean {
        return timespan1.start.getTime() == timespan2.start.getTime()
    }
    static endZeitenSindGleich(timespan1: Timespan, timespan2: Timespan): boolean {
        return timespan1.end.getTime() == timespan2.end.getTime()
    }

    liegtZwischen(date1: Date, date2: Date): boolean {
        if (date1 == null && date2 == null) {
            return true
        }
        if (date1 == null) {
            return this.start < date2
        }
        if (date2 == null) {
            return date1 < this.start
        }
        return date1 < this.start && this.start < date2
    }

    toString() {
        return this.start.toString() + ' - ' + this.end.toString()
    }

    getStartDayAsFormString() {
        return this.start.toISOString().split('T')[0].replaceAll('-', '/')
    }
}
