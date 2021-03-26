FROM ubuntu as build
WORKDIR /app
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install curl -y && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get update -y && \
    apt-get install nodejs -y && \
    npm install --global yarn && \
    apt-get install git -y && \
    git clone https://github.com/petcomputacaoufrgs/DinoApp
WORKDIR /app/DinoApp
RUN git checkout staging && \
    git pull && \
    yarn install --production --network-timeout 10000000 && \
    yarn build

FROM nginx:stable-alpine
COPY --from=build /app/DinoApp/build /usr/share/nginx/html
COPY --from=build /app/DinoApp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
