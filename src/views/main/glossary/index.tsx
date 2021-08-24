import React, { useState, useEffect } from 'react'
import GlossaryItems from './glossary_list_items'
import DinoSearchBar from '../../../components/search_bar'
import GlossaryItemEntity from '../../../types/glossary/database/GlossaryItemEntity'
import DinoLoader from '../../../components/loader'
import { useLanguage } from '../../../context/language'
import GlossaryService from '../../../services/glossary/GlossaryService'
import { HasStaffPowers } from '../../../context/private_router'
import AddButton from '../../../components/button/icon_button/add_button'
import GlossaryItemForm from './glossary_item_form'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

const Glossary: React.FC = () => {

	const isStaff = HasStaffPowers()
	const language = useLanguage()

	const [glossary, setGlossary] = useState<GlossaryItemEntity[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [add, setAdd] = useState(false)
	
	useEffect(() => {
		const loadData = async () => {
			const glossary = await GlossaryService.getAll()
			updateData(glossary)
			finishLoading()
		}

		let updateData = (glossary: GlossaryItemEntity[]) => {
			setGlossary(glossary)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		GlossaryService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateData = () => {}
			finishLoading = () => {}
			GlossaryService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleChange = (event: any) => setSearchTerm(event.target.value)

	const filteredGlossary = GlossaryService.filterGlossary(glossary, searchTerm)

	return (
		<div className='glossary'>
			<DinoSearchBar
				value={searchTerm}
				onChange={handleChange}
			/>
			<DinoLoader className='glossary_loader' isLoading={isLoading}>
				<GlossaryItems items={filteredGlossary} />
			</DinoLoader>
			{ isStaff && 
				<AddButton
					handleAdd={() => setAdd(true)}
					label={language.data.NEW_GLOSSARY_ITEM}
				/>
			}
			<GlossaryItemForm 
				open={add}
				handleClose={() => setAdd(false)}
			/>
		</div>
	)
}

export default Glossary
