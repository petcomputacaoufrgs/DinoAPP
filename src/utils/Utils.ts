	export const hasNoValue = (value: any | undefined): boolean => {
		return value === null || value === undefined
	}

	export const hasValue = (value: any | undefined): boolean => {
		return !hasNoValue(value)
	}
