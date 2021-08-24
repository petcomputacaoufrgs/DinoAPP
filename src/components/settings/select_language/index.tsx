import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'

const SelectLanguage: React.FC<{
	settings?: UserSettingsEntity
}> = ({ settings }) => {
	const language = useLanguage()
	const languageOptions = UserSettingsService.getLanguagesOptions(language.data)

	const [selectedLanguage, setSelectedLanguage] = useState(
		language.data.LANGUAGE_CODE,
	)

	const handleChange = (newLanguage: number) => {
		setSelectedLanguage(newLanguage)

		if (settings && settings.language !== newLanguage) {
			settings.language = newLanguage
			UserSettingsService.save(settings)
		}
	}

	return (
		<>
			<InputLabel shrink id='language_select_label'>
				{language.data.CHOOSE_LANGUAGE}
			</InputLabel>
			<Select
				labelId='language_select_label'
				value={selectedLanguage}
				onChange={e => handleChange(e.target.value as number)}
				fullWidth
			>
				{languageOptions.map((languageOption, index) => (
					<MenuItem key={index} value={languageOption.code}>
						{languageOption.name}
					</MenuItem>
				))}
			</Select>
		</>
	)
}

export default SelectLanguage
