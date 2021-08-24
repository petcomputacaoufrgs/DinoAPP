import React from 'react'
import AgreementDialog from '../agreement_dialog'
import LogoutDialogProps from './props'
import AgreementDialogProps from '../agreement_dialog/props'
import { useLanguage } from '../../../context/language'
import './styles.css'

const LogoutDialog: React.FC<LogoutDialogProps> = ({
	open,
	onAgree,
	onDisagree,
}) => {
	const language = useLanguage()

	const agreementDialogProps: AgreementDialogProps = {
		onAgree: onAgree,
		onDisagree: onDisagree,
		question: language.data.LOGOUT_DIALOG_QUESTION,
		description: language.data.LOGOUT_DIALOG_DESCRIPTION,
		agreeOptionText: language.data.YES,
		disagreeOptionText: language.data.NO,
		open: open,
	}

	return <AgreementDialog {...agreementDialogProps} />
}

export default LogoutDialog
