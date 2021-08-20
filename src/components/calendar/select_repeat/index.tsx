import React, { useState } from 'react'
import { MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import {ReactComponent as RepeatSVG} from '../../../assets/icons/general_use/repeat.svg'
import './styles.css'

const SelectRepeat: React.FC = () => {
    const language = useLanguage()
    const [selectedRepeat, setSelectedRepeat] = useState<string>()

    const repeatList = [language.data.EVENT_REPEAT_NOT_REPEAT, language.data.EVENT_REPEAT_EVERY_DAY, language.data.EVENT_REPEAT_EVERY_WEEK, language.data.EVENT_REPEAT_EVERY_MONTH, language.data.EVENT_REPEAT_EVERY_YEAR]

    return (
        <div className='repeat__selector dino__flex_row'>
            <div className='repeat_svg__selector'>
                <RepeatSVG/>
            </div>
            <Select
                displayEmpty={true}
                renderValue={() => selectedRepeat? selectedRepeat : language.data.EVENT_REPEAT_ICON_ALT}
                onChange={e => setSelectedRepeat(e.target.value as string)}
                fullWidth
            >
                {repeatList.map((option, index) => (
                    <MenuItem key={index} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default SelectRepeat