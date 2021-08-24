import React, { useEffect, useState } from 'react'
import DinoLoader from '../../../components/loader'
import DinoSearchBar from '../../../components/search_bar'
import { useLanguage } from '../../../context/language'
import TreatmentService from '../../../services/treatment/TreatmentService'
import StringUtils from '../../../utils/StringUtils'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentItems from './treatment_list_items'
import AddButton from '../../../components/button/icon_button/add_button'
import TreatmentForm from './treatment_form'
import './styles.css'
import DinoFilterList from '../../../components/list_components/filter_list'
import ListTitle from '../../../components/list_components/list_title'
import { useStaffData } from '../../../context/staff_data'
import FilterService from '../../../storage/local_storage/filter/FilterService'

const Treatment: React.FC<{ ref: React.Ref<unknown> }> = () => {
	const language = useLanguage()
	const staffData = useStaffData()
	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<Array<TreatmentEntity>>([])
	const [toAdd, setToAdd] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [filters, setFilters] = useState(
		FilterService.getTreatmentFilters(language),
	)

	const filteredTreatments = treatments.filter(
		t =>
			StringUtils.contains(t.name, searchTerm) &&
			!filters.some(f => f.checked && !f.validator(staffData.get(t.localId!))),
	)

	const handleChangeChecked = (index: number) => {
		const filter = filters[index]
		filter.checked = !filter.checked
		setFilters([...filters])
	}

	useEffect(() => {
		const loadData = async () => {
			updateTreatments(await TreatmentService.getAll())
			finishLoading()
		}

		TreatmentService.addUpdateEventListenner(loadData)

		let updateTreatments = (data: TreatmentEntity[]) => {
			console.log(data)
			setTreatments(data)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			updateTreatments = () => {}
			finishLoading = () => {}
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
		setSearchTerm(event.target.value)
	}

	const handleClose = () => {
		setToAdd(false)
	}

	return (
		<div className='treatments'>
			<DinoLoader className='treatments__loader' isLoading={isLoading}>
				<DinoSearchBar value={searchTerm} onChange={handleChange} />
				<div className='dino__flex_row dino__list_and_filter'>
					<ListTitle title={language.data.TREATMENTS_AND_FAQS} />
					<DinoFilterList
						filters={filters}
						onChangeChecked={handleChangeChecked}
					/>
				</div>
				<TreatmentItems items={filteredTreatments} />
				<AddButton
					handleAdd={() => setToAdd(true)}
					label={language.data.ADD_TREATMENT}
				/>
			</DinoLoader>
			<TreatmentForm open={toAdd} onClose={handleClose} />
		</div>
	)
}

export default Treatment
