import React, { useEffect, useState } from 'react'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import GlossaryService from '../../../../services/glossary/GlossaryService'
import GlossaryItemEntity from '../../../../types/glossary/database/GlossaryItemEntity'
import './styles.css'

interface GlossaryItemFormProps {
	open: boolean
	item?: GlossaryItemEntity
	handleClose: () => void
}

const getItem = (item: GlossaryItemEntity | undefined) => {
	return item || getEmptyItem()
}

const getEmptyItem = () => {
	return {
		title: '',
		subtitle: '',
		text: '',
		fullText: '',
	} as GlossaryItemEntity
}

const GlossaryItemForm: React.FC<GlossaryItemFormProps> = props => {
	const language = useLanguage()
	const [item, setItem] = useState<GlossaryItemEntity>(getItem(props.item))
	const [error, setError] = useState<string>()

	useEffect(() => {
		if (props.open) {
			setItem(getItem(props.item))
		}
	}, [props.open, props.item])

	const handleSave = async () => {
		const isInvalid = await GlossaryService.isTitleInvalid(item, language.data)

		setError(isInvalid)

		if (!isInvalid) {
			GlossaryService.save(item)
			props.handleClose()
		}
	}

	return (
		<DinoDialog
			open={props.open}
			onSave={handleSave}
			onClose={props.handleClose}
		>
			<div className='glossary_item__form_content'>
				<DinoTextfield
					dataProps={DataConstants.GLOSSARY_TITLE}
					value={item.title}
					onChange={e => setItem({ ...item, title: e.target.value })}
					label={`${language.data.TITLE}`}
					errorMessage={error}
				/>
				<br />
				<DinoTextfield
					dataProps={DataConstants.GLOSSARY_SUBTITLE}
					value={item.subtitle}
					onChange={e => setItem({ ...item, subtitle: e.target.value })}
					label={`${language.data.SUBTITLE}`}
				/>
				<br />
				<DinoTextfield
					multiline
					rows={3}
					dataProps={DataConstants.GLOSSARY_TEXT}
					value={item.text}
					onChange={e => setItem({ ...item, text: e.target.value })}
					label={`${language.data.TEXT}`}
				/>
				<br />
				<DinoTextfield
					multiline
					rows={5}
					dataProps={DataConstants.GLOSSARY_FULLTEXT}
					value={item.fullText}
					onChange={e => setItem({ ...item, fullText: e.target.value })}
					label={`${language.data.FULL_TEXT}`}
				/>
				<br />
			</div>
		</DinoDialog>
	)
}

export default GlossaryItemForm
