# DinoApp
#### O DinoApp é um aplicativo feito em parceria com o Hospítal de Clínicas de Porto Alegre que tem como objetivo incentivar as crianças do hospital a seguirem a rotina de tratamento médico.

### O DinoApp é um PWA
#### Progressive Web Application (PWA) é uma metodologia de desenvolvimento de software que utiliza de tecnologias comuns da web (HTML, CSS e JS) para desenvolver aplicativos que funcionam em qualquer dispositivo com acesso a navegadores web padrões. O objetivo é preencher a lacuna de experiência de usuário entre aplicações nativas e aplicações web.

### TypeScript
#### TypeScript é um super-set estritamente sintático para JavaScript e adiciona tipagem estática opcional.
- https://www.typescriptlang.org/

### ReactJS e CRA com template Typescript para PWA
#### O ReactJS é uma biblioteca para construção de interfaces de usuário.
- https://reactjs.org/
#### Create React App (CRA) é um software para criação e configuração de projetos web com ReactJS. No DinoApp é utilizada a versão 4 com o template "cra-template-pwa-typescript".
- https://github.com/facebook/create-react-app

### IndexedDB
#### Como PWA o DinoApp tem a missão de ser acessível mesmo quando o usuário não possuir conexão com a internet. Para armazenamento de dados do usuário de forma local é utilizada a biblioteca DexieJS, uma wrapper minimalista para o IndexedDB.
- https://dexie.org/

### WebSocket
#### WebSocket é um protocolo de comunicação que cria canais de comunicação full-duplex sobre uma única conexão TCP. 

### Google OAuth 2.0
#### Para autenticação é utilizada a API OAuth 2.0 do Google. Para mais detalhes acesse: 
- https://developers.google.com/identity/protocols/oauth2
- https://console.developers.google.com/

## Configuração
#### Para executar o projeto crie os arquivos "api_config.json" e "google_config.json" em "src/environment" com os seguintes conteúdos:

### api_config.json

```javascript
{
    "URL":"{Endereço da DinoAPI}/"
}
```

### google_config.json

```javascript
{
    "client_id": "{Google Cloud Client Id}"
}
```

## Execução
### Instalação
- yarn install
### Iniciar Servidor
- yarn start
### Visite o app em
- localhost:3000

## Deploy PETServer [branch staging]
O PET possui um servidor Kubernetes para teste de aplicações construído sobre máquinas ARM.
O arquivo Dockerfile possui as configurações necessárias para gerar a imagem de produção.
Com o Docker instalado e conectado na conta do DockerHub execute o comando abaixo na pasta raiz.
```cmd
docker buildx build --platform linux/arm/v7 -t petcompufrgs/dinoapp:staging --push .
```

O arquivo config.yaml configura o deploy da aplicação no servidor. Copie o conteúdo deste arquivo para o servidor e execute o comando abaixo.
```cmd
kubectl apply -f config.yaml
```
