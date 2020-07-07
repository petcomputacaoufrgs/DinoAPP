import BaseLocalStorage from '../../BaseLocalStorage'
import LS_Constants from '../../../constants/LocalStorageKeysConstants'

class AuthLocalStorage extends BaseLocalStorage {
  getAuthToken = (): string => {
    const authToken = this.get(LS_Constants.AUTH_TOKEN)

    return this.convertStringOrNullToString(authToken)
  }

  setAuthToken = (accessToken: string) => {
    this.set(LS_Constants.AUTH_TOKEN, accessToken)
  }

  removeAuthToken = () => {
    this.remove(LS_Constants.AUTH_TOKEN)
  }

  getLogoutToken = (): string => {
    const authToken = this.get(LS_Constants.LOGOUT_TOKEN)

    return this.convertStringOrNullToString(authToken)
  }

  setLogoutToken = (accessToken: string) => {
    this.set(LS_Constants.LOGOUT_TOKEN, accessToken)
  }

  removeLogoutToken = () => {
    this.remove(LS_Constants.LOGOUT_TOKEN)
  }

  getGoogleAccessToken = (): string | null =>
    this.get(LS_Constants.GOOGLE_ACCESS_TOKEN)

  setGoogleAccessToken = (googleAccessToken: string) => {
    this.set(LS_Constants.GOOGLE_ACCESS_TOKEN, googleAccessToken)
  }

  removeGoogleAccessToken = () => {
    this.remove(LS_Constants.GOOGLE_ACCESS_TOKEN)
  }

  isRefreshRequired = (): boolean =>
    Boolean(this.get(LS_Constants.REFRESH_TOKEN_REQUIRED))

  setRefreshRequiredToTrue = () => {
    this.set(LS_Constants.REFRESH_TOKEN_REQUIRED, 't')
  }

  setRefreshRequiredToFalse = () => {
    this.remove(LS_Constants.REFRESH_TOKEN_REQUIRED)
  }

  removeUserData = () => {
    this.removeAuthToken()
    this.removeGoogleAccessToken()
  }

  cleanLoginGarbage = () => {
    this.setRefreshRequiredToFalse()
  }
}

export default new AuthLocalStorage()
