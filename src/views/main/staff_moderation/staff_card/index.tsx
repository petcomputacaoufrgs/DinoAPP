import React, { forwardRef } from 'react'
import {
	Avatar,
	CardContent,
	CardHeader,
	Dialog,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import TransitionSlide from '../../../../components/slide_transition'
import AvatarIcon from '@material-ui/icons/Person'
import EmailIcon from '@material-ui/icons/Email'
import StaffEntity from '../../../../types/staff/database/StaffEntity'
import { useLanguage } from '../../../../context/language'

interface StaffCardProps {
	open: boolean
	item: StaffEntity
	onClose: () => void
	onClickMenu: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const StaffCard: React.FC<StaffCardProps> = forwardRef(
	({ open, onClose, item, onClickMenu }, ref: React.Ref<unknown>) => {
		const language = useLanguage()

		return (
			<Dialog
				ref={ref}
				open={open}
				fullWidth
				onClose={onClose}
				TransitionComponent={TransitionSlide}
			>
				<CardHeader
					avatar={
						<Avatar>
							<AvatarIcon />
						</Avatar>
					}
					action={<OptionsIconButton onClick={onClickMenu} />}
					title={language.data.MEMBER_OF_STAFF}
					subheader={item.sentInvitationDate.toDateString()}
				/>
				<CardContent>
					<ListItem divider>
						<ListItemIcon>
							<EmailIcon />
						</ListItemIcon>
						<ListItemText className='dino__text__wrap' primary={item.email} />
					</ListItem>
				</CardContent>
			</Dialog>
		)
	},
)

export default StaffCard
