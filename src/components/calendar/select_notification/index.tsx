import React, { useState } from 'react'
import { MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import {ReactComponent as AlertSVG} from '../../../assets/icons/general_use/add_alert.svg'
import './styles.css'

const SelectNotification: React.FC = () => {
    const language = useLanguage()
    const [selectedNotification, setSelectedNotification] = useState<string>()

    const notificationList = ['Um dia antes', 'Uma hora antes', '30 minutos antes', '15 minutos antes']

    return (
        <div className='notification__selector dino__flex_row'>
            <div className='notification_svg__selector'>
                <AlertSVG/>
            </div>
            <Select
                displayEmpty={true}
                renderValue={() => selectedNotification? selectedNotification : language.data.EVENT_ADD_ALERT}
                onChange={e => setSelectedNotification(e.target.value as string)}
                fullWidth
            >
                {notificationList.map((option, index) => (
                    <MenuItem key={index} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default SelectNotification