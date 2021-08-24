import React from 'react'
import ContactItemListProps from './props'
import {
	Avatar,
	ListItem,
	ListItemText,
	ListItemAvatar,
	ListItemSecondaryAction,
} from '@material-ui/core'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../../context/language'
import PhoneService from '../../../../../services/contact/PhoneService'
import './styles.css'
import { renderIcon } from '../..'

const ContactItemList: React.FC<ContactItemListProps> = ({
	item,
	onClick,
	onClickMenu,
}) => {
	const language = useLanguage()

	return (
		<div className='contacts__list__item'>
			<ListItem button onClick={() => onClick(item)}>
				<ListItemAvatar>
					<Avatar
						aria-label={language.data.AVATAR_ALT}
						className={`avatar__color-${item.contact.color} colorDefault`}
					>
						{renderIcon(item.contact)}
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					className='list__item__text'
					primary={item.contact.name}
					secondary={PhoneService.getPhoneTypes(item.phones, language.data)}
				/>
				<ListItemSecondaryAction>
					<OptionsIconButton onClick={e => onClickMenu(e, item)} />
				</ListItemSecondaryAction>
			</ListItem>
		</div>
	)
}

export default ContactItemList
