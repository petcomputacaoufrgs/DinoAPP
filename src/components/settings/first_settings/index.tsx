import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import AuthService from '../../../services/auth/AuthService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'
import TreatmentService from '../../../services/treatment/TreatmentService'
import FirstSettingsDialogs from './dialogs'
import { toggle } from '../../../constants/toggle/Toggle'
import './styles.css'

const FirstSettings: React.FC = () => {
	let done = false
	const language = useLanguage()

	const [step, setStep] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [treatments, setTreatments] = useState<TreatmentEntity[]>([])
	const [parentsAreaPassword, setParentsAreaPassword] = useState('')
	const [confirmParentsAreaPassword, setConfirmParentsAreaPassword] =
		useState('')
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>()

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			const settings = await UserSettingsService.getFirst()

			if (settings) updateSettings(settings)

			updateTreatments(treatments)

			finishLoading()
		}

		let updateSettings = (settings: UserSettingsEntity) => {
			setSettings(settings)
		}

		let updateTreatments = (treatments: TreatmentEntity[]) => {
			setTreatments(treatments)
		}

		let finishLoading = () => setIsLoading(false)

		UserSettingsService.addUpdateEventListenner(loadData)
		TreatmentService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateTreatments = () => {}
			updateSettings = () => {}
			finishLoading = () => {}
			UserSettingsService.removeUpdateEventListenner(loadData)
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleCloseDialogs = () => setStep(-1)

	const saveSettings = async () => {
		if (settings) {
			settings.firstSettingsDone = done
			await UserSettingsService.save(settings)
		}
	}

	const handleSave = () => {
		handleCloseDialogs()
		saveSettings()
	}

	const handleCancel = () => {
		handleCloseDialogs()
		AuthService.logout()
	}

	const handleBackStep = () => {
		setStep(step - 1)
	}

	const handleNextStep = async () => {
		if (settings === undefined) {
			const newEntity = UserSettingsService.getDefaultSettings(language)
			setSettings(newEntity)
			saveSettings()
		}

		setStep(step + 1)
	}

	const handleDoneChange = (value: boolean) => (done = value)

	return (
		<>
			{!isLoading &&
				settings &&
				(!settings.firstSettingsDone || toggle.forceFirstLogin) && (
					<FirstSettingsDialogs
						settings={settings}
						step={step}
						onCloseDialogs={handleCloseDialogs}
						onNextStep={handleNextStep}
						onBackStep={handleBackStep}
						onSave={handleSave}
						onCancel={handleCancel}
						treatments={treatments}
						onDoneChange={handleDoneChange}
						parentsAreaPassword={parentsAreaPassword}
						onChangePassword={e => setParentsAreaPassword(e.target.value)}
						confirmParentsAreaPassword={confirmParentsAreaPassword}
						onChangeConfirmPassword={e =>
							setConfirmParentsAreaPassword(e.target.value)
						}
						passwordErrorMessage={passwordErrorMessage}
						onPasswordErrorMessageChange={value =>
							setPasswordErrorMessage(value)
						}
					/>
				)}
		</>
	)
}

export default FirstSettings
