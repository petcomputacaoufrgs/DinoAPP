import CalendarEventTypeEntity from '../../../types/calendar/database/CalendarEventTypeEntity'

export interface CalendarEventTypeItemProps {
	item: CalendarEventTypeEntity
	onClickMenu: (
		event: React.MouseEvent<HTMLButtonElement>,
		item?: CalendarEventTypeEntity | undefined,
	) => void
	onClick: (item: CalendarEventTypeEntity) => void
}
