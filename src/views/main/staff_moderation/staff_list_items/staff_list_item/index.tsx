import { Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import React from 'react'
import AvatarIcon from '@material-ui/icons/Person';
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../../context/language'
import StaffEntity from '../../../../../types/staff/database/StaffEntity'
import './styles.css'

interface StaffItemProps {
  item: StaffEntity, 
  onClick: (item: StaffEntity) => void,
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement>, item: StaffEntity) => void
}

const StaffItem: React.FC<StaffItemProps> = ({ item, onClickMenu, onClick }) => {

  const language = useLanguage()

  const invitationIsPending = item.userId === undefined
  
  return (
    <ListItem button onClick={() => onClick(item)}>
      <ListItemAvatar>
        <Avatar><AvatarIcon /></Avatar>
      </ListItemAvatar>
      <ListItemText 
        primary={item.email} 
        secondary={
          <Typography className='dino__flex_row staff_item' component={'span'} variant={'body2'}>
            {item.sentInvitationDate.toDateString()}
            {invitationIsPending && (<p className='invitation_pending'>{language.data.PENDING}</p>)}
          </Typography>
        }>
      </ListItemText>
      <ListItemSecondaryAction>
        <OptionsIconButton onClick={(e) => onClickMenu(e, item)} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default StaffItem