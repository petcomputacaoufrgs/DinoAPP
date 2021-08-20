import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import UserSettingsDataModel from '../../types/user/api/UserSettingsDataModel'
import UserSettingsEntity from '../../types/user/database/UserSettingsEntity'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import TreatmentService from '../treatment/TreatmentService'
import LanguageBase from '../../constants/languages/LanguageBase'
import ColorThemeEnum from '../../types/enum/ColorThemeEnum'
import PT from '../../constants/languages/PT'
import EN from '../../constants/languages/EN'
import FontSizeEnum from '../../types/enum/FontSizeEnum'
import OptionType from '../../types/OptionType'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import GoogleScopeService from '../auth/google/GoogleScopeService'
import LanguageEnum from '../../types/enum/LanguageEnum'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import { LanguageContextType } from '../../context/language'
class UserSettingsServiceImpl extends AutoSynchronizableService<
	number,
	UserSettingsDataModel,
	UserSettingsEntity
> {
	constructor() {
		super(
			Database.userSettings,
			APIHTTPPathsConstants.USER_SETTINGS,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.USER_SETTINGS,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [GoogleScopeService, TreatmentService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return []
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: UserSettingsDataModel,
	): Promise<UserSettingsEntity | undefined> {
		const entity: UserSettingsEntity = {
			colorTheme: model.colorTheme,
			declineGoogleContacts: model.declineGoogleContacts,
			declineGoogleCalendar: model.declineGoogleCalendar,
			fontSize: model.fontSize,
			includeEssentialContact: model.includeEssentialContact,
			language: model.language || this.getDefaultLanguageCode(),
			firstSettingsDone: model.firstSettingsDone,
			googleCalendarId: model.googleCalendarId,
		}

		if (model.treatmentId) {
			const treatment = await TreatmentService.getById(model.treatmentId)

			if (treatment) {
				entity.treatmentLocalId = treatment.localId
			}
		}

		return entity
	}

	async convertEntityToModel(
		entity: UserSettingsEntity,
	): Promise<UserSettingsDataModel | undefined> {
		const model: UserSettingsDataModel = {
			colorTheme: entity.colorTheme,
			declineGoogleContacts: entity.declineGoogleContacts,
			declineGoogleCalendar: entity.declineGoogleCalendar,
			fontSize: entity.fontSize,
			includeEssentialContact: entity.includeEssentialContact,
			language: entity.language,
			firstSettingsDone: entity.firstSettingsDone,
			googleCalendarId: entity.googleCalendarId,
		}

		if (entity.treatmentLocalId) {
			const treatment = await TreatmentService.getByLocalId(
				entity.treatmentLocalId,
			)
			if (treatment && treatment.id !== undefined) {
				model.treatmentId = treatment.id
			}
		}

		return model
	}

	getColorThemeOptions(language: LanguageBase): OptionType[] {
		return [
			{
				code: ColorThemeEnum.DEVICE,
				name: language.DEVICE_DEFAULT_THEME_NAME,
			},
			{
				code: ColorThemeEnum.DEFAULT_LIGHT,
				name: language.LIGHT_THEME_NAME,
			},
			{
				code: ColorThemeEnum.DEFAULT_DARK,
				name: language.DARK_THEME_NAME,
			},
			{
				code: ColorThemeEnum.COTTON_CANDY,
				name: language.COTTON_CANDY_THEME_NAME,
			},
			{
				code: ColorThemeEnum.EGGPLANT,
				name: language.EGGPLANT_THEME_NAME,
			},
		]
	}

	getFontSizeOptions(language: LanguageBase): OptionType[] {
		return [
			{
				code: FontSizeEnum.DEFAULT,
				name: language.DEFAULT_FONT_SIZE_NAME,
			},
			{
				code: FontSizeEnum.LARGE,
				name: language.LARGE_FONT_SIZE_NAME,
			},
			{
				code: FontSizeEnum.LARGER,
				name: language.LARGER_FONT_SIZE_NAME,
			},
		]
	}

	getLanguagesOptions(language: LanguageBase): OptionType[] {
		return [
			{
				code: LanguageEnum.PORTUGUESE,
				name: language.LANGUAGE_PORTUGUESE,
			},
			{
				code: LanguageEnum.ENGLISH,
				name: language.LANGUAGE_ENGLISH,
			},
		]
	}

	setHTMLLanguage(language: LanguageBase) {
		const html = document.getElementById('html')

		if (html) {
			html.lang = language.ISO_LANGUAGE_CODE
		}
	}

	getEssentialContactGrant(
		userSettings: UserSettingsEntity | undefined,
	): boolean {
		if (userSettings) {
			return userSettings.includeEssentialContact
		}
		return this.getDefaultEssentialContactGrant()
	}

	getCalendar(userSettings: UserSettingsEntity | undefined): boolean {
		if (userSettings) {
			return userSettings.includeEssentialContact
		}
		return this.getDefaultEssentialContactGrant()
	}

	getDefaultEssentialContactGrant = () => true

	getFirstSettingsDone = async (): Promise<boolean | undefined> => {
		const userSettings = await this.getFirst()

		if (userSettings) {
			return userSettings.firstSettingsDone
		} else {
			return false
		}
	}

	getLanguage = (userSettings?: UserSettingsEntity): LanguageBase => {
		if (userSettings && userSettings.language === LanguageEnum.ENGLISH) {
			return new EN()
		} else {
			return new PT()
		}
	}

	getDefaultLanguage = (): LanguageBase => {
		if (navigator && navigator.language) {
			if (navigator.language.startsWith('pt')) {
				return new PT()
			}
		}
		return new EN()
	}

	getDefaultLanguageCode = (): number => {
		return this.getDefaultLanguage().LANGUAGE_CODE
	}

	getColorThemeCode = (
		userSettings: UserSettingsEntity | undefined,
	): number => {
		return userSettings
			? userSettings.colorTheme
			: this.getDefaultColorThemeCode()
	}

	getDefaultColorThemeCode = () => {
		return ColorThemeEnum.DEVICE
	}

	getColorThemeName = (userSettings: UserSettingsEntity): string => {
		if (userSettings) {
			switch (userSettings.colorTheme) {
				case 1:
					return 'light'
				case 2:
					return 'dark'
				case 3:
					return 'cotton_candy_light'
				case 4:
					return 'eggplant_dark'
				case 5:
					return this.getSystemColorThemeName()
				default:
					return this.getSystemColorThemeName()
			}
		}

		return this.getSystemColorThemeName()
	}

	getFontSize = (userSettings: UserSettingsEntity): string => {
		if (userSettings) {
			switch (userSettings.fontSize) {
				case 1:
					return 'default'
				case 2:
					return 'large'
				case 3:
					return 'larger'
				default:
					return 'default'
			}
		}
		return 'default'
	}

	getFontSizeCode = (userSettings: UserSettingsEntity | undefined): number => {
		return userSettings ? userSettings.fontSize : this.getDefaultFontSizeCode()
	}

	getDefaultFontSizeCode = (): number => {
		return FontSizeEnum.DEFAULT
	}

	getSystemColorThemeName = (): string => {
		const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
		if (matchDarkMode && matchDarkMode.matches) {
			return 'dark'
		}

		return 'light'
	}

	getTreatment = (
		treatments: TreatmentEntity[],
		userSettings?: UserSettingsEntity,
	) => {
		if (userSettings) {
			const treatment = treatments.find(
				treatment => treatment.localId === userSettings.treatmentLocalId,
			)
			if (treatment) return treatment
		}

		return undefined
	}

	getDefaultSettings = (language: LanguageContextType) => {
		return {
			language: language.data.LANGUAGE_CODE,
			fontSize: this.getDefaultFontSizeCode(),
			colorTheme: this.getDefaultColorThemeCode(),
			includeEssentialContact: true,
			declineGoogleContacts: true,
			declineGoogleCalendar: true,
			firstSettingsDone: false,
		} as UserSettingsEntity
	}
}

export default new UserSettingsServiceImpl()
