import { ArrowForward } from '@material-ui/icons'
import ArrowBack from '@material-ui/icons/ArrowBack'
import React, { useState } from 'react'
import { useLanguage } from '../../../context/language'
import DinoIconButton from '../../button/icon_button'
import './styles.css'

const MonthNavBar: React.FC = () => {
    const language = useLanguage()
    const monthList = [language.data.JANUARY, language.data.FEBRUARY, language.data.MARCH, language.data.APRIL, language.data.MAY, language.data.JUNE, language.data.JULY, language.data.AUGUST, language.data.SEPTEMBER, language.data.OCTOBER, language.data.NOVEMBER, language.data.DECEMBER]
    const year = '2021'

    const [cur, setCur] = useState<number>(0)
    const [month, setMonth] = useState<string>(monthList[cur])

    const clickPrevious = () => {
        if (cur === 0) {
            setCur(11)
            setMonth(monthList[11])
            return
        }

        else {
            let curMonth = cur - 1
            setCur(curMonth)
            setMonth(monthList[curMonth])
        }
    }

    const clickNext = () => {
        if (cur === 11) {
            setCur(0)
            setMonth(monthList[0])
        }


        else {
            let curMonth = cur + 1;
            setCur(curMonth)
            setMonth(monthList[curMonth])
        }
    }

    return (
        <div className='month_nav_bar_wrapper dino__flex_row'>
            <DinoIconButton icon={ArrowBack} onClick={clickPrevious}></DinoIconButton>
            <div className='month_and_year_wrapper'>
                <div className='month_and_year_text'>{month} {year}</div>
            </div>
            <DinoIconButton icon={ArrowForward} onClick={clickNext}></DinoIconButton>
        </div>
    )

}

export default MonthNavBar