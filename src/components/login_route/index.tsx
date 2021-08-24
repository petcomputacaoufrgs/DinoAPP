import React, { useEffect } from 'react'
import { usePrivateRouter } from '../../context/private_router'
import { Route, RouteProps, useLocation } from 'react-router'
import AuthService from '../../services/auth/AuthService'

/**
 * @description Gera uma rota de login com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */
const LoginRoute = (props: RouteProps): JSX.Element => {
	const router = usePrivateRouter()

	const location = useLocation()

	/**
	 * @description Verifica se o usuário está autenticado e redireciona para a tela correta caso sim
	 */
	useEffect((): void => {
		if (router) {
			if (router.isAuthenticated && router.browserHistory) {
				AuthService.redirectToHome(router.userPermission)
			}
		}
	}, [router, location.pathname])

	const renderRoute = (): JSX.Element => {
		if (!router.isAuthenticated) {
			return <Route {...props} />
		} else {
			return <></>
		}
	}

	return renderRoute()
}

export default LoginRoute
