import React, { ChangeEvent, useEffect, useState } from 'react'
import AccessDialogProps from './props'
import { useLanguage } from '../../../../context/language/index'
import Button from '../../../button'
import UserSettingsEntity from '../../../../types/user/database/UserSettingsEntity'
import UserSettingsService from '../../../../services/user/UserSettingsService'
import '../styles.css'
import './styles.css'
import HashUtils from '../../../../utils/HashUtils'
import DataConstants from '../../../../constants/app_data/DataConstants'

const AccessDialog: React.FC<AccessDialogProps> = ({
	open,
	icon: Icon,
	onClose,
	onConfirm,
}) => {
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	const [settings, setSettings] = useState<UserSettingsEntity | undefined>(
		undefined,
	)
	const [parentsAreaPassword, setParentsAreaPassword] = useState('')
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>()

	useEffect(() => {
		if (!open) {
			setParentsAreaPassword('')
			setPasswordErrorMessage(undefined)
		}
	}, [open])

	useEffect(() => {
		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()

			if (settings) {
				updateSettings(settings)
			}
			finishLoading()
		}

		let updateSettings = (settings: UserSettingsEntity) => {
			setSettings(settings)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateSettings = () => {}
			finishLoading = () => {}
			UserSettingsService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleConfirm = async () => {
		if (settings) {
			onConfirm()
		}
	}

	const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value

		if (newValue.length <= DataConstants.USER_PASSWORD.MAX) {
			setParentsAreaPassword(event.target.value)
		}
	}

	return (
		<>
			{open && (
				<div className='kids_space_dialog access_dialog'>
					<div className='kids_space_dialog__circle'>
						<Icon />
					</div>
					<div className='kids_space_dialog__content'>
						<p>{language.data.ACCESS_PARENTS_AREA}</p>
						<div className='access_dialog__form'>
							<form>
								<label>{language.data.PASSWORD}</label>
								<br />
								<input
									autoComplete='off'
									value={parentsAreaPassword}
									onChange={handleChangePassword}
									type='password'
									name='password'
									required
								/>
								{passwordErrorMessage && (
									<p className='access_dialog__form__error_message'>
										{passwordErrorMessage}
									</p>
								)}
							</form>
							<a
								href={
									'https://i.guim.co.uk/img/media/936a06656761f35e75cc20c9098df5b2e8c27ba7/0_398_4920_2952/master/4920.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=97df6bd31d4f899da5bf4933a39672da'
								}
							>
								{' '}
								{language.data.FORGOT_PASSWORD}
							</a>
							<div className='access_dialog__buttons'>
								<Button onClick={onClose}>{language.data.CANCEL}</Button>
								<Button onClick={handleConfirm}>{language.data.ACCESS}</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default AccessDialog
