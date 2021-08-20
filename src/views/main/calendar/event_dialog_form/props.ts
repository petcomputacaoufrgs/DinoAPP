import CalendarEventTypeEntity from '../../../../types/calendar/database/CalendarEventTypeEntity'
import { CalendarEventView } from '../../../../types/calendar/view/CalendarView'

export default interface EventDialogFormProps {
	open: boolean
	onClose: () => void
	item?: CalendarEventView
	eventTypes?: CalendarEventTypeEntity[]
}
