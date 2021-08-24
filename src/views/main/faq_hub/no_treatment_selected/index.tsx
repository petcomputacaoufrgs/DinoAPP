import React, { useEffect, useState } from 'react'
import SelectTreatment from '../../../../components/settings/select_treatment'
import { useLanguage } from '../../../../context/language'
import UserSettingsService from '../../../../services/user/UserSettingsService'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import NoFAQAvailable from '../no_faq_available'
import UserSettingsEntity from '../../../../types/user/database/UserSettingsEntity'

const NoTreatmentSelected: React.FC = () => {
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<TreatmentEntity[]>()
	const [settings, setSettings] = useState<UserSettingsEntity>()

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			updateTreatments(treatments)
			const userSettings = await UserSettingsService.getFirst()
			setSettings(userSettings)
			finishLoading()
		}

		let updateTreatments = (treatments: TreatmentEntity[]) => {
			setTreatments(treatments)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		TreatmentService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateTreatments = () => {}
			finishLoading = () => {}
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	return treatments ? (
		<div className='faq__fail_to_load'>
			<p>{language.data.NO_TREATMENT_SELECTED}</p>
			<SelectTreatment availableTreatments={treatments} settings={settings} />
		</div>
	) : (
		<NoFAQAvailable />
	)
}

export default NoTreatmentSelected
