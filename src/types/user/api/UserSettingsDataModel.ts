import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface UserSettingsDataModel
	extends SynchronizableDataLocalIdModel<number> {
	language?: number
	colorTheme: number
	fontSize: number
	includeEssentialContact: boolean
	declineGoogleContacts: boolean
	declineGoogleCalendar: boolean
	treatmentId?: number
	firstSettingsDone: boolean
	googleCalendarId?: string
}
