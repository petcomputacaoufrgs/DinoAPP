import GoogleScope from '../../../types/auth/google/GoogleScope'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'

export default interface GoogleGrantDialogProps {
	scopes: GoogleScope[]
	open: boolean
	settings?: UserSettingsEntity
	onClose: () => void
}
