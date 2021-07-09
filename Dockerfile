FROM node:13 AS build-env

# Use SSH key from env. to fetch private (git) dependencies.
ARG ssh_key
ENV ssh_key $ssh_key
RUN echo "$ssh_key" > /build-key && \
    chmod 600 /build-key && \
    echo "IdentityFile /build-key" >> /etc/ssh/ssh_config && \
    echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config
# Env. vars with public keys, etc.
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-production}
ARG GITHUB_TOKEN
ENV GITHUB_TOKEN $GITHUB_TOKEN

# Build that JS...
WORKDIR /home/node/app
COPY package.json /home/node/app
COPY yarn.lock /home/node/app
# COPY .npmrc /home/node/app // this will be useful only if we use @urbancampus/uc-kit
RUN yarn install
COPY . /home/node/app
RUN yarn build

# Ship a lighter container with only the built app.
FROM alpine:latest
RUN mkdir -p /home/node/app/build
COPY --from=build-env /home/node/app/build /home/node/app/build
COPY --from=build-env /home/node/app/bin /home/node/app/bin
RUN chmod +x /home/node/app/bin/docker-cmd.sh
CMD ["sh", "/home/node/app/bin/docker-cmd.sh"]
