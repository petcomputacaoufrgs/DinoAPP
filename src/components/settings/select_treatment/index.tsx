import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import SelectTreatmentProps from './props'
import { useLanguage } from '../../../context/language'
import './styles.css'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'

/**
 * @see já salva
 */
const SelectTreatment: React.FC<SelectTreatmentProps> = ({
	children,
	availableTreatments,
	settings,
}) => {
	const language = useLanguage()
	const [open, setOpen] = useState(false)
	const [inputValue, setInputValue] = useState('')

	const [selectedTreatment, setSelectedTreatment] = useState<
		TreatmentEntity | undefined
	>(UserSettingsService.getTreatment(availableTreatments, settings))

	const renderChildren = () =>
		children && <div className='select_treatment__children'>{children}</div>

	const handleChange = (newSelectedTreatment: TreatmentEntity) => {
		setSelectedTreatment(newSelectedTreatment)
		UserSettingsService.saveSettingsTreatment(newSelectedTreatment, settings)
	}

	return (
		<>
			<Autocomplete
				className='select_treatment__autocomplete'
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				getOptionSelected={(option, value) => option === value}
				getOptionLabel={treatment => treatment || ''}
				options={availableTreatments.map(treatment => treatment.name)}
				noOptionsText={language.data.NO_TREATMENTS_AVAILABLE}
				inputValue={inputValue}
				onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
				value={selectedTreatment ? selectedTreatment.name : null}
				onChange={(event: any, newValue: string | null) => {
					if (newValue) {
						const entity = availableTreatments.find(
							treatment => treatment.name === newValue,
						)
						if (entity) handleChange(entity)
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						label={language.data.CHOOSE_TREATMENT}
						variant='standard'
						InputProps={{
							...params.InputProps,
							endAdornment: <>{params.InputProps.endAdornment}</>,
						}}
					/>
				)}
			/>
			{renderChildren()}
		</>
	)
}

export default SelectTreatment
