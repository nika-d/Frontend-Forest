export default class DateRange {
    static readonly DATE_FORMATTER = new Intl.DateTimeFormat('de-DE', {
        weekday: 'short',
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'Europe/Berlin',
    })
    readonly startDay: Date
    readonly endDay: Date
    private readonly endOfEndDay: Date

    constructor(startDate: string, endDate: string) {
        this.startDay = new Date(startDate)
        this.endDay = new Date(endDate)
        // add a day - 1 sec get the end of the day for comparison
        this.endOfEndDay = new Date(this.endDay.valueOf() + 86399000)
    }

    toString() {
        return DateRange.DATE_FORMATTER.format(this.startDay) + ' - ' + DateRange.DATE_FORMATTER.format(this.endDay)
    }

    beinhaltetZeit(dateTime: Date): boolean {
        return this.startDay <= dateTime && this.endOfEndDay >= dateTime
    }
}
