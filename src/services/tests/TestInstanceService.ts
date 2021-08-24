import ColorConstants from '../../constants/app/ColorConstants'
import DataConstants from '../../constants/app_data/DataConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import EssentialContactEntity from '../../types/contact/database/EssentialContactEntity'
import EssentialPhoneEntity from '../../types/contact/database/EssentialPhoneEntity'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import TreatmentQuestionEntity from '../../types/faq/database/TreatmentQuestionEntity'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import NoteEntity from '../../types/note/database/NoteEntity'
import ArrayUtils from '../../utils/ArrayUtils'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import AuthService from '../auth/AuthService'
import ContactService from '../contact/ContactService'
import EssentialContactService from '../contact/EssentialContactService'
import EssentialPhoneService from '../contact/EssentialPhoneService'
import PhoneService from '../contact/PhoneService'
import FaqItemService from '../faq/FaqItemService'
import GlossaryService from '../glossary/GlossaryService'
import NoteColumnService from '../note/NoteColumnService'
import NoteService from '../note/NoteService'
import TreatmentQuestionService from '../treatment/TreatmentQuestionService'
import TreatmentService from '../treatment/TreatmentService'
import glossaryData from './glossary.json'
import faqItemData from './faqItem.json'

class TestInstanceService {
	async loadInstances() {
		const isStaff = await AuthService.hasStaffPowers()

		if (isStaff) {
			await this.loadTreatmentInstances()
			await this.loadFaqItemInstances()
			await this.loadEssentialContacts()
			await this.loadEssentialPhones()
			await this.loadGlossary()
		} else {
			await this.loadContacts()
			await this.loadPhones()
			await this.loadNotes()
			await this.loadTreatmentQuestionInstances()
		}
	}

	private async loadTreatmentInstances() {
		const instances = [{ name: '[Treatment Name]' }] as TreatmentEntity[]

		await TreatmentService.saveAll(instances)
	}

	private async loadFaqItemInstances() {
		const treatments = await TreatmentService.getAll()
		let instances: FaqItemEntity[] = []

		if (faqItemData) {
			instances = faqItemData.itemList as FaqItemEntity[]
		}

		treatments.forEach(t => {
			instances.push({
				question: `[Question]`,
				answer: `[Answer]`,
				localTreatmentId: t.localId,
			} as FaqItemEntity)
		})

		FaqItemService.saveAll(instances)
	}

	private async loadTreatmentQuestionInstances() {
		const treatments = await TreatmentService.getAll()

		treatments.forEach(t => {
			const instances = [
				{
					question: `[Treatment Question]`,
					localTreatmentId: t.localId,
				},
			] as TreatmentQuestionEntity[]

			TreatmentQuestionService.saveAll(instances)
		})
	}

	private async loadEssentialContacts() {
		const getRandomTreatments = () => {
			if (ArrayUtils.isNotEmpty(treatments)) {
				const response = new Set<number>()
				const numberOfTreatments = Math.ceil(Math.random() * 3)
				for (let n = 0; n < numberOfTreatments; n++) {
					const randomTreatment = ArrayUtils.randomItem(treatments)
					if (randomTreatment.localId) response.add(randomTreatment.localId)
				}
				return Array.from(response)
			}
			return undefined
		}

		const instancesUniversal: EssentialContactEntity[] =
			this.universalContactInstances.map(c => {
				const ec = c as EssentialContactEntity
				ec.isUniversal = 1
				return ec
			})

		await EssentialContactService.saveAll(instancesUniversal)

		const treatments = await TreatmentService.getAll()

		const instancesNonUniversal: EssentialContactEntity[] =
			this.contactInstances.map(c => {
				const ec = c as EssentialContactEntity
				ec.isUniversal = 0
				ec.treatmentLocalIds = getRandomTreatments()
				return ec
			})

		await EssentialContactService.saveAll(instancesNonUniversal)
	}

	private async loadEssentialPhones() {
		const ecs = await EssentialContactService.getAll()

		const toSave: EssentialPhoneEntity[] = []

		ecs.forEach(ec => {
			toSave.push(
				...this.getRandomPhones().map((p: EssentialPhoneEntity) => {
					const newPhone = { ...p }
					newPhone.localEssentialContactId = ec.localId
					return newPhone
				}),
			)
		})

		EssentialPhoneService.saveAll(toSave)
	}

