/**
 * @description Configuração de valores das chaves utilizadas para salvar valores no local storage
 */
class LocalStorageKeys {
  GLOSSARY_VERSION = 'G_version'
  GLOSSARY_ITEMS = 'G_itemList'
  GLOSSARY_SHOULD_SYNC = 'G_shouldSync'
  CONTACTS = 'C_itemList'
  CONTACTS_LAST_ID = 'l_id'
  ADD_CONTACTS = 'CIDs_add'
  EDIT_CONTACTS = 'CIDs_edit'
  DELETE_CONTACTS = 'CIDs_del'
  USER_VERSION = 'uv'
  USER_SHOULD_SYNC = 'uss'
  EMAIL = 'e'
  PICTURE_URL = 'pu'
  SAVED_PICTURE = 'sp'
  NAME = 'n'
  GOOGLE_ACCESS_TOKEN = 'gat'
  GOOGLE_EXPIRES_DATE = 'ged'
  AUTH_TOKEN = 'at'
  TEMP_AUTH_TOKEN = 'tat'
  REFRESH_TOKEN_REQUIRED = 'rtr'
  LANGUAGE = 'lan'
  APP_SETTINGS_VERSION = 'asv'
  APP_SETTINGS = 'as'
  APP_SETTINGS_SHOULD_SYNC = 'asss'
  PAGE_TEMP = 'pt'
  NOTE_VERSION = 'nv'
  NOTE_SHOULD_SYNC = 'nss'
  UPDATING_NOTES = 'un'
  UPDATE_NOTES_WITH_ERROR = 'une'
  NOTES_TO_DELETE = 'ntd'
  CONNECTION = 'con'
  LOG_APP_ERROR_SYNC = 'laes'
}

export default new LocalStorageKeys()
