FROM ubuntu as build
WORKDIR /app
# Install Tools
RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get install curl -y \
    && curl -fsSL https://deb.nodesource.com/setup_15.x | bash - \
    && apt-get install nodejs -y \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null \
    && echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-key adv --refresh-keys --keyserver keyserver.ubuntu.com \
    && apt-get update -y \ 
    && apt-get install yarn -y \
    && apt-get install git -y
# Download Project
RUN git clone https://github.com/petcomputacaoufrgs/DinoApp
# Build
WORKDIR /app/DinoApp
RUN git checkout staging \
    && git pull \
    && yarn install --production --network-timeout 10000000 && yarn build

FROM nginx:stable-alpine
COPY --from=build /app/DinoApp/build /usr/share/nginx/html
COPY --from=build /app/DinoApp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
