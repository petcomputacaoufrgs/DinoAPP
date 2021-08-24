import React from 'react'
import { Dialog } from '@material-ui/core'
import ContactCardProps from './props'
import ContactCardHeader from './header'
import ContactCardContent from './content'
import TransitionSlide from '../../../../components/slide_transition'

const ContactCard = ({
	item,
	dialogOpen,
	onClose,
	onClickMenu,
}: ContactCardProps) => {
	return item ? (
		<Dialog
			style={{ padding: 0 }}
			fullWidth
			TransitionComponent={TransitionSlide}
			open={dialogOpen}
			onBackdropClick={onClose}
		>
			<ContactCardHeader item={item} onClick={onClickMenu}></ContactCardHeader>
			<ContactCardContent item={item} />
		</Dialog>
	) : (
		<></>
	)
}

export default ContactCard
