import React from 'react'
import TextField from '@material-ui/core/TextField'
import { MenuItem } from '@material-ui/core'
import DinoIconButton from '../../../../../../components/button/icon_button'
import CloseIcon from '@material-ui/icons/Close';
import PhoneFieldsProps from './props'
import NumberFormat from 'react-number-format'
import strUtils from '../../../../../../utils/StringUtils'
import InputAdornment from '@material-ui/core/InputAdornment'
import Constants from '../../../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../../../context/language'
import './style.css'

const PhoneFields = ({
	type,
	onChangeType,
	number,
	onChangeNumber,
	error,
	helperText,
	handleDeletePhone,
}: PhoneFieldsProps): JSX.Element => {
	const language = useLanguage()

	const types = [
		{
			label: language.data.CONTACT_MOBILE_PHONE,
			id: Constants.CONTACT_PHONE_CODE_MOBILE,
		},
		{
			label: language.data.CONTACT_RESIDENTIAL_PHONE,
			id: Constants.CONTACT_PHONE_CODE_RESIDENTIAL,
		},
		{
			label: language.data.CONTACT_PUBLIC_SERVICE_PHONE,
			id: Constants.CONTACT_PHONE_CODE_PUBLIC_SERVICE,
		},
	]

	const getNumberFormat = () => {
		return type === Constants.CONTACT_PHONE_CODE_RESIDENTIAL
			? '(23)4567-2345'
			: type === Constants.CONTACT_PHONE_CODE_PUBLIC_SERVICE
			? '194'
			: '(89)89898-9898'
	}

	const getNumberMask = () => {
		return type !== Constants.CONTACT_PHONE_CODE_PUBLIC_SERVICE
			? strUtils.replaceDigits(getNumberFormat(), '#')
			: '#'.repeat(Constants.CONTACT_PHONE_NUMBER.MAX)
	}

	return (
		<>
			<TextField
				select
				fullWidth
				margin='dense'
				label={language.data.FORM_TYPE}
				value={type}
				onChange={onChangeType}
			>
				{types.map((option, index) => (
					<MenuItem key={index} value={option.id}>
						{option.label}
					</MenuItem>
				))}
			</TextField>
			<div className='number_format'>
				<NumberFormat
					customInput={TextField}
					format={getNumberMask()}
					InputProps={{
						maxLength: Constants.CONTACT_PHONE_NUMBER.MAX,
						endAdornment: (
							<InputAdornment position='end'>
								<DinoIconButton
									ariaLabel={language.data.CONTACT_CLEAR_BUTTON_ARIA_LABEL}
									icon={CloseIcon}
									className='clear_button'
									onClick={() => handleDeletePhone(number)}
								/>
							</InputAdornment>
						),
					}}
					fullWidth
					placeholder={getNumberFormat()}
					error={error}
					value={number}
					onChange={onChangeNumber}
					margin='dense'
					label={language.data.FORM_PHONE}
					type='tel'
					helperText={helperText}
				/>
			</div>
		</>
	)
}

export default PhoneFields
