# base image
FROM alpine:3.7

# set vault version
ENV VAULT_VERSION 0.10.3

# create a new directory
RUN mkdir /vault

# download dependencies
RUN apk --no-cache add \
      bash \
      ca-certificates \
      wget

# download and set up vault
RUN wget --quiet --output-document=/tmp/vault.zip https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip && \
    unzip /tmp/vault.zip -d /vault && \
    rm -f /tmp/vault.zip && \
    chmod +x /vault

# update PATH
ENV PATH="PATH=$PATH:$PWD/vault"

# add the config file
COPY ./vault/config/vault-config.json /vault/config/vault-config.json
COPY ./vault/entrypoint.sh .
RUN chmod +x entrypoint.sh
# expose port 8200
EXPOSE 8200
# RUN ./vault/entrypoint.sh
# run vault
ENTRYPOINT ["vault"]
