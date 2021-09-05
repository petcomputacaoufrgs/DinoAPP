import Dexie from 'dexie'
import NoteEntity from '../types/note/database/NoteEntity'
import NoteColumnEntity from '../types/note/database/NoteColumnEntity'
import LogAppErrorEntity from '../types/log_app_error/database/LogAppErrorEntity'
import GlossaryItemEntity from '../types/glossary/database/GlossaryItemEntity'
import UserEntity from '../types/user/database/UserEntity'
import ContactEntity from '../types/contact/database/ContactEntity'
import EssentialContactEntity from '../types/contact/database/EssentialContactEntity'
import PhoneEntity from '../types/contact/database/PhoneEntity'
import FaqItemEntity from '../types/faq/database/FaqItemEntity'
import TreatmentQuestionEntity from '../types/faq/database/TreatmentQuestionEntity'
import TreatmentEntity from '../types/treatment/database/TreatmentEntity'
import UserSettingsEntity from '../types/user/database/UserSettingsEntity'
import GoogleScopeEntity from '../types/auth/google/database/GoogleScopeEntity'
import AuthEntity from '../types/auth/database/AuthEntity'
import TabEntity from '../types/tab_control/TabEntity'
import { KidsSpaceSettingsEntity } from '../types/kids_space/database/KidsSpaceSettingsEntity'
import StaffEntity from '../types/staff/database/StaffEntity'
import EssentialPhoneEntity from '../types/contact/database/EssentialPhoneEntity'
import ReportEntity from '../types/report/database/ReportEntity'
import EventEntity from '../types/calendar/database/EventEntity'
import EventTypeEntity from '../types/calendar/database/EventTypeEntity'

const DATABASE_NAME = 'DinoDatabase'
const DATABASE_VERSION = 18

class Database extends Dexie {
	auth: Dexie.Table<AuthEntity, number>
	userSettings: Dexie.Table<UserSettingsEntity, number>
	note: Dexie.Table<NoteEntity, number>
	noteColumn: Dexie.Table<NoteColumnEntity, number>
	logAppError: Dexie.Table<LogAppErrorEntity, number>
	glossary: Dexie.Table<GlossaryItemEntity, number>
	contact: Dexie.Table<ContactEntity, number>
	essentialContact: Dexie.Table<EssentialContactEntity, number>
	phone: Dexie.Table<PhoneEntity, number>
	essentialPhone: Dexie.Table<EssentialPhoneEntity, number>
	user: Dexie.Table<UserEntity, number>
	faqItem: Dexie.Table<FaqItemEntity, number>
	treatmentQuestion: Dexie.Table<TreatmentQuestionEntity, number>
	treatment: Dexie.Table<TreatmentEntity, number>
	googleScope: Dexie.Table<GoogleScopeEntity, number>
	staff: Dexie.Table<StaffEntity, number>
	tab: Dexie.Table<TabEntity, number>
	kidsSpaceSettings: Dexie.Table<KidsSpaceSettingsEntity, number>
	report: Dexie.Table<ReportEntity, number>
	event: Dexie.Table<EventEntity, number>
	eventType: Dexie.Table<EventTypeEntity, number>

	constructor() {
		super(DATABASE_NAME)

		/**
		 * Add only attributes that you will use in where clause
		 **/
		this.version(DATABASE_VERSION).stores({
			userSettings: generateSynchronizableTableString(),
			glossary: generateSynchronizableTableString('title'),
			contact: generateSynchronizableTableString('localEssentialContactId'),
			essentialContact: generateSynchronizableTableString(
				'*treatmentLocalIds',
				'isUniversal',
			),
			phone: generateSynchronizableTableString('localContactId'),
			essentialPhone: generateSynchronizableTableString(
				'localEssentialContactId',
			),
			noteColumn: generateSynchronizableTableString(),
			note: generateSynchronizableTableString('columnId', 'localColumnId'),
			user: generateSynchronizableTableString(),
			staff: generateSynchronizableTableString('email'),
			faqItem: generateSynchronizableTableString(
				'localTreatmentId',
				'isUniversal',
			),
			treatmentQuestion: generateSynchronizableTableString('localTreatmentId'),
			treatment: generateSynchronizableTableString('name'),
			googleScope: generateSynchronizableTableString('name'),
			kidsSpaceSettings: generateSynchronizableTableString(),
			report: generateSynchronizableTableString(),
			event: generateSynchronizableTableString(),
			eventType: generateSynchronizableTableString(),
			auth: '++id',
			logAppError: '++id,title,file,error,date',
			tab: '++id,isMain',
		})

		this.auth = this.table('auth')
		this.userSettings = this.table('userSettings')
		this.user = this.table('user')
		this.staff = this.table('staff')
		this.glossary = this.table('glossary')
		this.contact = this.table('contact')
		this.essentialContact = this.table('essentialContact')
		this.phone = this.table('phone')
		this.essentialPhone = this.table('essentialPhone')
		this.note = this.table('note')
		this.noteColumn = this.table('noteColumn')
		this.faqItem = this.table('faqItem')
		this.treatmentQuestion = this.table('treatmentQuestion')
		this.logAppError = this.table('logAppError')
		this.treatment = this.table('treatment')
		this.googleScope = this.table('googleScope')
		this.tab = this.table('tab')
		this.kidsSpaceSettings = this.table('kidsSpaceSettings')
		this.report = this.table('report')
		this.event = this.table('event')
		this.eventType = this.table('eventType')
	}
}

/**
 * Return param index concatenated with synchronizable basic indexes
 * @param attributes attributes to index
 */
const generateSynchronizableTableString = (...attributes: string[]): string => {
	const basic = '++localId,localState,id'
	if (attributes && attributes.length > 0) {
		return basic + ',' + attributes.join(',')
	}

	return basic
}

export default new Database()
