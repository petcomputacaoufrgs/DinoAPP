class PathConstants {
	LOGIN: string = `/`

	USER: string = `/user`

	STAFF: string = `/staff`

	private HOME: string = `home`

	private GLOSSARY: string = `glossary`

	private CONTACTS: string = `contacts`

	private GAMES: string = `games`

	private SETTINGS: string = `settings`

	private FAQ: string = `faq`

	private NOTES: string = `notes`

	private CALENDAR = `calendar`

	USER_HOME: string = `${this.USER}/${this.HOME}`

	USER_GLOSSARY: string = `${this.USER}/${this.GLOSSARY}`

	USER_CONTACTS: string = `${this.USER}/${this.CONTACTS}`

	USER_GAMES: string = `${this.USER}/${this.GAMES}`

	USER_SETTINGS: string = `${this.USER}/${this.SETTINGS}`

	USER_FAQ: string = `${this.USER}/${this.FAQ}`

	USER_NOTES: string = `${this.USER}/${this.NOTES}`

	USER_CALENDAR = `${this.USER}/${this.CALENDAR}`


	STAFF_HOME: string = `${this.STAFF}/${this.HOME}`

	STAFF_GLOSSARY: string = `${this.STAFF}/${this.GLOSSARY}`
	
	STAFF_CONTACTS: string = `${this.STAFF}/${this.CONTACTS}`

	STAFF_SETTINGS: string = `${this.STAFF}/${this.SETTINGS}`

	STAFF_FAQ: string = `${this.STAFF}/${this.FAQ}`

	STAFF_MODERATION: string = `${this.STAFF}/moderation`
	
	ABOUT_US = '/about-us'

	TERMS_OF_USE = '/terms_of_use'

	PRIVACY_POLICY = '/privacy_policy'
}

export default new PathConstants()
