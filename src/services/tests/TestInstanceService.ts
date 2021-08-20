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
import CalendarEventTypeEntity from '../../types/calendar/database/CalendarEventTypeEntity'
import CalendarEventTypeService from '../calendar/CalendarEventTypeService'
import CalendarEventEntity from '../../types/calendar/database/CalendarEventEntity'
import CalendarEventService from '../calendar/CalendarEventService'

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
			await this.loadCalendarEventTypes()
			await this.loadCalendarEvents()
			await this.loadContacts()
			await this.loadPhones()
			await this.loadNotes()
			await this.loadTreatmentQuestionInstances()
		}
	}

	private async loadTreatmentInstances() {
		const instances = [
			{ name: '[Test] Treatment Name 1' },
			{ name: '[Test] Treatment Name 2' },
			{ name: '[Test] Treatment Name 3' },
			{ name: 'Nutrição' },
		] as TreatmentEntity[]

		await TreatmentService.saveAll(instances)
	}

	private async loadFaqItemInstances() {
		const treatments = await TreatmentService.getAll()
		let instances: FaqItemEntity[] = []

		if (faqItemData) {
			instances = faqItemData.itemList as FaqItemEntity[]
			const nutrition = treatments.find(t => t.name === "Nutrição")
			if (nutrition) {
				instances.forEach(i => i.localTreatmentId = nutrition.localId)
			}
		} else {
			treatments.forEach(t => {
				instances = [
					{
						question: `[Test] FaqItem Question 1`,
						answer: `[Test] FaqItem Answer 1`,
						localTreatmentId: t.localId,
					},
					{
						question: `[Test] FaqItem Question 2`,
						answer: `[Test] FaqItem Answer 2`,
						localTreatmentId: t.localId,
					},
					{
						question: `[Test] FaqItem Question 3`,
						answer: `[Test] FaqItem Answer 3`,
						localTreatmentId: t.localId,
					},
				] as FaqItemEntity[]

			})
		}

		FaqItemService.saveAll(instances)
	}

	private async loadTreatmentQuestionInstances() {
		const treatments = await TreatmentService.getAll()

		treatments.forEach(t => {
			const instances = [
				{
					question: `[Test] Treatment Question 1`,
					localTreatmentId: t.localId,
				},
				{
					question: `[Test] Treatment Question 2`,
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
			this.contactInstances.map(c => {
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
					title: '[Test] Glossary Title 1',
					text: '[Test] Glossary Text 1',
					subtitle: '[Test] Subtitle 1',
					fullText: '[Test] Glossary fullText 1',
				},
				{
					title: '[Test] Glossary Title 2',
					text: '[Test] Glossary Text 2',
					subtitle: '[Test] Subtitle 2',
					fullText: '[Test] Glossary fullText 2',
				},
			] as GlossaryItemEntity[]
		}

		await GlossaryService.saveAll(instances)
	}
	private async loadCalendarEventTypes() {
		const instances = [
			{ icon: 'clock', title: 'Evento', color: '#afd153', userId: 1 },
			{
				icon: 'clipboard',
				title: 'Lembrete',
				color: '#ab1e53',
			},
			{
				icon: 'pill',
				title: 'Personalizadooooo',
				color: '#ab5e13',
				userId: 1,
			},
		] as CalendarEventTypeEntity[]

		await CalendarEventTypeService.saveAll(instances)
	}
	private async loadCalendarEvents() {
		const types = await CalendarEventTypeService.getAll()

		const getRandomTypeLocalId = () => {
			if (types) {
				const random = ArrayUtils.randomItem(types)
				if (random) return random.localId
			}
			return undefined
		}

		const instances = [
			{
				title: 'Lembrete Top',
				time: '10:00 - 11:00',
				date: '01',
				typeLocalId: getRandomTypeLocalId(),
			},
			{
				title: 'Eventão',
				time: '9:00 - 22:00',
				date: '02',
				typeLocalId: getRandomTypeLocalId(),
			},
			{
				title: 'Eventão 2',
				time: '14:00 - 18:00',
				date: '04',
				typeLocalId: getRandomTypeLocalId(),
			},
		] as CalendarEventEntity[]

		await CalendarEventService.saveAll(instances)
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
			name: 'A [Test] Contact 1',
			description: '[Test] Contact Description 1',
			color: ColorConstants.COLORS[0],
		},
		{
			name: 'B [Test] Contact 2',
			description: '[Test] Contact Description 2',
			color: ColorConstants.COLORS[1],
		},
		{
			name: 'C [Test] Contact 3',
			description: '[Test] Contact Description 3',
			color: ColorConstants.COLORS[2],
		},
		{
			name: 'D [Test] Contact 4',
			description: '[Test] Contact Description 4',
			color: ColorConstants.COLORS[3],
		},
		{
			name: 'A [Test] Contact 5',
			description: '[Test] Contact Description 5',
			color: ColorConstants.COLORS[4],
		},
		{
			name: 'B [Test] Contact 6',
			description: '[Test] Contact Description 6',
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
