import { LanguageContextType } from '../../../context/language'
import {
	isEssential,
	isUniversalEssential,
} from '../../../services/contact/ContactViewService'
import { ContactType } from '../../../types/contact/view/ContactView'
import TreatmentView from '../../../types/faq/view/TreatmentView'
import FilterType from '../../../types/filter/Filter'
import ArrayUtils from '../../../utils/ArrayUtils'
import BaseLocalStorage from '../BaseLocalStorage'
import FilterEnum from './FilterEnum'

class FilterService extends BaseLocalStorage {
	clear = () => Object.values(FilterEnum).forEach(f => this.remove(f))

	getFilter = (filter: string, defaultValue?: boolean): boolean => {
		const value = this.get(filter)

		return value ? JSON.parse(value) : defaultValue || false
	}

	setFilter = (filter: string, value: boolean) => {
		this.set(filter, JSON.stringify(value))
	}

	getContactFilters = (
		hasStaffPowers: boolean,
		language: LanguageContextType,
	) => {
		const userFilter: FilterType[] = [
			{
				id: FilterEnum.ESSENTIAL_CONTACTS,
				checked: this.getFilter(FilterEnum.ESSENTIAL_CONTACTS, true),
				label: language.data.ESSENTIAL_CONTACTS,
				validator: (c: ContactType) => isEssential(c),
			},
			{
				id: FilterEnum.YOUR_CONTACTS,
				checked: this.getFilter(FilterEnum.YOUR_CONTACTS, true),
				label: language.data.YOUR_CONTACTS,
				validator: (c: ContactType) => !isEssential(c),
			},
		]

		const staffFilter: FilterType[] = [
			{
				id: FilterEnum.UNIVERSAL_ESSENTIAL_CONTACTS,
				checked: this.getFilter(FilterEnum.UNIVERSAL_ESSENTIAL_CONTACTS, true),
				label: language.data.UNIVERSAL_ESSENTIAL_CONTACTS,
				validator: (c: ContactType) => isUniversalEssential(c),
			},
			{
				id: FilterEnum.TREATMENT_ESSENTIAL_CONTACTS,
				checked: this.getFilter(FilterEnum.TREATMENT_ESSENTIAL_CONTACTS, true),
				label: language.data.TREATMENT_ESSENTIAL_CONTACTS,
				validator: (c: ContactType) => !isUniversalEssential(c),
			},
		]

		return hasStaffPowers ? staffFilter : userFilter
	}

	getTreatmentFilters = (language: LanguageContextType) => {
		return [
			{
				id: FilterEnum.HAS_USER_QUESTIONS,
				checked: this.getFilter(FilterEnum.HAS_USER_QUESTIONS),
				label: language.data.HAS_USER_QUESTIONS_FILTER_LABEL,
				validator: (t?: TreatmentView) => ArrayUtils.isNotEmpty(t?.questions),
			},
		] as FilterType[]
	}
}

export default new FilterService()
