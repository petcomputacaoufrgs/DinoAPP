import React from 'react'
import DinoDialog, { DinoDialogHeader } from '../../../dialogs/dino_dialog'
import DinoLogoHeader from '../../../dino_logo_header'
import DinoStepper from '../../../dino_stepper'
import SelectColorTheme from '../../select_color_theme'
import SelectFontSize from '../../select_font_size'
import SelectLanguage from '../../select_language'
import SelectTreatment from '../../select_treatment'
import { useLanguage } from '../../../../context/language'
import FirstSettingsDialogProps from './props'
import { FirstSettingsDialogsProps } from './props'
import { HasStaffPowers } from '../../../../context/private_router'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { SelectEssentialContactGrant } from '../../select_essential_contact_grant'
import { SelectPassword } from '../../select_password'

const FirstSettingsDialogs: React.FC<FirstSettingsDialogProps> = props => {
	const language = useLanguage()

	const isStaff = HasStaffPowers()

	const renderFirstSettingsDialogs = (): FirstSettingsDialogsProps[] => {
		const finalDialog = {
			id: 'FINAL',
			component: renderFinalMessageDialog,
		}

		const basicDialogs = [
			{
				id: 'WELCOME',
				component: renderWelcomeMessageDialog,
			},
			{
				id: 'LANGUAGE',
				title: language.data.FIRST_LOGIN_CHOOSE_LANGUAGE,
				component: renderSelectLanguageDialogContent,
			},
			{
				id: 'COLOR THEME',
				title: language.data.FIRST_LOGIN_CHOOSE_COLOR_THEME,
				component: renderSelectColorThemeDialogContent,
			},
		]

		const userLockedDialogs = [
			{
				id: 'TREATMENT',
				title: language.data.FIRST_LOGIN_CHOOSE_TREATMENT,
				component: renderSelectTreatmentDialogContent,
			},
			{
				id: 'PASSWORD',
				title: language.data.FIRST_LOGIN_CHOOSE_PASSWORD,
				component: renderSetPasswordDialog,
			},
		]

		let dialogs = basicDialogs

		if (!isStaff) dialogs = dialogs.concat(userLockedDialogs)

		return dialogs.concat(finalDialog)
	}

	const renderSelectTreatmentDialogContent = () => (
		<div className='first_settings__message_dialog'>
			<SelectTreatment
				settings={props.settings}
				availableTreatments={props.treatments}
			>
				<SelectEssentialContactGrant settings={props.settings} />
			</SelectTreatment>
		</div>
	)

	const renderSelectColorThemeDialogContent = () => (
		<div className='first_settings__message_dialog'>
			<SelectColorTheme settings={props.settings} />
		</div>
	)

	const renderSelectLanguageDialogContent = () => (
		<div className='first_settings__message_dialog'>
			<SelectLanguage settings={props.settings} />
			<SelectFontSize settings={props.settings} />
		</div>
	)

	const renderWelcomeMessageDialog = () => (
		<div className='first_settings__message_dialog'>
			<DinoLogoHeader
				title={language.data.FIRST_LOGIN_WELCOME_MESSAGE_HEADER}
				size='small'
			/>
			<p>{language.data.FIRST_LOGIN_WELCOME_MESSAGE}</p>
			<h6 className='citation'>— {language.data.DINOAPP_TEAM}</h6>
		</div>
	)

	const renderSetPasswordDialog = () => (
		<div className='first_settings__message_dialog'>
			<SelectPassword {...props} />
		</div>
	)

	const renderFinalMessageDialog = () => (
		<div className='first_settings__message_dialog'>
			<DinoLogoHeader
				title={language.data.FIRST_LOGIN_DONE_MESSAGE}
				size='small'
			/>
			<p>{language.data.FIRST_LOGIN_THANK_YOU_FOR_JOINING_MESSAGE}</p>
			<p>{language.data.FIRST_LOGIN_CONFIGURATIONS_MESSAGE}</p>
		</div>
	)

	const dialogs = renderFirstSettingsDialogs()

	const LAST_DIALOG = dialogs.length - 1

	const getDialog = () => {
		if (props.step > -1 && props.step <= LAST_DIALOG) {
			return dialogs[props.step]
		}
		return dialogs[LAST_DIALOG]
	}

	const renderDialogHeader = () => {
		const isFirstOrLastDialog = props.step === 0 || props.step === LAST_DIALOG

		return (
			!isFirstOrLastDialog && (
				<DinoDialogHeader>{getDialog().title || ''}</DinoDialogHeader>
			)
		)
	}

	const isValidPassword = () => {
		if (props.parentsAreaPassword.length < DataConstants.USER_PASSWORD.MIN) {
			props.onPasswordErrorMessageChange(
				language.data.PASSWORD_MIN_LENGHT_ERROR_MESSAGE,
			)
			return false
		}

		if (props.parentsAreaPassword !== props.confirmParentsAreaPassword) {
			props.onPasswordErrorMessageChange(
				language.data.PASSWORD_CONFIRM_LENGHT_ERROR_MESSAGE,
			)
			return false
		}

		props.onPasswordErrorMessageChange(undefined)
		return true
	}

	const handleEnd = () => {
		if (props.step === LAST_DIALOG) {
			props.onDoneChange(true)
		}
		props.onSave()
	}

	const handleNextStep = () => {
		const passwordIndex = dialogs.findIndex(d => d.id === 'PASSWORD')

		if (props.step !== passwordIndex || isValidPassword()) props.onNextStep()
	}

	return (
		<DinoDialog
			className='first-settings'
			aria-labelledby={language.data.FIRST_LOGIN_DIALOG_LABEL}
			open={props.step > -1}
			onSave={props.onSave}
			onClose={props.onCloseDialogs}
			header={renderDialogHeader()}
			actions={
				<DinoStepper
					steps={LAST_DIALOG + 1}
					activeStep={props.step}
					onNext={handleNextStep}
					onBack={props.onBackStep}
					onEnd={handleEnd}
					onCancel={props.onCancel}
					endMessage={language.data.SAVE}
				/>
			}
		>
			{getDialog().component()}
		</DinoDialog>
	)
}

export default FirstSettingsDialogs
