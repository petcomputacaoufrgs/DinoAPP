import LanguageEnum from '../../types/enum/LanguageEnum'
import LanguageBase from './LanguageBase'

/**
 * @description Conjunto de textos em português
 */
export default class PT implements LanguageBase {
	APP_NAME = 'DinoApp'

	DINOAPP_TEAM = 'Equipe DinoApp'

	CURIOUS_DINO_ALT = 'Dinossauro curioso'

	LANGUAGE_CODE = LanguageEnum.PORTUGUESE

	ISO_LANGUAGE_CODE = 'pt'

	LANGUAGE_PORTUGUESE = 'Português'

	LANGUAGE_ENGLISH = 'Inglês'

	NOT_FOUND_MESSAGE = 'Item não encontrado.'

	NOT_FROND_REDIRECT_MESSAGE = 'Redirecionado...'

	WELCOME_MESSAGE = 'Bem vindo(a)!'

	FIRST_LOGIN_DIALOG_LABEL = 'Diálogo de Configurações Iniciais'

	FIRST_LOGIN_WELCOME_MESSAGE_HEADER = 'Bem vindo(a)!'

	FIRST_LOGIN_WELCOME_MESSAGE =
		'Dino Message Lorem ipsum dolor sit amet consectetur adipisicin elit. Nisi illum officiis vero debitis quia nam iusto. Necessitatibu repudiandae ut labore!'

	FIRST_LOGIN_DONE_MESSAGE = 'Tudo Certo!'

	FIRST_LOGIN_THANK_YOU_FOR_JOINING_MESSAGE =
		'Obrigado por se juntar ao DinoApp!'

	FIRST_LOGIN_CONFIGURATIONS_MESSAGE =
		'Suas configurações podem ser atualizadas a qualquer momento na seção de Configurações do aplicativo.'

	FIRST_LOGIN_CHOOSE_TREATMENT = 'Escolha seu Tratamento'

	FIRST_LOGIN_CHOOSE_PASSWORD = 'Crie uma senha para a área dos responsáveis'

	FIRST_LOGIN_CHOOSE_COLOR_THEME = 'Escolha seu Tema de Cores'

	FIRST_LOGIN_CHOOSE_LANGUAGE = 'Escolha seu Idioma'

	LOGIN_BUTTON_TEXT = 'Entrar com o Google'

	LOGOUT_BUTTON_DESCRIPTION =
		'Imagem de uma porta aberta com uma seta indicando saída.'

	SEARCH_HOLDER = 'Buscar...'

	LOGIN_FAIL_BY_GOOGLE = 'Erro no login com o Google.'

	LOGIN_FAIL_BY_API = 'Erro no login com o servidor do DinoApp.'

	LOGIN_CANCELED = 'Login cancelado.'

	LOGIN_REFRESH_NECESSARY = 'Precisamos que se autentique novamente, por favor.'

	AVATAR_ALT = 'Imagem de perfil do usuário com as bordas arredondadas.'

	LOGOUT_DIALOG_QUESTION = 'Tem certeza que deseja sair do DinoApp?'

	LOGOUT_DIALOG_DESCRIPTION =
		"Se disser 'SIM' todos os dados referentes a sua conta serão removidos deste dispositivo."

	AGREEMENT_BUTTON_ARIA_LABEL = 'Clique para concordar'

	DISAGREEMENT_BUTTON_ARIA_LABEL = 'Clique para negar'

	ADD = 'Adicionar'

	EDIT = 'Editar'

	DELETE = 'Deletar'

	DELETE_ITEM_OPTION_TEXT = 'Esta ação irá deletar o item permanentemente.'

	DELETE_CONTACT_OPTION_TEXT =
		'Esta ação irá deletar seu contato permanentemente.'

	TERMS_OF_USE = 'Termos de Uso'

	PRIVACY_POLICY = 'Política de Privacidade'

	HOME = 'Home'

	GAMES = 'Jogos'

	MENU_SETTINGS = 'Configurações'

	MENU_CONTACTS = 'Contatos'

	MENU_LOGOUT = 'Sair'

	ABOUT_US = 'Sobre Nós'

	MENU_STAFF_MODERATION = 'Equipe'

