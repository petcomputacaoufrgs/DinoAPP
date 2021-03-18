import DinoAgentService from "../../agent/DinoAgentService"
import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import AuthService from "./AuthService"
import LogAppErrorService from "../log_app_error/LogAppErrorService"
import AESUtils from "../../utils/AESUtils"
import HashUtils from "../../utils/HashUtils"
import AgentRequest from "../../types/agent/AgentRequest"
import SetResponsibleAuthModel from "../../types/auth/api/responsible/SetResponsibleAuthModel"
import VerifyResponsibleRecoverCodeModel from "../../types/auth/api/responsible/VerifyResponsibleRecoverCodeModel"
import ResponsibleRecoverPasswordModel from "../../types/auth/api/responsible/ResponsibleRecoverPasswordModel"
import SetResponsibleAuthResponseModel from "../../types/auth/api/responsible/SetResponsibleAuthResponseModel"
import ResponsibleRequestRecoverResponseModel from "../../types/auth/api/responsible/ResponsibleRequestRecoverResponseModel"
import ResponsibleVerityRecoverCodeResponseModel from "../../types/auth/api/responsible/ResponsibleVerityRecoverCodeResponseModel"
import UserService from "../user/UserService"

class ResponsibleAuthService {
	isAuthenticated = async () => {
		const user = await AuthService.getUser()

		return Boolean(user && user.responsibleCode)
	}

	requestCode = async () => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_REQUEST)

		if (request.canGo) {
			try {
				const authRequest = await request.authenticate()
				const response = await authRequest.go()
				const responseBody: ResponsibleRequestRecoverResponseModel = response.body
				return responseBody.success
			} catch (e) {
				LogAppErrorService.logError(e)
			}
			return false
		}
	}

  verifyCode = async (code: string): Promise<ResponsibleVerityRecoverCodeResponseModel | null> => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_VERIFY)

		if (request.canGo) {
			try {
        const body: VerifyResponsibleRecoverCodeModel = {
          code: code
        }
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(body).go()

				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return null
	}

  recoverAuth = async (code: string, newPassword: string): Promise<boolean> => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_CHANGE)

		return this.setAuth(request, newPassword, code)
	}

	changeAuth = async (newPassword: string) => {
		const request = await DinoAgentService.post(APIRequestMappingConstants.CHANGE_RESPONSIBLE_AUTH)

		return this.setAuth(request, newPassword)
	}

	createAuth = async (password: string): Promise<boolean> => {
		const request = await DinoAgentService.post(APIRequestMappingConstants.CREATE_RESPONSIBLE_AUTH)

		return this.setAuth(request, password)
	}

	verifyPassword = async (password: string) => {
		const user = await AuthService.getUser()

		if (user && user.responsibleIV && user.responsibleToken) {
			const key = HashUtils.sha3of256(password)

			const code = await AESUtils.decrypt(key, user.responsibleIV, user.responsibleToken)

			return Boolean(code)
		}

		return false
	}

	responsibleLogin = async (password: string) => {
		const user = await AuthService.getUser()

		if (user && user.responsibleIV && user.responsibleToken) {
			const key = HashUtils.sha3of256(password)

			const code = await AESUtils.decrypt(key, user.responsibleIV, user.responsibleToken)

			if (code) {
				user.responsibleCode = code

				await UserService.saveOnlyLocally(user)

				return true
			}
		}

		return false
	}

	responsibleLogout = async () => {
		const user = await AuthService.getUser()

		if (user) {
			user.responsibleCode = undefined
			await UserService.saveOnlyLocally(user)
		}
	}

	private setAuth = async (request: AgentRequest, password: string, code?: string): Promise<boolean> => {
		if (request.canGo) {
			try {
				const key = HashUtils.sha3of256(password).substr(0, 32)
        const requestBody: ResponsibleRecoverPasswordModel | SetResponsibleAuthModel = code ? {
          key: key,
					code: code
        } : { key: key }
				
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(requestBody).go()
				const responseBody: SetResponsibleAuthResponseModel = response.body
				if (responseBody.success) {
					const user = await AuthService.getUser()
					if (user) {
						const code = await AESUtils.decrypt(key, responseBody.iv, responseBody.token)
						if (code) {
							user.responsibleCode = code
							user.responsibleToken = responseBody.token
							user.responsibleIV = responseBody.iv
							await UserService.saveOnlyLocally(user)
							return true
						}
					}
				}
				return false
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}
		return false
	}
}

export default new ResponsibleAuthService()