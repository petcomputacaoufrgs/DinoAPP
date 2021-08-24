import React from 'react'
import Card from 'react-bootstrap/Card'
import PathConstants from '../../../../../constants/app/PathConstants'
import { Link } from 'react-router-dom'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import GlossaryItemEntity from '../../../../../types/glossary/database/GlossaryItemEntity'
import Accordion from 'react-bootstrap/Accordion'
import { useLanguage } from '../../../../../context/language'
import { HasStaffPowers } from '../../../../../context/private_router'
import './styles.css'

interface GlossaryListItemProps {
  item: GlossaryItemEntity,
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: GlossaryItemEntity) => void
}
  
  const GlossaryListItem: React.FC<GlossaryListItemProps> = ({ item, onClickMenu }) => {

    const language = useLanguage()	
    const isStaff = HasStaffPowers()
		const eventKey = String(item.localId)

		return (
			<Card className='glossary__card'>
				<Accordion.Toggle as={Card.Header} eventKey={eventKey}>
					<Card.Title className='glossary__card_title dino__flex_row dino__text__wrap'>
						{item.title}
						{isStaff && <OptionsIconButton onClick={(e) => onClickMenu(e, item)} />}
					</Card.Title>
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={eventKey}>
					<Card.Body>
						<Card.Subtitle className='glossary__card__subtitle mb-2'>{item.subtitle}</Card.Subtitle>
						<Card.Text className='glossary__card__text'>
							{item.text || language.data.NO_AVAILABLE_TEXT}
						</Card.Text>
						<Link
							className='dino__history_link'
							to={`${isStaff ? PathConstants.STAFF_GLOSSARY : PathConstants.USER_GLOSSARY}/${item.localId}`}
						>
							{language.data.READ_MORE}
						</Link>
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		)
	}

  export default GlossaryListItem