	TREATMENTS = 'Tratamentos'

	TITLE = 'Título'

	SUBTITLE = 'Subtítulo'

	TEXT = 'Texto Prévio'

	FULL_TEXT = 'Texto Completo'

	SETTINGS_TITLE = 'Configurações'

	CHOOSE_LANGUAGE = 'Escolher Idioma'

	CHOOSE_TREATMENT = 'Escolha seu tratamento'

	SETTINGS_UPDATED_SUCESS = 'Configurações salvas.'

	SETTINGS_UPDATED_ERROR = 'Erro salvando as novas configurações.'

	NOTES = 'Notas'

	MENU_CALENDAR = 'Calendário'

	NOTES_HEADER_IMAGE_DESC =
		'Imagem com um caderno de anotações com uma mão escrevendo.'

	ADD_BUTTON = 'Clique para adicionar um novo item.'

	NOTE_STATE_DONE = 'Anotação respondida.'

	NOTE_STATE_NOT_DONE = 'Anotação ainda não possui uma resposta.'

	NOTE_SHOW_ANSWER = 'Clique para ver a resposta desta pergunta logo abaixo.'

	NOTE_EDIT_ANSWER_BUTTON = 'Clique aqui para editar a resposta dessa anotação.'

	NOTE_EDIT_QUESTION_BUTTON =
		'Clique aqui para editar a pergunta desta anotação.'

	NOTE_DELETE_BUTTON = 'Clique aqui para apagar está anotação.'

	ANSWER_NOTE_DIALOG_TITLE = 'Resposta'

	NOTE_TAG_LABEL = 'Tags'

	DIALOG_CANCEL_BUTTON_TEXT = 'Cancelar'

	SEARCH_BUTTON_LABEL = 'Buscar...'

	ANSWER_DIALOG_LABEL = 'Tela para responder uma questão anotada.'

	FORM_NAME = 'Nome'

	FORM_DESCRIPTION = 'Descrição'

	FORM_TYPE = 'Tipo'

	FORM_PHONE = 'Telefone'

	FORM_QUESTION = 'Pergunta'

	FORM_ANSWER = 'Resposta'

	FORM_QUESTION_PLACEHOLDER = 'Digite sua pergunta...'

	FORM_QUESTION_TITLE = 'Mande sua pergunta!'

	FORM_ADD_PHONE = 'Adicionar Telefone'

	FORM_ADD_STAFF = 'Adicionar Membro de Equipe'

	FORM_EMAIL = 'Adicionar E-mail'

	ADD_STAF_TAB = 'Adicionar'

	STAFF_LIST_TAB = 'Equipe'

	STAFF_SAVE_SUCCESS = 'Membro de equipe adicionado(a)'

	TREATMENT = 'Tratamento'

	ADD_TREATMENT = `Adicione ${this.TREATMENT}`

	STAFF_ADD_TREATMENT_NAME = 'Adicione Título de Tratamento'

	PENDING = 'Pendente'

	STAFF = 'Equipe'

	EMAIL = 'E-mail'

	MEMBER_OF_STAFF = 'Membro de Equipe'

	NOT_FOUND_QUESTION_FAQ = 'Não encontrou sua pergunta?'

	NEW_CONTACT = 'Novo Contato'

	NEW_TREATMENT = 'Novo Tratamento'

	NEW_GLOSSARY_ITEM = 'Novo Item de Glossário'

	ESSENTIAL_CONTACT_MUST_HAVE_PHONE = 'Contato Essencial deve ter um telefone'

	CONTACTS_ADD_ESSENTIAL_CONTACT = 'Novo Contato Essencial'

	CONTACT_MOBILE_PHONE = 'Móvel'

	CONTACT_RESIDENTIAL_PHONE = 'Fixo'

	CONTACT_PUBLIC_SERVICE_PHONE = 'Serviço'

	NO_AVAILABLE_TEXT = 'Sem Texto Disponível'

	JANUARY = 'Janeiro'

	FEBRUARY = 'Fevereiro'

	MARCH = 'Março'

	APRIL = 'Abril'

	MAY = 'Maio'

	JUNE = 'Junho'

	JULY = 'Julho'

