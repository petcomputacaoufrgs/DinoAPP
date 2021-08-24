import React from 'react'
import WarningDialogProps from './props'
import { useLanguage } from '../../../../context/language/index'
import '../styles.css'
import './styles.css'

const WarningDialog: React.FC<WarningDialogProps> = ({
	open,
    icon: Icon,
	children,
}) => {
	const language = useLanguage()

	return (
		<>
		{open && 
		<div className="kids_space_dialog warning_dialog">
            <div className="kids_space_dialog__circle">
                <Icon />
            </div>
  			<div className='kids_space_dialog__content'>
    			{children}
  			</div>
		</div>}
		</>
	)
}

export default WarningDialog