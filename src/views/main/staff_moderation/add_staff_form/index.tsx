import React, { useState } from 'react'
import Button from '../../../../components/button'
import { useAlert } from '../../../../context/alert'
import { useLanguage } from '../../../../context/language'
import { IsNotClient } from '../../../../context/private_router'
import StaffService from '../../../../services/staff/StaffService'
import EmailTextField from '../email_textfield'
import SaveIcon from '@material-ui/icons/Save'
import './styles.css'

const AddStaffForm = () => {
	const [emailValue, setEmailValue] = useState('')
	const [error, setError] = useState<string>()
	const isNotClient = IsNotClient()
	const alert = useAlert()
	const language = useLanguage()

	const handleAddEmail = async () => {
		const email = emailValue.trim()

		const isInvalid = await StaffService.isEmailInvalid(email, language.data)

		setError(isInvalid)

		if (!isInvalid) {
			StaffService.save({ email, sentInvitationDate: new Date() })
			alert.showSuccessAlert(language.data.STAFF_SAVE_SUCCESS)
		}
	}

	return (
		<div className='add_staff'>
			<p className='add_staff__title'>{language.data.FORM_ADD_STAFF}</p>
			<p className='add_staff__text'>{language.data.ADD_STAFF_LABEL}</p>
			<div className='dialog_form__content'>
				<EmailTextField
					value={emailValue}
					handleChange={value => setEmailValue(value)}
					error={error}
				/>
				<Button
					disabled={isNotClient}
					onClick={handleAddEmail}
					className='save_button'
				>
					<SaveIcon className='save_button__icon' />
					{language.data.ADD}
				</Button>
			</div>
		</div>
	)
}

export default AddStaffForm
