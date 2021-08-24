import React from 'react'
import { ListItem, ListItemText, ListItemSecondaryAction, Badge } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import PathConstants from '../../../../../constants/app/PathConstants'
import { useLanguage } from '../../../../../context/language'
import { useTreatmentView } from '../../../../../context/staff_data'
import UserQuestionsIcon from '@material-ui/icons/ContactSupport';
import ArrayUtils from '../../../../../utils/ArrayUtils'
import TreatmentItemProps from './props'
import FaqIcon from '@material-ui/icons/Dns'; 
import DinoIconButton from '../../../../../components/button/icon_button'

const TreatmentItemList: React.FC<TreatmentItemProps> = ({ item, onClickMenu }) => {
  const language = useLanguage()  
  const history = useHistory()
  const treatmentView = useTreatmentView(item.localId)

  const redirectTo = (tab: string) => history.push(`${PathConstants.STAFF_FAQ}/${item.localId}/${tab}`)

  return (
    <div className='treatment__list_item'>
      <ListItem divider>
        <ListItemText
          className='treatment__list_item__text'
          primary={item.name}
        />
        <ListItemSecondaryAction className="treatment__list_item__action">
            <DinoIconButton
              icon={FaqIcon}
              ariaLabel={language.data.seeFAQItemsText(item.name)}
              onClick={() => redirectTo(PathConstants.FAQ_TAB)}
            />
            <Badge
              overlap="circle"
              color="secondary"
              invisible={ArrayUtils.isEmpty(treatmentView?.questions)}
              badgeContent={treatmentView?.questions?.length}
            >
              <DinoIconButton
                icon={UserQuestionsIcon}
                ariaLabel={language.data.USER_QUESTIONS}
                onClick={() => redirectTo(PathConstants.USER_QUESTIONS_TAB)}
              />
            </Badge>
            <OptionsIconButton onClick={(e) => onClickMenu(e, item)} />
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  )
}

export default TreatmentItemList