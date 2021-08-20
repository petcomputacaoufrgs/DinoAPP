import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import './styles.css'
import CalendarEventTypeEntity from '../../../types/calendar/database/CalendarEventTypeEntity'

const SelectEventType: React.FC<{
	value?: CalendarEventTypeEntity
	onClickOption: (index: number) => void
	eventTypes?: CalendarEventTypeEntity[]
}> = props => {
	const language = useLanguage()

	const [selectedTypeLocalId, setSelectedTypeLocalId] = useState(
		props.value?.localId,
	)

	return (
		<div className='event_type__selector'>
			<InputLabel shrink>{language.data.EVENT_TYPE_ICON_ALT}</InputLabel>
			<Select
				fullWidth
				value={selectedTypeLocalId}
				onChange={e => setSelectedTypeLocalId(e.target.value as number)}
			>
				{props.eventTypes?.map((option, index) => (
					<MenuItem
						key={index}
						value={option.localId}
						onClick={e => props.onClickOption(index)}
					>
						{option.title}
					</MenuItem>
				))}
			</Select>
		</div>
	)
}

export default SelectEventType
