import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Divider } from '@material-ui/core'
import { useLanguage } from '../../../../../context/language'
import GlossaryItemEntity from '../../../../../types/glossary/database/GlossaryItemEntity'
import GlossaryService from '../../../../../services/glossary/GlossaryService'
import DinoLoader from '../../../../../components/loader'
import './styles.css'

const GlossaryItem: React.FC = () => {

	const { localId } = useParams<{localId: string}>()

	const language = useLanguage()

	const [isLoading, setIsLoading] = useState(true)
	const [glossaryItem, setGlossaryItem] = useState<
		GlossaryItemEntity | undefined
	>(undefined)

	useEffect(() => {
		let loadData = async () => {
			const item = await GlossaryService.getByLocalId(Number(localId))

			if (item) {
				updateData(item)
			}

			finishLoading()
		}

		let updateData = (item: GlossaryItemEntity) => {
			setGlossaryItem(item)
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
	}, [isLoading, localId])

	return (
		<DinoLoader className='glossary_item_loader' isLoading={isLoading} hideChildren>
			<div className='glossary_item dino__text__wrap'>
				<div className='card__header'>
					<div className='card__header__title'>
						{glossaryItem?.title || language.data.NO_AVAILABLE_TEXT}
					</div>
					<div className='card__typography muted'>
						{glossaryItem?.subtitle || ''}
					</div>
				</div>
				<Divider />
				<div className='card__content'>
					<div className='card__typography'>
						{glossaryItem?.fullText || language.data.NO_AVAILABLE_TEXT}
					</div>
				</div>
			</div>
		</DinoLoader>
	)
}

export default GlossaryItem
