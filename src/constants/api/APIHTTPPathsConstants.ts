class APIHTTPPathsConstants {
	ROOT = process.env.REACT_APP_API_URL

	ROUTE_PUBLIC = 'public/'
	ROUTE_PRIVATE = 'private/'
	ROUTE_USER = 'user/'
	ROUTE_STAFF = 'staff/'

	/* private ------------------------------------------------------------------------ */

	GLOSSARY = `${this.ROOT}${this.ROUTE_PRIVATE}glossary/`
	FAQ_ITEM = `${this.ROOT}${this.ROUTE_PRIVATE}faq_item/`
	GOOGLE_SCOPE = `${this.ROOT}${this.ROUTE_PRIVATE}auth/google/scope/`
	ESSENTIAL_CONTACT = `${this.ROOT}${this.ROUTE_PRIVATE}essential_contact/`
	ESSENTIAL_PHONE = `${this.ROOT}${this.ROUTE_PRIVATE}essential_phone/`
	TREATMENT = `${this.ROOT}${this.ROUTE_PRIVATE}treatment/`
	TREATMENT_QUESTION = `${this.ROOT}${this.ROUTE_PRIVATE}treatment_question/`
	REPORT = `${this.ROOT}${this.ROUTE_PRIVATE}report/`
	USER = `${this.ROOT}${this.ROUTE_PRIVATE}user/`
	USER_SETTINGS = `${this.ROOT}${this.ROUTE_PRIVATE}settings/`
	private LOG_APP_ERROR = `${this.ROOT}${this.ROUTE_PRIVATE}log_app_error/`
	SAVE_LOG_APP_ERROR = `${this.LOG_APP_ERROR}`
	SAVE_ALL_LOG_APP_ERROR = `${this.LOG_APP_ERROR}all/`
	private PRIVATE_AUTH = `${this.ROOT}${this.ROUTE_PRIVATE}auth/`
	GRANT_GOOGLE = `${this.PRIVATE_AUTH}google/grant/`
	REFRESH_AUTH_GOOGLE = `${this.PRIVATE_AUTH}google/refresh/`
	WEB_SOCKET_AUTH = `${this.PRIVATE_AUTH}web_socket/`
	DELETE_ACCOUNT = `${this.PRIVATE_AUTH}delete_account/`
	CALENDAR_EVENT = `${this.ROOT}${this.ROUTE_PRIVATE}calendar_event/`
	CALENDAR_EVENT_TYPE = `${this.ROOT}${this.ROUTE_PRIVATE}calendar_event_type/`
	//LOGOUT = `${this.PRIVATE_AUTH}logout/`

	/* user ------------------------------------------------------------------------ */

	NOTE_COLUMN = `${this.ROOT}${this.ROUTE_USER}note_column/`
	CONTACT = `${this.ROOT}${this.ROUTE_USER}contact/`
	PHONE = `${this.ROOT}${this.ROUTE_USER}phone/`
	NOTE = `${this.ROOT}${this.ROUTE_USER}note/`

	/* staff ------------------------------------------------------------------------ */

	STAFF = `${this.ROOT}${this.ROUTE_STAFF}staff_management/`

	/* no route ------------------------------------------------------------------------ */

	KIDS_SPACE_SETTINGS = `${this.ROOT}kids_space_settings/`
	private APP_SETTINGS = `${this.ROOT}user_app_settings/`

	/* public ------------------------------------------------------------------------ */

	// APP_SETTINGS_VERSION = `${this.APP_SETTINGS}version/`
	// APP_SETTINGS_GET = `${this.APP_SETTINGS}`
	// APP_SETTINGS_SAVE = `${this.APP_SETTINGS}`
	// CONTACT_GOOGLE_DECLINE = `${this.CONTACT}google/decline_contacts/`
	TEST_CONNECTION = `${this.ROOT}${this.ROUTE_PUBLIC}test_connection/`
	private PUBLIC_AUTH = `${this.ROOT}${this.ROUTE_PUBLIC}auth/`
	AUTH_GOOGLE = `${this.PUBLIC_AUTH}google/`
	REFRESH_AUTH = `${this.PUBLIC_AUTH}refresh/`
}

export default new APIHTTPPathsConstants()
