class APIWebSocketPathsConstants {
	ROOT = `${process.env.REACT_APP_API_URL}private/websocket/`
	LOGOUT_REQUEST = 'logout_request'
	GLOSSARY = 'glossary'
	FAQ_ITEM = 'faq_item'
	TREATMENT = 'treatment'
	TREATMENT_QUESTION = 'treatment_question'
	REPORT = 'report'
	CONTACT = 'contact'
	ESSENTIAL_CONTACT = 'essential_contact'
	PHONE = 'phone'
	ESSENTIAL_PHONE = 'essential_phone'
	NOTE = 'note'
	NOTE_COLUMN = 'note_column'
	USER = 'user'
	USER_SETTINGS = 'settings'
	GOOGLE_SCOPE = 'google_scope'
	STAFF = 'staff_management'
	KIDS_SPACE_SETTINGS = 'kids_space_settings'
	CALENDAR_EVENT = 'calendar_event'
	CALENDAR_EVENT_TYPE = 'calendar_event_type'
}

export default new APIWebSocketPathsConstants()
