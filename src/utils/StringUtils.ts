import { hasNoValue } from './Utils'

class StringUtils {
	isEmpty(value: string | undefined): boolean {
		return hasNoValue(value) || value?.trim() === ''
	}

	isNotEmpty = (value: string | undefined) => !this.isEmpty(value)

	upperCaseFirstLetter = (str: string): string =>
		`${str.charAt(0).toUpperCase()}${str.slice(1)}`

	normalize = (str: string): string => {
		if (str) {
			return str
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.toLowerCase()
		}
		return str
	}

	removeWhiteSpace = (str: string): string => str.replace(' ', '')

	/**
	 * @param s1 String um
	 * @param s2 String dois
	 * @returns True para s1 normalizada igual a s2 normalizada
	 */
	areEqual = (s1: string, s2: string): boolean =>
		this.normalize(s1) === this.normalize(s2)

	/**
	 * @param s1 String um
	 * @param s2 String dois
	 * @returns True para s1 normalizada diferente de s2 normalizada
	 */
	areNotEqual = (s1: string, s2: string): boolean => !this.areEqual(s1, s2)

	/**
	 * @param s1 String maior
	 * @param s2 String possivelmente incluida na maior
	 * @returns True para s2 contida em s1
	 */
	contains = (s1: string, s2: string): boolean => {
		return this.normalize(s1).includes(this.normalize(s2))
	}

	/**
	 *
	 * @param n Número a ser convertido
	 * @param length Número de zeros a esquerda
	 */
	toStringWithZeros = (n: number, length: number): string => {
		const stringNumber = n.toString()

		return stringNumber.padStart(length, '0')
	}

	replaceDigits = (str: string, replacer: string): string => {
		return str.replace(/[0-9]/g, replacer)
	}

	replaceNonDigits = (str: string, replacer: string): string => {
		return str.replace(/[^0-9]/g, replacer)
	}

	concatUndefinedSafe = (
		separator: string,
		s1: string,
		s2?: string,
	): string => {
		if (s2) {
			return s1.concat(separator).concat(s2)
		}

		return s1
	}

	validateEmail = (email: string) => {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return re.test(String(email).toLowerCase())
	}
}

export default new StringUtils()
