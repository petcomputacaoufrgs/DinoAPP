import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import './styles.css'

interface SelectTimeProps{
    timeLabel: string
}

const SelectTime: React.FC<SelectTimeProps> = (props) => {
    const [Hour, setHour] = useState<string>()
    const [Minute, setMinute] = useState<string>()

    const hourList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    const minuteList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '41', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

    return (
        <div className='time__selector'>
            <div>
                <InputLabel shrink>
                    {props.timeLabel}
                </InputLabel>
                <div className='drop_down__flex_row'>
                    <div>
                        <Select
                            displayEmpty={true}
                            renderValue={() => Hour ? Hour : 'HH'}
                            onChange={e => setHour(e.target.value as string)}
                        >
                            {hourList.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Select
                            displayEmpty={true}
                            renderValue={() => Minute ? Minute : 'MM'}
                            onChange={e => setMinute(e.target.value as string)}
                        >
                            {minuteList.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectTime