import React, { useEffect, useRef } from 'react'
import ButtonProps from './props'
import './styles.css'

const Button: React.FC<ButtonProps> = ({
	className,
	onClick,
	children,
	disabled,
	inputRef,
	ariaLabel,
	outline,
	style,
}) => {
	const buttonRef = useRef<HTMLButtonElement>(null)
	const getClassName = (): string => {
		let mainClass = 'button'

		if (className) {
			mainClass = mainClass.concat(' ' + className)
		}

		if (outline) {
			mainClass = mainClass.concat(' button__outline')
		}

		if (disabled) {
			mainClass = mainClass.concat(' disabled')
		}

		return mainClass
	}

	useEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.addEventListener('keyup', event => {
				if (event.keyCode === 13) {
					event.preventDefault()
					if (buttonRef.current) {
						buttonRef.current.click()
						buttonRef.current.focus()
					}
				}
			})
		}
	}, [inputRef])

	return (
		<button
			className={getClassName()}
			disabled={disabled}
			onClick={onClick}
			ref={buttonRef}
			aria-label={ariaLabel}
			style={style}
		>
			{children}
		</button>
	)
}

export default Button
