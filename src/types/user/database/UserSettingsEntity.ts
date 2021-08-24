import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface UserSettingsEntity
	extends SynchronizableEntity<number> {
	language: number
	colorTheme: number
	fontSize: number
	includeEssentialContact: boolean
	declineGoogleContacts: boolean
	firstSettingsDone: boolean
	treatmentLocalId?: number
}
