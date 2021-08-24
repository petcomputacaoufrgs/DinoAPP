import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import './styles.css'

const SelectFontSize: React.FC<{
	settings?: UserSettingsEntity
}> = ({ settings }) => {
	const language = useLanguage()
	const fontSizeList = UserSettingsService.getFontSizeOptions(language.data)

	const [selectedFontSize, setSelectedFontSize] = useState(
		UserSettingsService.getFontSizeCode(settings),
	)

	const handleChange = (newFontSize: number) => {
		setSelectedFontSize(newFontSize)

		if (settings && settings.fontSize !== newFontSize) {
			settings.fontSize = newFontSize
			UserSettingsService.save(settings)
		}
	}

	return (
		<div className='font_size__selector'>
			<InputLabel shrink id='font_size__select_label'>
				{language.data.FONT_SIZE_SELECTION_TITLE}
			</InputLabel>
			<Select
				labelId='font_size__select_label'
				value={selectedFontSize}
				onChange={e => handleChange(e.target.value as number)}
				fullWidth
			>
				{fontSizeList.map((option, index) => (
					<MenuItem key={index} value={option.code}>
						{option.name}
					</MenuItem>
				))}
			</Select>
		</div>
	)
}

export default SelectFontSize
