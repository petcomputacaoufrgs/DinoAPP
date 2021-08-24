import React from 'react'
import { ReactComponent as DinoAuthSVG } from '../../../assets/icons/dino/dino_auth.svg'
import { Dialog, DialogContent, DialogActions } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import TextButton from '../../button/text_button'
import TransitionSlide from '../../slide_transition'
import DinoDialogProps from './props'
import '../styles.css'

const DinoDialog: React.FC<DinoDialogProps> = ({
	open,
	className,
	onClose,
	onSave,
	header,
	actions,
	children,
	labelSave,
	labelClose,
}) => {
	const language = useLanguage()

	const getClassName = () => {
		const native = 'dino_dialog dino__text__wrap'
		if (className) {
			return `${className} ${native}`
		}
		return native
	}

	return (
		<Dialog
			className={getClassName()}
			open={open}
			onClose={onClose}
			TransitionComponent={TransitionSlide}
			fullWidth
			disableBackdropClick
			disableEscapeKeyDown
		>
			{header}
			<DialogContent dividers>{children}</DialogContent>

			<div className='dino_dialog__actions'>
				{actions || (
					<DialogActions>
						<TextButton onClick={onClose}>
							{labelClose || language.data.CANCEL}
						</TextButton>
						<TextButton onClick={onSave}>
							{labelSave || language.data.SAVE}
						</TextButton>
					</DialogActions>
				)}
			</div>
		</Dialog>
	)
}

export default DinoDialog

export const DinoDialogHeader: React.FC = ({ children }) => {
	return (
		<div className='dino_dialog__header'>
			<div className='dino_dialog__header__title'>{children}</div>
			<DinoAuthSVG />
		</div>
	)
}

export const DinoDialogContent: React.FC = ({ children }) => {
	return <div className='dino_dialog__content'>{children}</div>
}
