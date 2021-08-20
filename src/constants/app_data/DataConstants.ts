export interface DataConstantProps {
	readonly MAX: number
	readonly REQUIRED: boolean
}

class DataConstants {
	static FALSE = 0 as const
	static TRUE = 1 as const

	// *-------------* NOTE *-------------*

	static NOTE_COLUMN_NAME = { MAX: 50, REQUIRED: true } as const
	static NOTE_QUESTION = { MAX: 250, REQUIRED: true } as const
	static NOTE_ANSWER = { MAX: 500, REQUIRED: false } as const
	static NOTE_TAG = { MAX: 50, REQUIRED: false } as const

	// *-------------* CONTACT *-------------*

	static CONTACT_NAME = { MAX: 100, REQUIRED: true } as const
	static CONTACT_DESCRIPTION = { MAX: 500, REQUIRED: false } as const
	static CONTACT_PHONE_NUMBER = { MAX: 30, REQUIRED: false } as const

	static CONTACT_PHONE_CODE_PUBLIC_SERVICE = 1 as const
	static CONTACT_PHONE_CODE_RESIDENTIAL = 2 as const
	static CONTACT_PHONE_CODE_MOBILE = 8 as const

	// *-------------* TREATMENT *-------------*

	static TREATMENT = { MAX: 100, REQUIRED: true } as const

	// *-------------* FAQ *-------------*

	static FAQ_QUESTION = { MAX: 100, REQUIRED: true } as const
	static FAQ_ANSWER = { MAX: 1000, REQUIRED: true } as const

	// *-------------* GLOSSARY *-------------*

	static GLOSSARY_TITLE = { MAX: 50, REQUIRED: true } as const
	static GLOSSARY_SUBTITLE = { MAX: 20, REQUIRED: false } as const
	static GLOSSARY_TEXT = { MAX: 1000, REQUIRED: false } as const
	static GLOSSARY_FULLTEXT = { MAX: 10000, REQUIRED: false } as const

	// *-------------* STAFF *-------------*

	static STAFF_EMAIL = { MAX: 100, REQUIRED: true } as const

	// *-------------* USER *-------------*

	static USER_PASSWORD = { MAX: 24, MIN: 8, REQUIRED: true } as const

	// *-------------* REPORT *-------------*

	static REPORT_WHAT = { MAX: 1000, REQUIRED: true } as const
	static REPORT_WHERE = { MAX: 100, REQUIRED: false } as const
	static REPORT_HOW = { MAX: 1000, REQUIRED: false } as const

	// *-------------* CALENDAR *-------------*

	static CALENDAR_EVENT_TITLE = { MAX: 100, REQUIRED: true } as const
	static CALENDAR_EVENT_DESCRIPTION = { MAX: 1000, REQUIRED: false } as const
}

export default DataConstants
