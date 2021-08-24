import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import { useLanguage } from '../../../../context/language'
import GlossaryItemProps from './props'
import { HasStaffPowers } from '../../../../context/private_router'
import GlossaryItemEntity from '../../../../types/glossary/database/GlossaryItemEntity'
import AgreementDialog from '../../../../components/dialogs/agreement_dialog'
import GlossaryItemForm from '../glossary_item_form'
import GlossaryService from '../../../../services/glossary/GlossaryService'
import GlossaryListItem from './glossary_list_item'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import ListTitle from '../../../../components/list_components/list_title'
import CRUD from '../../../../types/enum/CRUDEnum'
import NoItemsList from '../../../../components/list_components/no_items_list'
import ArrayUtils from '../../../../utils/ArrayUtils'

const GlossaryItems = ({ items }: GlossaryItemProps): JSX.Element => {
	const language = useLanguage()
	const isStaff = HasStaffPowers()

	const [toAction, setToAction] = useState(CRUD.NOP)
	const [selectedItem, setSelectedItem] = useState<GlossaryItemEntity>()
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, item: GlossaryItemEntity) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

	const handleDelete = () => {
		if(toAction === CRUD.DELETE && selectedItem) {
			GlossaryService.delete(selectedItem)
			setToAction(CRUD.NOP)
			setSelectedItem(undefined)
		}
	}

	return (
		<div className='glossary__items dino__list dino__list__padding'>
			<ListTitle title={language.data.GLOSSARY}/>
			{ArrayUtils.isNotEmpty(items) ? 
				<Accordion className='dino__accordion'>
					{items.map((item, index) => 
						<GlossaryListItem 
							item={item} 
							key={index}
							onClickMenu={handleClickMenu} 
						/>
					)}
				</Accordion>
			: <NoItemsList/>}
			{ isStaff && (
				<>
					<GlossaryItemForm
						open={toAction === CRUD.UPDATE}
						handleClose={() => setToAction(CRUD.NOP)}
						item={selectedItem}
					/>
					<AgreementDialog
						open={toAction === CRUD.DELETE}
						question={language.data.deleteItemText(language.data.GLOSSARY_ITEM)}
						onAgree={handleDelete}
						onDisagree={() => setToAction(CRUD.NOP)}
					/>
					<ItemListMenu
						anchor={anchorEl}
						setAnchor={setAnchorEl}
						onEdit={() => setToAction(CRUD.UPDATE)}
						onDelete={() => setToAction(CRUD.DELETE)}
					/>
				</>
			)}
		</div>
	)
}

export default GlossaryItems
