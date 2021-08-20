import React, { useState, useEffect } from 'react'
import { useAlert } from '../../../context/alert'
import { useLanguage } from '../../../context/language'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import SelectTreatment from '../../../components/settings/select_treatment'
import SelectColorTheme from '../../../components/settings/select_color_theme'
import SelectLanguage from '../../../components/settings/select_language'
import DinoSwitch from '../../../components/switch'
import DinoHr from '../../../components/dino_hr'
import SelectFontSize from '../../../components/settings/select_font_size'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import Loader from '../../../components/loader'
import TreatmentService from '../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'
import TextButton from '../../../components/button/text_button'
import DinoDialog, {
	DinoDialogContent,
	DinoDialogHeader,
} from '../../../components/dialogs/dino_dialog'
import { DialogActions } from '@material-ui/core'
import UserService from '../../../services/user/UserService'
import AuthService from '../../../services/auth/AuthService'
import './styles.css'
import { HasStaffPowers } from '../../../context/private_router'
import { SelectEssentialContactGrant } from '../../../components/settings/select_essential_contact_grant'
import { SelectPassword } from '../../../components/settings/select_password'
import {
	GoogleCalendarGrantDialog,
	GoogleContactGrantDialog,
} from '../../../components/dialogs/google_grant_dialog'

const AWAIT_TIME_TO_DELETE_ACCOUNT_IN_SECONDS = 15

enum DialogEnum {
	NOP = 0,
	GoogleContactGrantDialog = 1,
	GoogleCalendarGrantDialog = 2,
	ChangePasswordDialog = 3,
	DeleteAccountDialog = 4,
}

