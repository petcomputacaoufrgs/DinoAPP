import React, { useEffect, useState } from 'react'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { useLanguage } from '../../../../context/language'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import StringUtils from '../../../../utils/StringUtils'
import Constants from '../../../../constants/app_data/DataConstants'
import { DinoTextfield } from '../../../../components/textfield'

interface TreatmentFormProps {
	open: boolean
	onClose: () => void
	treatment?: TreatmentEntity
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({
	open,
	onClose,
	treatment,
}) => {
	const [item, setItem] = useState(treatment || { name: '' })
	const [error, setError] = useState<string>()
	const langData = useLanguage().data

	useEffect(() => {
		if (!open) return setItem({ name: '' })
	}, [open])

	const handleSave = async () => {
		async function isValueValid() {
			if (!StringUtils.isEmpty(item.name)) {
				const alreadyExists = await TreatmentService.getByName(item.name)

				if (alreadyExists === undefined) {
					return true
				}
				setError(langData.itemAlreadyExists(langData.TREATMENT))
				return false
			}
			setError(langData.EMPTY_FIELD_ERROR)
			return false
		}

		if (await isValueValid()) {
			TreatmentService.save(item)
			handleClose()
		}
	}

	const handleClose = () => {
		onClose()
		setError(undefined)
	}

	return (
		<DinoDialog open={open} onSave={handleSave} onClose={handleClose}>
			<div className='treatment__dialog_form__content__textfield'>
				<DinoTextfield
					label={langData.STAFF_ADD_TREATMENT_NAME}
					value={item.name}
					onChange={e => setItem({ ...item, name: e.target.value })}
					dataProps={Constants.TREATMENT}
					errorMessage={error}
				/>
			</div>
		</DinoDialog>
	)
}

export default TreatmentForm
