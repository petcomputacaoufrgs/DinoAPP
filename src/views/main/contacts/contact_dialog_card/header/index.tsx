import React from 'react'
import { Avatar, CardHeader } from '@material-ui/core'
import ContactCardHeaderProps from './props'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../../context/language'
import PhoneService from '../../../../../services/contact/PhoneService'
import '../../styles.css'
import './styles.css'
import { renderIcon } from '../..'

const ContactCardHeader: React.FC<ContactCardHeaderProps> = ({ item, onClick, children }) => {
	const language = useLanguage()

	return (
		<div className='contact_dialog_content_header dino__text__wrap'>
			<CardHeader
				avatar={
					<Avatar
						aria-label={language.data.AVATAR_ALT}
						className={`avatar__color-${item.contact.color} colorDefault`}
					>
						{renderIcon(item.contact)}
					</Avatar>
				}
				action={
					<div className='dino__flex_row'>
						<OptionsIconButton onClick={onClick} />
					</div>
				}
				title={item.contact.name}
				subheader={PhoneService.getPhoneTypes(item.phones, language.data)}
			/>
			{children}
		</div>
	)
}

export default ContactCardHeader
