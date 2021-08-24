import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
export default interface SelectTreatmentProps {
	settings?: UserSettingsEntity
	availableTreatments: TreatmentEntity[]
}
