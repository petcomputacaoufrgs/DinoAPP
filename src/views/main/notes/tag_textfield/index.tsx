import Autocomplete from '@material-ui/lab/Autocomplete'
import React from 'react'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'

export const NoteTagTextfield: React.FC<{
	value?: string[]
	options: string[]
	onChange?: (event: React.ChangeEvent<{}>, value: string[]) => void
}> = props => {
	const language = useLanguage()
	return (
		<Autocomplete
			multiple
			freeSolo
			limitTags={1}
			{...props}
			renderInput={params => (
				<DinoTextfield
					{...params}
					label={`${language.data.NOTE_TAG_LABEL}`}
					inputProps={{
						...params.inputProps,
						maxLength: DataConstants.NOTE_TAG.MAX,
					}}
					dataProps={DataConstants.NOTE_TAG}
				/>
			)}
		/>
	)
}
