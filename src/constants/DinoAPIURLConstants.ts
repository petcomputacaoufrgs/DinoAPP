/**
 * @description Valores de URL da API para conexão
 */
class DinoAPIURLConstants {
    private URL: string = 'http://localhost:5000/'
    private AUTH: string = this.URL + 'auth/'
    private GLOSSARY: string = this.URL + 'glossary/'
    private APP_SETTINGS: string = this.URL + 'user_app_settings/'
    private NOTE: string = this.URL + 'note/'

    AUTH_GOOGLE = this.AUTH + 'google/'

    GLOSSARY_LIST = this.GLOSSARY + 'get/'

    GLOSSARY_VERSION = this.GLOSSARY + 'version/'

    APP_SETTINGS_VERSION = this.APP_SETTINGS + 'version/'

    APP_SETTINGS_GET = this.APP_SETTINGS

    APP_SETTINGS_SAVE = this.APP_SETTINGS

    NOTE_GET_VERSION = this.NOTE + 'version/'

    NOTE_GET = this.NOTE

    NOTE_SAVE = this.NOTE
}

export default new DinoAPIURLConstants()