	AUGUST = 'Agosto'

	SEPTEMBER = 'Setembro'

	OCTOBER = 'Outubro'

	NOVEMBER = 'Novembro'

	DECEMBER = 'Dezembro'

	INVALID_MONTH = 'Mês inválido'

	STRING_DATE_FORMAT = 'DD de MM de YYYY'

	DELETE_NOTE_ALERT_TITLE = 'Tem certeza que deseja excluir esta anotação?'

	DELETE_NOTE_ALERT_TEXT =
		'Ao aceitar esta anotação será removida permanentemente.'

	LOADING = 'Carregando...'

	NO_OPTIONS = 'Sem opções'

	EMPTY_FIELD_ERROR = 'Campo não pode ser vazio.'

	DISCONNECTED_MESSAGE =
		'Você está desconectado da Internet. Para salvar alterações locais conecte-se a Internet.'

	CONNECTED_MESSAGE = 'Agora você está conectado!'

	SYNC_STARTED = 'Sincronizando dados...'

	SYNC_FINISH = 'Dados sincronizados!'

	SYNC_FAIL = 'Sincronização falhou. Iremos tentar novamente...'

	SYNC_CONNECTION_FAIL =
		'Erro de conexão durante a sincronização. Assim que a conexão retornar tentaremos novamente.'

	CANT_LOGIN_DISCONNECTED = 'Conexão com a internet necessária para login'

	DISCONNECTED = 'Desconectado'

	FAQ = 'F.A.Q.'

	SELECT_FAQ_BUTTON = `Busque ${this.FAQ}`

	SELECT_TREATMENT_LOAD_CONTACT_GRANT =
		'Carregar contatos essenciais referentes ao meu tratamento'

	SAVE_CONTACT_ON_GOOGLE_GRANT =
		'Salvar contatos do DinoApp em minha conta Google'

	SUNDAY_NAME = 'Domingo'

	MONDAY_NAME = 'Segunda'

	TUESDAY_NAME = 'Terça'

	WEDNESDAY_NAME = 'Quarta'

	THURSDAY_NAME = 'Quinta'

	FRIDAY_NAME = 'Sexta'

	SATURDAY_NAME = 'Sabádo'

	NEXT_BUTTON_TEXT = 'Próximo'

	PREVIOUS_BUTTON_TEXT = 'Anterior'

	CLOSE_ARIA_LABEL = 'Fechar'

	DELETE_ARIA_LABEL = 'Deletar'

	EDIT_ARIA_LABEL = 'Editar'

	INVALID_WEEKDAY = 'Dia da semana inválido.'

	TODAY = 'Hoje'

	DATE_FROM = 'De'

	DATE_TO = 'Até'

	MEDICAL_APPOINTMENT_TYPE = 'Consulta médica'

	MEDICINE_TYPE = 'Medicamento'

	INVALID_EVENT_TYPE = 'Tipo de evento inválido'

	MINUTES = 'minutos '

	HOURS = 'horas'

	DAYS = 'dias'

	AND = 'e'

	BEFORE = 'antes'

	MINUTE = 'minuto'

	HOUR = 'hora'

	DAY = 'dia'

	ADD_EVENT_TITLE = 'Novo Evento'

	EVENT_TYPE_LABEL = 'Tipo de Evento'

	EVENT_NAME_LABEL = 'Nome do Evento'

	EVENT_INIT_DATE_LABEL = 'Dia de início'

	EVENT_INIT_TIME_LABEL = 'Horário de início'

	EVENT_END_DATE_LABEL = 'Dia de termino'

	EVENT_END_TIME_LABEL = 'Horário de termino'

	DATE_PICKER_DAY_FORMAT = 'dd/MM/yyyy'

	EVENT_REPEAT_NOT_REPEAT = 'Náo se repete'

	EVENT_REPEAT_EVERY_DAY = 'Todos os dias'

	EVENT_REPEAT_EVERY_WEEK = 'Todas as semenas'

	EVENT_REPEAT_EVERY_MONTH = 'Todos os meses'

	EVENT_REPEAT_EVERY_YEAR = 'Todos os anos'

	EVENT_REPEAT_EVERY_CUSTOMIZED = 'Personalizado'

	EVENT_REPEAT_TYPE_LABEL = 'Tipo de repetição do evento'

	INVALID_EVENT_REPEAT_TYPE = 'Tipo de repetição inválida'

	EVENT_TITLE_ICON_ALT = 'Escolha o título do evento'

	EVENT_TYPE_ICON_ALT = 'Escolha o tipo do evento'

	EVENT_DATE_ICON_ALT = 'Escolha a data do evento'

	EVENT_REPEAT_ICON_ALT = 'Escolha a repetição do evento'

	EVENT_REPEAT_END_DATE_LABEL = 'Final da repetição'

	EVENT_WEEKDAY_SELECT_LABEL = 'Selecione os dias:'

	EVENT_ALERT_ALT = 'Adicionar alertas antes do evento'

	EVENT_ADD_ALARM_LABEL = 'Tempo'

	EVENT_ADD_ALARM_TYPE_LABEL = 'Medida de tempo'

	EVENT_ADD_ALERT = 'Adicionar notificação'

	EVENT_INVALID_ALARM_TYPE = 'tipo inválido'

	EVENT_ALARM_ZERO = 'Na hora do evento'

	EVENT_ALARM_DELETE_ALT = 'Clique para excluir o alarme'

	CHANGE_COLOR_ARIA_LABEL = 'Clique para selecionar uma cor aleatória'

	ADD_PHONE_ARIA_LABEL = 'Clique para adicionar um novo telefone numérico'

	RETURN_ARIA_LABEL = 'Retornar'

	SEARCH_ARIA_LABEL = 'Pesquisar'

	OPEN_MENU_ARIA_LABEL = 'Abrir menu'

	CLOSE_MENU_ARIA_LABEL = 'Fechar menu'

	CLICK_TO_OPEN_MENU_ITEM = 'Clique para abrir '

	OPTIONS = 'Opções'

	EVENT_COLOR_LABEL = 'Cor selecionada'

	MAX = 'máx. '

	ADD_COLUMN_TEXT = '+ Adicionar coluna'

	COLUMN_ADD_LABEL = 'Adicionar Coluna'

	COLUMN_EDIT_LABEL = 'Editar Coluna'

	COLUMN_TITLE_LABEL = 'Título da coluna'

	COLUMN_MIN_LENGTH_ERROR = 'Mínimo 1 caractere.'

	NOTE_COLUMN_DELETE_DIALOG_QUESTION =
		'Tem certeza que deseja remover esta coluna?'

	ARE_YOU_SURE = 'Tem certeza?'

	NOTE_COLUMN_DELETE_DIALOG_DESC = `Caso responda 'SIM' esta coluna será removida permanentemente.`

	NOTE_COLUMN_WITH_NOTES_DELETE_DIALOG_DESC =
		'Ao remover esta coluna você irá remover as anotações pertencentes a ela permanentemente.'

	NOTE_COLUMN_ADD_NOTE_TEXT = 'Adicionar anotação'

	NOTE_EDIT_DIALOG_NEW_NOTE_TITLE = 'Nova anotação'

	QUESTION_NOTE_DIALOG_TITLE = 'Pergunta'

	NOTE_INFO_DIALOG_COLUMN_TITLE = 'Coluna:'

	NOTE_SEARCH_CLEAN = 'Nenhuma anotação corresponde a pesquisa atual.'

	TEDDY_BEAR_LIGHT_THEME_NAME = 'Ursinho de Pelúcia (Claro)'

	MINT_DARK_THEME_NAME = 'Menta (Escuro)'

	COTTON_CANDY_LIGHT_THEME_NAME = 'Algodão Doce (Claro)'

	EGGPLANT_DARK_THEME_NAME = 'Beringela (Escuro)'

	DEVICE_DEFAULT_THEME_NAME = 'Padrão do sistema'

	COLOR_THEME_SELECTION_TITLE = 'Escolher Tema de Cores'

	FONT_SIZE_SELECTION_TITLE = 'Escolher Tamanho da Fonte'

	DEFAULT_FONT_SIZE_NAME = 'Padrão'

	LARGE_FONT_SIZE_NAME = 'Grande'

	LARGER_FONT_SIZE_NAME = 'Gigante'

	CONTACT = 'Contato'

	CONTACT_NUMBER_ALREADY_EXISTS = 'Este número já está registrado no contato'

	CONTACT_CLEAR_BUTTON_ARIA_LABEL = 'Clique aqui para limpar'

	COLOR_THEME_SELECTION_ARIA_LABEL = 'Clique aqui para mudar a cor do contato'

	DIALOG_AGREE_TEXT = 'Aceito'

	DIALOG_DECLINE_BUTTON_TEXT = 'Declino'

	GRANT_FAIL_BY_EXTERNAL_ERROR =
		'Desculpe, aconteceu algo errado. Por favor, tente novamente.'

	GRANT_CANCELED = 'Permissão cancelada. Por favor, tente novamente.'

	GRANT_FAIL_BY_INVALID_ACCOUNT =
		'Conta inválida. Por favor, selecione a conta que está logada.'

	GRANT_RESFRESH_TOKEN_NECESSARY =
		'Desculpe, erro nosso. Por favor, tente novamente.'

	GRANT_FAIL_BY_DISCONNECTION =
		'Desculpe, aconteceu um erro de conexão. Tente novamente assim que a conexão voltar.'

	GRANT_FAIL_BY_UNKNOW_ERROR =
		'Desculpe, aconteceu um erro desconhecido. Por favor, tente novamente.'

	GRANT_FAIL_BY_EXTERNAL_SUCCESS = 'Sucesso! Aproveite suas vantagens.'

	GRANT_DECLINED = 'Você pode ativar esta função futuramente.'

	GOOGLE_CONTACT_GRANT_TEXT =
		'Gostaríamos de permissão para salvar e editar seus contatos do DinoApp na sua conta do Google. Assim você terá seus contatos de emergência em diversos aplicativos diferentes. \nNunca leremos nem modificaremos outros contatos além dos contatos criados no DinoApp.'

	GOOGLE_CONTACT_GRANT_TITLE = 'Seus contatos em qualquer lugar'

	ARROW_BACK_ARIA_LABEL = 'Retorno para a última página'

	GOOGLE_LOGIN_BUTTON_ARIA_LABEL =
		'Clique aqui para entrar com a sua conta do Google'

	OPEN_DRAWER_BUTTON_ARIA_LABEL = 'Clique aqui para abrir o menu'

	CLOSE_MENU_BUTTON_ARIA_LABEL = 'Clique aqui para fechar o menu'

	CALENDAR_EDIT_BUTTON_ARIA_LABEL = 'Clique aqui para editar'

	CALENDAR_DELETE_BUTTON_ARIA_LABEL = 'Clique aqui para excluir'

	CALENDAR_CLOSE_BUTTON_ARIA_LABEL = 'Clique aqui para fechar a tela'

	CALENDAR_CURRENT_MONTH_ARIA_LABEL = 'Clique aqui para ir para o mês atual'

	READ_MORE = 'Leia mais'

	NO_TREATMENTS_AVAILABLE = 'Nenhum tratamento disponível'

	NO_TREATMENT_SELECTED = 'Selecione um tratamento'

	NO_FAQ_AVAILABLE = 'Nenhuma F.A.Q disponível'

	KIDS_SPACE = 'Espaço infantil'

	DINO_RUNNER_GAME = 'Dino Corredor'

	MEMORY_GAME = 'Jogo da Memória'

	DINO_SLIDER_GAME = 'Dino Slider'

	TIC_TAC_DINO_GAME = 'Tic Tac Dino'

	MUSICAL_DINO_GAME = 'Dino Musical'

	SNAKE_GAME = 'Jogo da Cobra'

	SECONDARY_TAB_MESSAGE =
		'O dino já está aberto em outra guia do seu navegador. Você só pode abri-lo em uma guia por vez.'

	SECONDARY_TAB_BUTTON_TEXT = 'Clique aqui para abrir nesta guia'

	APP_READY_FOR_OFFLINE_USE_MESSAGE =
		'DinoApp está pronto para uso sem internet!'

	APP_UPDATE_MESSAGE =
		'Atualização disponível! Reinicie o DinoApp para instalar.'

	END = 'Fim'

	PWA_INTRO_TITLE_0 = 'Bem vindo ao DinoApp!'

	PWA_INTRO_0_TEXT_1 = 'Olá! Seja muito bem vindo!'

	PWA_INTRO_0_TEXT_2 =
		'Estou aqui para te ajudar com dúvidas, organização e trazer jogos divertidos e educativos para as crianças!'

	PWA_INTRO_TITLE_1 = 'O DinoApp funciona sem internet!'

	PWA_INTRO_1_TEXT_1 =
		'A partir de agora você não precisa estar conectado a internet para usar o DinoApp.'

	PWA_INTRO_1_TEXT_2 = 'Vou te mostrar como isto funciona!'

	PWA_INTRO_TITLE_2 = 'Tudo seguro na DinoNuvem'

	PWA_INTRO_2_TEXT_1 =
		'A DinoNuvem salva seus dados para que você possa acessá-los de qualquer lugar sem nunca perder nada!'

	PWA_INTRO_2_TEXT_2 =
		'Mesmo desconectado você ainda pode usar o aplicativo livremente.'

	PWA_INTRO_TITLE_3 = 'Conexão com a DinoNuvem'

	PWA_INTRO_3_TEXT_1 =
		'Estes simbolos abaixo são exibidos ao lado da sua foto de perfil e indicam sua conexão com a DinoNuvem.'

	PWA_INTRO_3_TEXT_2 = 'Desconectado da DinoNuvem.'

	PWA_INTRO_3_TEXT_3 = 'Atualizando seus dados na DinoNuvem.'

	PWA_INTRO_2_TEXT_4 = 'Conectado com a DinoNuvem.'

	SNAKE_GAME_GAME_OVER_MSG_1 = 'Oh não! Sua cobra bateu!'

	WINNER = 'Ganhador: '

	NEXT_PLAYER = 'Próximo jogador: '

	DINO_RUNNER_GAME_OVER_MSG_1 = 'Oh não! O Dino encostou na bactéria.'

	START_GAME = 'Iniciar Jogo!'

	MUSICAL_DINO_GAME_MSG_1 = 'Parabéns! Sua música ficou incrível!'

	PLAY_AGAIN_MESSAGE = 'Deseja jogar novamente?'

	TIC_TAC_DINO_GAME_OVER_MSG_1 = 'Bom jogo! Parabéns'

	TIE = 'Empatou!'

	PASSWORD = 'Senha'

	FORGOT_PASSWORD = 'Esqueceu sua senha?'

	ACCESS_PARENTS_AREA =
		'Essa área é para adultos. Você é um adulto ou está acompanhado de um?'

	ACCESS = 'Acessar'

	YES = 'Sim'

	NO = 'Não'

	DELETE_ACCOUNT = 'Excluir conta'

	DELETE_ACCOUNT_MESSAGE =
		'Esta ação é IRREVERSÍVEL, você tem certeza que deseja EXCLUIR a sua conta?'

	DELETE_ACCOUNT_SUCCESS_MESSAGE = 'Sua conta foi excluida com sucesso.'

	DELETE_ACCOUNT_ERROR_MESSAGE =
		'Ocorreu um erro ao excluir sua conta. Tente novamente mais tarde.'

	SUCESS_GAME_OVER_LABEL = 'Você arrasou! Parabéns'

	CHANGE_PASSWORD_LABEL = 'Alterar senha de acesso a área dos responsáveis'

	CHANGE_PASSWORD = 'Alterar senha'

	CANCEL = 'Cancelar'

	CHANGE = 'Alterar'

	INSERT_OLD_PASSWORD = 'Digite a senha atual: '

	INSERT_NEW_PASSWORD = 'Digite a nova senha: '

	INSERT_NEW_PASSWORD_AGAIN = 'Digite novamente a nova senha: '

	SETTING_PASSWORD_EXPLANATION =
		'Essa senha é responsável por proteger a criança de conteúdos sensíveis, já que só será possível acessar a área adulta com o uso dessa senha. A senha deve ter entre 8 e 24 caracteres.'

	INSERT_PASSWORD = 'Digite a senha: '

	INSERT_PASSWORD_AGAIN = 'Digite novamente a senha: '

	PASSWORD_MIN_LENGHT_ERROR_MESSAGE = 'A senha deve ter entre 8 e 24 caracteres'

	PASSWORD_CONFIRM_LENGHT_ERROR_MESSAGE = 'A senhas estão diferentes'

	SUCESS = 'Sucesso'

	WRONG_PASSWORD = 'Senha incorreta'

	EXAMPLE_EMAIL = 'examplo@email.com'

	GLOSSARY = 'Glossário'

	GLOSSARY_ITEM = 'Item de Glossário'

	FAQ_ITEM = `Item da ${this.FAQ}`

	TREATMENTS_AND_FAQS = `Tratamentos & ${this.FAQ}s`

	INVALID_VALUE = 'Valor inválido'

	USER_QUESTIONS = 'Usuários Perguntam'

	QUESTION = 'Pergunta'

	QUESTIONS = 'Perguntas'

	SEND_TO_THE_PROFESSIONALS = 'Mande para os profissionais!'

	SAVE = 'Salvar'

	UNIVERSAL_CONTACT_LABEL =
		'Este contato é universal e aparecerá em todas as agendas de usuários'

	ANSWER = 'Responder'

	TREATMENT_QUESTION_ANSWER_PLACEHOLDER = 'Resposta da pergunta...'

	ADD_STAFF_LABEL = `Membros de equipe são usuários que podem adicionar, remover e editar dados exibidos para o usuário comum: contatos do hospital, glossário, itens da ${this.FAQ}, etc. Apenas o e-mail registrado como administrador é capaz de adicionar e remover outros membros.`

	NO_ITEMS_LIST = 'Sem Itens'

	FILTER = 'Filtro'

	ESSENTIAL_CONTACTS = 'Contatos Essenciais'

	YOUR_CONTACTS = 'Seus Contatos'

	UNIVERSAL_ESSENTIAL_CONTACTS = `${this.ESSENTIAL_CONTACTS} Universais`

	TREATMENT_ESSENTIAL_CONTACTS = `${this.ESSENTIAL_CONTACTS} de Tratamento`

	HAS_USER_QUESTIONS_FILTER_LABEL = 'Apenas Com Perguntas de Usuários'

	RENDER_OFFLINE_CONTENT_PART_1 =
		'Para que possamos fazer a sincronização com os contatos é necessário uma conexão com uma rede de internet.'

	RENDER_OFFLINE_CONTENT_PART_2 = 'Tente novamente quando estiver conectado.'

	NO_CONNECTION = 'Sem conexão'

	REDUCE = 'Reduzir'

	SHOW_FAQ_ITEM_IN_ALL_FAQS_LABEL = `Relacionar item a todas ${this.FAQ}s existentes`

	GO_TO_SLEEP = 'Ir dormir'

	GO_OUTSIDE = 'Sair de casa'

	CUSTOMIZE = 'Customizar'

	RETURN_INSIDE = 'Retornar para casa'

	GO_TO_GAME_MENU = 'Ir para o menu de jogos'

	CHOOSE_COLOR_DINO_MESSAGE =
		'Olá, eu sou o Dino! Vamos escolher a cor das minhas escamas?'

	CHOOSE_ACESSORY_DINO_MESSAGE = 'Hora de escolher um acessório legal!'

	CHOOSE = 'Escolha'

	REPORT_BUG = 'Reportar um problema'

	ABOUT_US_PET = 'PET Computação'

	ABOUT_US_PET_TEXT = `\tO PET (Programa de Educação Tutorial) Computação, criado em 1988, é um grupo composto por estudantes de graduação dos cursos de Ciência da Computação e Engenharia da Computação. Coordenado por um professor tutor. O projeto é formado por uma equipe diversa, voltada ao desenvolvimento individual de seus estudantes e também ao fortalecimento da comunidade acadêmica, tanto do Instituto de Informática quanto externa.\n\tO PET Computação se baseia na Tríade Acadêmica de Ensino, Pesquisa e Extensão, e tem como objetivo providenciar a oportunidade dos membros explorarem áreas de interesse além do currículo de seus cursos.\n\tOs projetos desenvolvidos pelo grupo abrangem o desenvolvimento de softwares e aplicações mobile; ministração de minicursos relacionados à computação; projetos de pesquisa e desenvolvimento de artigos acadêmicos; organização de eventos para a comunidade do Instituto, dentre outros. Também são realizados projetos em parceria com outros grupos PET da UFRGS (PETelos).`

