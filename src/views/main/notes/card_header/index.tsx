import React from 'react'
import CreateIcon from '@material-ui/icons/Create'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import './styles.css'
import CardHeader from '@material-ui/core/CardHeader'

export const NoteCardHeader: React.FC<{
	title: string
	subheader: string
	onClickOptions?: (event: React.MouseEvent<HTMLButtonElement>) => void
}> = props => {
	return (
		<div className='note__card__header'>
			<CardHeader
				avatar={<CreateIcon />}
				action={
					props.onClickOptions && (
						<div className='dino__flex_row'>
							<OptionsIconButton onClick={props.onClickOptions} />
						</div>
					)
				}
				title={props.title}
				subheader={props.subheader}
			/>
		</div>
	)
}