	private async loadGlossary() {
		let instances: GlossaryItemEntity[] = []

		if (glossaryData) {
			instances = glossaryData.itemList
		} else {
			instances = [
				{
					title: '[Glossary Title]',
					text: '[Glossary Text]',
					subtitle: '[Glossary Subtitle]',
					fullText: '[Glossary FullText]',
				},
			] as GlossaryItemEntity[]
		}

		await GlossaryService.saveAll(instances)
	}

	private async loadContacts() {
		await ContactService.saveAll(this.contactInstances)
	}

	private async loadPhones() {
		const contacts = await ContactService.getAll()

		const toSave = [] as PhoneEntity[]

		contacts.forEach(c => {
			toSave.push(
				...this.getRandomPhones().map((p: PhoneEntity) => {
					const newPhone = { ...p }
					newPhone.localContactId = c.localId
					return newPhone
				}),
			)
		})

		PhoneService.saveAll(toSave)
	}

	private async loadNotes() {
		const columnInstances = [
			{
				order: 0,
				title: '[Test] Column Title 1',
			},
			{
				order: 1,
				title: '[Test] Column Title 2',
			},
		] as NoteColumnEntity[]

		await NoteColumnService.saveAll(columnInstances)

		const columns = await NoteColumnService.getAll()

		columns.forEach(c => {
			const noteInstances = [
				{
					order: 0,
					question: '[Test] Note Question 1',
					answer: '[Test] Note Answer 1',
					tags: ['[Test] Note Tag 1'],
					columnLocalId: c.localId,
				},
				{
					order: 1,
					question: '[Test] Note Question 2',
					answer: '[Test] Note Answer 2',
					tags: ['[Test] Note Tag 2'],
					columnLocalId: c.localId,
				},
				{
					order: 2,
					question: '[Test] Note Question 3',
					answer: '[Test] Note Answer 3',
					tags: ['[Test] Note Tag 3'],
					columnLocalId: c.localId,
				},
			] as NoteEntity[]

			NoteService.saveAll(noteInstances)
		})
	}

	private contactInstances: (ContactEntity | EssentialContactEntity)[] = [
		{
			name: 'A Contact 1',
			description: 'Contact Description 1',
			color: ColorConstants.COLORS[0],
		},
		{
			name: 'B Contact 2',
			description: 'Contact Description 2',
			color: ColorConstants.COLORS[1],
		},
		{
			name: 'C Contact 3',
			description: 'Contact Description 3',
			color: ColorConstants.COLORS[2],
		},
	]

	private universalContactInstances: (
		| ContactEntity
		| EssentialContactEntity
	)[] = [
		{
			name: 'A Universal Contact 4',
			description: 'Contact Description 4',
			color: ColorConstants.COLORS[3],
		},
		{
			name: 'B Universal Contact 5',
			description: 'Contact Description 5',
			color: ColorConstants.COLORS[4],
		},
		{
			name: 'C Universal Contact 6',
			description: 'Contact Description 6',
			color: ColorConstants.COLORS[5],
		},
	]

	private getRandomPhones = () => {
		const response = new Set<PhoneEntity | EssentialPhoneEntity>()
		const numberOfPhones = Math.ceil(Math.random() * 3)
		for (let n = 0; n < numberOfPhones; n++) {
			const randomPhone = ArrayUtils.randomItem(this.phoneInstances)
			response.add(randomPhone)
		}
		return Array.from(response)
	}

	private phoneInstances: (PhoneEntity | EssentialPhoneEntity)[] = [
		{
			number: '999999999',
			type: DataConstants.CONTACT_PHONE_CODE_MOBILE,
		},
		{
			number: '182',
			type: DataConstants.CONTACT_PHONE_CODE_PUBLIC_SERVICE,
		},
		{
			number: '32323232',
			type: DataConstants.CONTACT_PHONE_CODE_RESIDENTIAL,
		},
	]
}

export default new TestInstanceService()