	ABOUT_US_HCPA = 'Hospital de Clínicas'

	ABOUT_US_HCPA_TEXT = `\tSer um referencial público em saúde, prestando assistência de excelência, gerando conhecimento, formando e agregando pessoas de alta qualificação. Essa é a missão do Hospital de Clínicas de Porto Alegre (HCPA), instituição pública integrante da rede de hospitais universitários do Ministério da Educação (MEC) e vinculada academicamente à Universidade Federal do Rio Grande do Sul (UFRGS).\n\tAtuando desde 1971, é um dos principais esteios da assistência pública à saúde da população do Rio Grande do Sul, oferecendo atendimento de excelência e alta complexidade em amplo rol de especialidades. As atividades de ensino de graduação e pós-graduação, lado a lado com a UFRGS, formam gerações de profissionais familiarizados e comprometidos com as melhores práticas e a humanização da assistência. A pesquisa produzida no HCPA, por sua vez, introduz novos conhecimentos, técnicas e tecnologias que beneficiam toda a sociedade, além de formar novas gerações de pesquisadores, alimentando um ciclo de renovação e evolução permanentes.\n\tA adoção de padrões internacionais de qualidade e segurança, o cuidado humanizado e o atendimento integral ao cidadão são compromissos firmados diariamente com os pacientes e a comunidade.`

	ABOUT_US_UFRGS = 'UFRGS'

	ABOUT_US_UFRGS_TEXT = `\tA Universidade Federal do Rio Grande do Sul, com sede em Porto Alegre , capital do Estado do Rio Grande do Sul, é uma instituição centenária, reconhecida nacional e internacionalmente. Ministra cursos em todas as áreas do conhecimento e em todos os níveis, desde o Ensino Fundamental até a Pós-Graduação.\n\tA qualificação do seu corpo docente, composto em sua maioria por mestres e doutores, a atualização permanente da infraestrutura dos laboratórios e bibliotecas, o incremento à assistência estudantil, bem como a priorização de sua inserção nacional e internacional são políticas em constante desenvolvimento.\n\tPor seus prédios circulam, diariamente, cerca de 40 mil pessoas em busca de um dos mais qualificados ensino do país. Este, aliado à pesquisa, com reconhecidos níveis de excelência, e a extensão, a qual proporciona diversificadas atividades à comunidade, faz com que a UFRGS alcance altos níveis de avaliação.\n\tA UFRGS, como instituição pública a serviço da sociedade e comprometida com o futuro e com a consciência crítica, respeita as diferenças, prioriza a experimentação e, principalmente, reafirma seu compromisso com a educação e a produção do conhecimento, inspirada nos ideais de liberdade e solidariedade.`

	WHAT = 'O QUE'

	WHERE = 'ONDE'

	HOW = 'COMO'

	BUG_REPORT_WHAT = `Conte-nos, em detalhes, qual foi o problema que encontrou. O que aconteceu? Impediu-lhe de utilizar o aplicativo?`

	BUG_REPORT_HOW = `Agora nos conte como o bug veio a acontecer. Você consegue replicá-lo? Ele acontece sempre quando você realiza uma determinada ação ou foi apenas uma vez?`

	BUG_REPORT_WHERE = `Em qual área você encontrou o problema? Por exemplo, foi em algum jogo, na área infantil, na seção de notas ou em algum outro lugar?`

	itemAlreadyExists = (item: string) => `${item} já existente`

	deleteItemText = (item: string) => `${this.DELETE} ${item.toLowerCase()}?`

	seeFAQItemsText = (treatment: string) => `Ver ${this.FAQ} de ${treatment}`

	titleFAQTreatmentText = (treatment: string) => `${this.FAQ} de ${treatment}`

	titleTreatmentQuestion = (treatment: string) =>
		`Tem uma pergunta sobre ${treatment}?`
}
