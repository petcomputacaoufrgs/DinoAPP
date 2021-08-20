import CalendarEventEntity from '../database/CalendarEventEntity'

export interface CalendarEventView {
	event: CalendarEventEntity
	color?: string
	icon?: string
}

export interface CalendarDayView {
	dayOfMonth: string
	events: CalendarEventView[]
}
