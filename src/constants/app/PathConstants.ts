class PathConstants {
	LOGIN: string = `/`

	USER: string = `/user`

	STAFF: string = `/staff`

	KIDS_SPACE = '/kids_space'

	ABOUT_US = '/about_us'

	TERMS_OF_USE = '/terms_of_use'

	PRIVACY_POLICY = '/privacy_policy'

	FAQ_TAB = '0'

	USER_QUESTIONS_TAB = '1'

	HOME: string = `home`

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

	TREATMENT: string = `${this.STAFF}/treatment`

	GAME_MENU = `${this.KIDS_SPACE}/game_menu`

	SNAKE_GAME = `${this.GAME_MENU}/snake_game`

	MEMORY_GAME = `${this.GAME_MENU}/memory_game`

	MUSICAL_DINO_GAME = `${this.GAME_MENU}/musical_dino_game`

	DINO_RUNNER_GAME = `${this.GAME_MENU}/dino_runner`

	TIC_TAC_DINO_GAME = `${this.GAME_MENU}/tic_tac_dino`

	DINO_SLIDER_GAME = `${this.GAME_MENU}/dino_slider`

	USER_REPORT_BUG: string = `${this.USER}/report`

	STAFF_REPORT_BUG: string = `${this.STAFF}/report`
}

export default new PathConstants()
