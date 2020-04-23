import MenuItem from '../../types/MenuItem'

/**
 * @description Propriedades do menu de navegação inferior
 */
export default interface BottomNavigationProps{
    /**
     * @description Item que serão exibidos no menu
     */
    groupedItems: MenuItem[][]

    /**
     * @description Indice do item selecionado para aparecer quando o menu carregar, default é ZERO
     */
    selectedItem: number

    /**
     * @description Componente com as views e as suas rotas
     */
    component: JSX.Element
}