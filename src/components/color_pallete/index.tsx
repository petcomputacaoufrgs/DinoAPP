import React from 'react'
import Popover from '@material-ui/core/Popover'
import PaletteIcon from '@material-ui/icons/Palette'
import DinoIconButton from '../button/icon_button'
import { useLanguage } from '../../context/language'
import './styles.css'

export const ColorPalette: React.FC<{
	colors: string[]
	onClick: (color: string) => void
}> = ({ colors, onClick }) => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

	const handleClickChooseColor = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		setAnchorEl(event.currentTarget)
	}

	return (
		<div className='color_palette'>
			<ChooseColorIconButton onClick={handleClickChooseColor} />
			<Popover
				className='color_palette__popover'
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				{colors.map((c, index) => (
					<div
						key={index}
						tabIndex={index}
						className='color_palette__color_option'
						style={{ backgroundColor: c }}
						onClick={() => onClick(c)}
					/>
				))}
			</Popover>
		</div>
	)
}

export const ChooseColorIconButton: React.FC<{
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ onClick }) => {
	const language = useLanguage()

	return (
		<DinoIconButton
			ariaLabel={language.data.COLOR_THEME_SELECTION_ARIA_LABEL}
			icon={PaletteIcon}
			onClick={onClick}
		/>
	)
}
