/**
 * @description Valores de URL da API para conexão
 */
class DinoAPIURLConstants {
    private URL: string = 'https://pet-dino-server.herokuapp.com/'
    private PATH_AUTH: string = 'auth/'

    /**
     * @description URL para autenticação com o Google na API
     */
    PATH_AUTH_GOOGLE: string = this.URL + this.PATH_AUTH + 'google/login'

    /**
     * @description URL para sair com a autenticação da API
     */
    PATH_SIGNOUT_GOOGLE: string = this.URL + this.PATH_AUTH + 'google/logout'
}

export default new DinoAPIURLConstants()