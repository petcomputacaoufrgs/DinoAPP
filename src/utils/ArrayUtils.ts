import StringUtils from './StringUtils'

type filter<T> = (value: T) => boolean

class ArrayUtils {
	isNotEmpty = <T>(list?: T[]) => !this.isEmpty(list)

	isEmpty = <T>(list?: T[]) => list === undefined || list.length === 0

	suffle = <T>(list: T[]) => {
		list.sort(() => Math.random() - 0.5)
	}

	sortAlphabetical = <T>(array: Array<T>, attr: string): Array<T> => {
		return array.sort((a, b) =>
			StringUtils.normalize(a[attr]) < StringUtils.normalize(b[attr]) ? -1 : 1,
		)
	}

	removeRepeatedValues = <T>(list: T[]): T[] => {
		const uniqueList = new Set(list)

		return Array.from(uniqueList)
	}

	remove = <T>(list: T[], element: T): T[] => {
		return list.filter(e => e !== element)
	}

	apply = <T>(lists: T[]): T[] => {
		return ([] as T[]).concat.apply([], lists)
	}

	merge = <T>(lists: T[][]): T[] => {
		const newList: T[] = []
		return newList.concat(...lists)
	}

	randomItem = <T>(list: T[]): T => {
		return list[Math.floor(Math.random() * list.length)]
	}

	equal = <T>(list1: T[], list2: T[]): boolean =>
		list1.length === list2.length &&
		list1.every((value, index) => {
			return list2[index] === value
		})

	notEqual = <T>(list1: T[], list2: T[]): boolean => !this.equal(list1, list2)

	equalIgnoreOrder = <T>(list1: T[], list2: T[]): boolean =>
		list1.length === list2.length && list1.every(value => list2.includes(value))

	notEqualIgnoreOrder = <T>(list1: T[], list2: T[]): boolean =>
		!this.equalIgnoreOrder(list1, list2)

	partition = <T>(
		list: T[],
		selector: filter<T>,
	): { selected: T[]; notSelected: T[] } => {
		return list.reduce(
			(acc, value) => {
				const listName = selector(value) ? 'selected' : 'notSelected'
				acc[listName].push(value)
				return acc
			},
			{ selected: Array<T>(), notSelected: Array<T>() },
		)
	}
}

export default new ArrayUtils()
