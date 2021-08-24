import React from 'react'
import TextField, {
	OutlinedTextFieldProps,
	StandardTextFieldProps,
} from '@material-ui/core/TextField'
import StringUtils from '../../utils/StringUtils'
import { DinoTexfieldProps } from './props'

export const DinoTextfield: React.FC<
	DinoTexfieldProps & (StandardTextFieldProps | OutlinedTextFieldProps)
> = props => {
	const { dataProps, errorMessage, ...muiProps } = props

	const getClassName = () => {
		const nativeClassName = 'dino__textfield'

		if (StringUtils.isNotEmpty(muiProps.className)) {
			return `${muiProps.className} ${nativeClassName}`
		}

		return nativeClassName
	}

	const getHelperText = () => {
		const formatMaxLength = () => {
			if (dataProps)
				return `${((muiProps.value as string) || '').length}/${dataProps.MAX}`
		}

		return muiProps.helperText || errorMessage || formatMaxLength()
	}

	return (
		<TextField
			fullWidth
			margin='dense'
			type='text'
			inputProps={muiProps.inputProps || { maxLength: dataProps?.MAX }}
			required={dataProps?.REQUIRED}
			error={muiProps.error || errorMessage !== undefined}
			helperText={getHelperText()}
			{...muiProps}
			className={getClassName()}
		/>
	)
}
