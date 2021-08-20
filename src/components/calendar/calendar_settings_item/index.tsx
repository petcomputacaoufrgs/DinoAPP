import React from 'react'
import { ReactComponent as PillSVG } from '../../../assets/icons/general_use/pill.svg'
import { ReactComponent as ClockSVG } from '../../../assets/icons/general_use/clock.svg'
import { ReactComponent as ClipboardSVG } from '../../../assets/icons/general_use/clipboard.svg'
import OptionsIconButton from '../../button/icon_button/options_icon_button'
import './styles.css'
import {
	ListItem,
	ListItemText,
	ListItemAvatar,
	ListItemSecondaryAction,
} from '@material-ui/core'
import { CalendarEventTypeItemProps } from './props'

const CalendarEventTypeItem: React.FC<CalendarEventTypeItemProps> = ({
	item,
	onClick,
	onClickMenu,
}) => {
	const getIcon = () => {
		let Icon = <></>
		if (item.icon) {
			const icons = {
				pill: <PillSVG />,
				clipboard: <ClipboardSVG />,
				clock: <ClockSVG />,
			}
			Icon = icons[item.icon] || <></>
		}
		return Icon
	}

	return (
		<div className='event_type__list__item'>
			<ListItem
				button
				onClick={() => onClick(item)}
				className='event_type__list__item'
			>
				<ListItemAvatar>
					<div
						className='event_type_item__icon'
						style={{ backgroundColor: item.color }}
					>
						{getIcon()}
					</div>
				</ListItemAvatar>
				<ListItemText className='list__item__text' primary={item.title} />
				<ListItemSecondaryAction>
					<OptionsIconButton onClick={e => onClickMenu(e, item)} />
				</ListItemSecondaryAction>
			</ListItem>
		</div>
	)
}

export default CalendarEventTypeItem
