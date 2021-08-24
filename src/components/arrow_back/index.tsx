import React from 'react'
import DinoIconButton from '../../components/button/icon_button'
import HistoryService from '../../services/history/HistoryService'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useLanguage } from '../../context/language'
import { ReactComponent as GoBackKidsSVG } from '../../assets/kids_space/go_back_arrow.svg'
import PathConstants from '../../constants/app/PathConstants'
import './styles.css'

interface ArrowBackProps {	
	lum?: "dark" | "light", 
	kids?: boolean,
	onClick?: () => void
}

const ArrowBack: React.FC<ArrowBackProps> = ({ kids, onClick, lum })=> {
	const language = useLanguage()

	const handleClick = () => {
		if(onClick !== undefined) {
			return onClick()
		}
		return kids ? HistoryService.push(PathConstants.GAME_MENU) : HistoryService.goBack()
	}

	return (
		<div className={'arrow_back' + (kids ? "__kids" : "")}>
			<DinoIconButton
				ariaLabel={language.data.ARROW_BACK_ARIA_LABEL}
				icon={kids ? GoBackKidsSVG : ArrowBackIcon}
				onClick={handleClick}
				lum={lum}
			/>
		</div>
	)
}

export default ArrowBack
