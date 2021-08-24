import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'

const SelectColorTheme: React.FC<{
	settings?: UserSettingsEntity
}> = ({ settings }) => {
	const language = useLanguage()

	const [selectedColorTheme, setSelectedColorTheme] = useState(
		UserSettingsService.getColorThemeCode(settings),
	)

	const colorThemeList = UserSettingsService.getColorThemeOptions(language.data)

	const handleChange = (newColorTheme: number) => {
		setSelectedColorTheme(newColorTheme)

		if (settings && settings.colorTheme !== newColorTheme) {
			settings.colorTheme = newColorTheme
			UserSettingsService.save(settings)
		}
	}

	return (
		<>
			<InputLabel shrink id='color_theme__select_label'>
				{language.data.COLOR_THEME_SELECTION_TITLE}
			</InputLabel>
			<Select
				labelId='color_theme__select_label'
				value={selectedColorTheme}
				onChange={e => handleChange(e.target.value as number)}
				fullWidth
			>
				{colorThemeList.map((option, index) => (
					<MenuItem key={index} value={option.code}>
						{option.name}
					</MenuItem>
				))}
			</Select>
		</>
	)
}

export default SelectColorTheme
