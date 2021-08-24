import React from 'react'
import { MoreVert } from '@material-ui/icons'
import OptionsIconButtonProps from './props'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DinoIconButton from '..'
import { useLanguage } from '../../../../context/language'
import './styles.css'

const OptionsIconButton: React.FC<OptionsIconButtonProps> = ({
	onClick,
	lum,
	bigger,
}) => {
	const language = useLanguage()

	return (
			<DinoIconButton
				className='icon_button__options'
				icon={MoreVertIcon}
				ariaLabel={language.data.OPTIONS}
				onClick={onClick}
				lum={lum}
				bigger={bigger}
			>
				<MoreVert />
			</DinoIconButton>  
	)
}

export default OptionsIconButton
