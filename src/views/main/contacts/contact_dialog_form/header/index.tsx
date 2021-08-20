import React from 'react'
import DinoIconButton from '../../../../../components/button/icon_button'
import ColorLensIcon from '@material-ui/icons/ColorLens';
import { Avatar, CardHeader } from '@material-ui/core'
import ContactFormDialogHeaderProps from './props'
import { useLanguage } from '../../../../../context/language'
import '../../styles.css'
import './styles.css'
import ColorConstants from '../../../../../constants/app/ColorConstants'
import { HasStaffPowers } from '../../../../../context/private_router'
import { renderIcon } from '../..'

const AddContactDialogHeader = (
	props: ContactFormDialogHeaderProps,
): JSX.Element => {
	const language = useLanguage()

	const handleChangeColor = () => {
		const colors = ColorConstants.COLORS
		const index = colors.findIndex(c => c === props.contact.color)
		const color = colors[(index + 1) % colors.length]
		props.setContact({ ...props.contact, color })
	}

	const isStaff = HasStaffPowers()

	return (
		<CardHeader
			avatar={
				<Avatar
					aria-label={language.data.AVATAR_ALT}
					className={`avatar__color-${props.contact.color}`}
				>
					{renderIcon(props.contact)}
				</Avatar>
			}
			action={
				<DinoIconButton
					ariaLabel={language.data.COLOR_THEME_SELECTION_ARIA_LABEL}
					icon={ColorLensIcon}
					onClick={handleChangeColor}
				/>
			}
			title={
				props.contact.name ||
				(isStaff
					? language.data.CONTACTS_ADD_ESSENTIAL_CONTACT
					: language.data.NEW_CONTACT)
			}
			subheader={language.data.CONTACT}
			className='contact_dialog_form_header'
		/>
	)
}

export default AddContactDialogHeader
