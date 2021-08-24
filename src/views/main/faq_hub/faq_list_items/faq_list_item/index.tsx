import React from 'react'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import FaqItemEntity from '../../../../../types/faq/database/FaqItemEntity'
import { HasStaffPowers } from '../../../../../context/private_router'

interface FaqItemProps { 
  item: FaqItemEntity, 
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement>, item: FaqItemEntity) => void
}

const FaqItem: React.FC<FaqItemProps> = ({ item, onClickMenu }) => {
  	
	const isStaff = HasStaffPowers()

  const eventKey = String(item.localId)

  return (
    <Card className='faq__card'>
      <Accordion.Toggle as={Card.Header} eventKey={eventKey}>
        <Card.Title className='faq__card_title dino__flex_row dino__text__wrap'>
          {item.question}
          {isStaff && <OptionsIconButton onClick={(e) => onClickMenu(e, item)} />}
        </Card.Title>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          <Card.Text>{item.answer}</Card.Text>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}

export default FaqItem