const Settings: React.FC = () => {
	const alert = useAlert()
	const language = useLanguage()
	const hasStaffPowers = HasStaffPowers()

	const [settingsDialogOpen, setSettingsDialogOpen] = useState(DialogEnum.NOP)
	const [isLoading, setIsLoading] = useState(true)
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [treatments, setTreatments] = useState<TreatmentEntity[]>([])
	const [syncGoogleContactsSwitch, setSyncGoogleContactsSwitch] =
		useState(false)
	const [syncGoogleCalendarSwitch, setSyncGoogleCalendarSwitch] =
		useState(false)
	const [timeToDeleteAccount, setTimeToDeleteAccount] = useState(0)
	const [oldPassword, setOldPassword] = useState('')
	const [parentsAreaPassword, setParentsAreaPassword] = useState('')
	const [confirmParentsAreaPassword, setConfirmParentsAreaPassword] =
		useState('')
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>()

	const isDialogOpen = (dialog: DialogEnum) => settingsDialogOpen === dialog

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			const settings = await UserSettingsService.getFirst()

			if (settings) {
				if (treatments) setTreatments(treatments)
				setSettings(settings)
			}
			await updateSyncGoogleGrantSwitches(settings)

			finishLoading()
		}

		let updateSyncGoogleGrantSwitches = async (
			settings?: UserSettingsEntity,
		) => {
			if (settings) {
				const hasContactGrant = await GoogleScopeService.hasContactGrant()
				const hasCalendarGrant = await GoogleScopeService.hasCalendarGrant()

				setSyncGoogleContactsSwitch(
					hasContactGrant && !settings.declineGoogleContacts,
				)
				setSyncGoogleCalendarSwitch(
					hasCalendarGrant && !settings.declineGoogleCalendar,
				)
			}
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadData)
		TreatmentService.addUpdateEventListenner(loadData)
		GoogleScopeService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateSyncGoogleGrantSwitches = async () => {}
			finishLoading = () => {}
			UserSettingsService.removeUpdateEventListenner(loadData)
			TreatmentService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	useEffect(() => {
		const reduceTimeToDeleteAccount = () =>
			setTimeToDeleteAccount(timeToDeleteAccount - 1)

		let timeout: NodeJS.Timeout

		if (timeToDeleteAccount > 0) {
			timeout = setTimeout(reduceTimeToDeleteAccount, 1000)
		}

		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [timeToDeleteAccount])

	const handleGoogleContactSwitchChanged = () => {
		if (!settings) return

		if (!syncGoogleContactsSwitch) {
			setSettingsDialogOpen(DialogEnum.GoogleContactGrantDialog)
		} else setSyncGoogleContactsSwitch(false)
	}

	const handleGoogleCalendarSwitchChanged = () => {
		if (!settings) return

		if (!syncGoogleCalendarSwitch) {
			setSettingsDialogOpen(DialogEnum.GoogleCalendarGrantDialog)
		} else setSyncGoogleCalendarSwitch(false)
	}

	const handleCloseDialog = () => setSettingsDialogOpen(DialogEnum.NOP)

	const handlerDeleteAccountClick = () => {
		setTimeToDeleteAccount(AWAIT_TIME_TO_DELETE_ACCOUNT_IN_SECONDS)
		setSettingsDialogOpen(DialogEnum.DeleteAccountDialog)
	}

	const handleDeleteAccount = async () => {
		if (timeToDeleteAccount === 0) {
			const success = await UserService.deleteAccount()
			if (success) {
				alert.showSuccessAlert(language.data.DELETE_ACCOUNT_SUCCESS_MESSAGE)
				AuthService.logout()
			} else alert.showErrorAlert(language.data.DELETE_ACCOUNT_ERROR_MESSAGE)
			handleCloseDialog()
		}
	}

	const renderDeleteAccountDialog = (): JSX.Element => (
		<DinoDialog
			className='settings__delete_account_dialog'
			onSave={handleDeleteAccount}
			onClose={handleCloseDialog}
			open={isDialogOpen(DialogEnum.DeleteAccountDialog)}
			header={
				<DinoDialogHeader>
					<h4>{language.data.DELETE_ACCOUNT}</h4>
				</DinoDialogHeader>
			}
			actions={
				<DialogActions>
					<TextButton
						className='settings__delete_account_dialog__buttons delete_button'
						onClick={handleDeleteAccount}
					>
						{timeToDeleteAccount === 0
							? language.data.YES
							: timeToDeleteAccount}
					</TextButton>
					<TextButton
						className='settings__delete_account_dialog__buttons'
						onClick={handleCloseDialog}
					>
						{language.data.NO}
					</TextButton>
				</DialogActions>
			}
		>
			<Loader isLoading={isLoading}>
				<DinoDialogContent>
					<p>{language.data.DELETE_ACCOUNT_MESSAGE}</p>
				</DinoDialogContent>
			</Loader>
		</DinoDialog>
	)

	const renderPasswordDialog = () => (
		<DinoDialog
			className='settings__change_password_dialog'
			onClose={handleCloseDialog}
			open={isDialogOpen(DialogEnum.ChangePasswordDialog)}
			onSave={handleCloseDialog} //TODO: fazer função que salva nova senha na KidSpaceSettings
			labelSave={language.data.CHANGE}
			labelClose={language.data.CANCEL}
		>
			<Loader isLoading={isLoading}>
				<DinoDialogContent>
					<SelectPassword
						oldPassword={oldPassword}
						onChangeOldPassword={e => setOldPassword(e.target.value)}
						parentsAreaPassword={parentsAreaPassword}
						onChangePassword={e => setParentsAreaPassword(e.target.value)}
						confirmParentsAreaPassword={confirmParentsAreaPassword}
						onChangeConfirmPassword={e =>
							setConfirmParentsAreaPassword(e.target.value)
						}
						passwordErrorMessage={passwordErrorMessage}
						showOldPasswordField
					/>
					<a
						className='forgot_password__link'
						href={
							'https://i.guim.co.uk/img/media/936a06656761f35e75cc20c9098df5b2e8c27ba7/0_398_4920_2952/master/4920.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=97df6bd31d4f899da5bf4933a39672da'
						}
					>
						{language.data.FORGOT_PASSWORD}
					</a>
				</DinoDialogContent>
			</Loader>
		</DinoDialog>
	)

	const renderUserOnlySection = () =>
		!hasStaffPowers && (
			<>
				<FormControl className='settings__form'>
					<SelectTreatment
						availableTreatments={treatments}
						settings={settings}
					/>
				</FormControl>
				<DinoHr invisible />
				<FormControl className='settings__form'>
					<DinoSwitch
						selected={syncGoogleContactsSwitch}
						onChangeSelected={handleGoogleContactSwitchChanged}
						label={language.data.SAVE_CONTACT_ON_GOOGLE_GRANT}
					/>
				</FormControl>
				<DinoHr />
				<FormControl className='settings__form'>
					<DinoSwitch
						selected={syncGoogleCalendarSwitch}
						onChangeSelected={handleGoogleCalendarSwitchChanged}
						label={'Mude o grant de calendário ablu blu blé'}
					/>
				</FormControl>
				<DinoHr />
				<FormControl className='settings__form'>
					<SelectEssentialContactGrant settings={settings} />
				</FormControl>
				<DinoHr />
				<FormControl>
					<TextButton
						onClick={() =>
							setSettingsDialogOpen(DialogEnum.ChangePasswordDialog)
						}
						className='settings__form__change_password'
					>
						{language.data.CHANGE_PASSWORD_LABEL}
					</TextButton>
				</FormControl>
				<GoogleContactGrantDialog
					settings={settings}
					onClose={handleCloseDialog}
					open={isDialogOpen(DialogEnum.GoogleContactGrantDialog)}
				/>
				<GoogleCalendarGrantDialog
					settings={settings}
					onClose={handleCloseDialog}
					open={isDialogOpen(DialogEnum.GoogleCalendarGrantDialog)}
				/>
			</>
		)

	return (
		<Loader isLoading={isLoading} hideChildren>
			<div className='settings'>
				<Typography
					className='settings__title'
					color='textSecondary'
					gutterBottom
				>
					{language.data.SETTINGS_TITLE}
				</Typography>
				<FormControl className='settings__form'>
					<SelectLanguage settings={settings} />
				</FormControl>
				<FormControl className='settings__form'>
					<SelectFontSize settings={settings} />
				</FormControl>
				<FormControl className='settings__form'>
					<SelectColorTheme settings={settings} />
				</FormControl>
				{renderUserOnlySection()}
				<DinoHr />
				<FormControl>
					<TextButton
						onClick={handlerDeleteAccountClick}
						className='settings__form__delete_account'
					>
						{language.data.DELETE_ACCOUNT}
					</TextButton>
				</FormControl>
				{/* TODO fazer a verificação de senha {renderPasswordDialog()} */}
				{renderDeleteAccountDialog()}
			</div>
		</Loader>
	)
}

export default Settings
