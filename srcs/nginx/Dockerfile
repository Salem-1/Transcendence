ARG NGINX_VER=1.23.3

FROM nginx:${NGINX_VER}-alpine as base

ARG GEO_DB_RELEASE=2024-01
ARG MODSEC_TAG=v3.0.8
ARG OWASP_TAG=v3.3.4

WORKDIR /opt

RUN echo "Installing Dependencies" && \
    apk add --no-cache --virtual general-dependencies \
    autoconf \
    automake \
    byacc \
    curl-dev \
    flex \
    g++ \
    gcc \
    geoip-dev \
    git \
    libc-dev \
    libmaxminddb-dev \
    libstdc++ \
    libtool \
    libxml2-dev \
    linux-headers \
    lmdb-dev \
    make \
    openssl-dev \
    pcre-dev \
    yajl-dev \
    zlib-dev

RUN echo "Installing ModSec Library" && \
    git clone -b ${MODSEC_TAG} --depth 1 https://github.com/SpiderLabs/ModSecurity.git && \
    git -C /opt/ModSecurity submodule update --init --recursive && \
    (cd "/opt/ModSecurity" && \
        ./build.sh && \
        ./configure --with-lmdb && \
        make && \
        make install \
    ) && \
    rm -fr /opt/ModSecurity \
        /usr/local/modsecurity/lib/libmodsecurity.a \
        /usr/local/modsecurity/lib/libmodsecurity.la

RUN echo 'Cloning Modsec Nginx Connector, GeoIP, ModSec OWASP Rules, and download/extract nginx and GeoIP databases' && \
    git clone -b master --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git && \
    git clone -b master --depth 1 https://github.com/leev/ngx_http_geoip2_module.git && \
    git clone -b ${OWASP_TAG} --depth 1 https://github.com/coreruleset/coreruleset.git /usr/local/owasp-modsecurity-crs && \
    wget -O - https://nginx.org/download/nginx-$NGINX_VERSION.tar.gz | tar -xz && \
    mkdir -p /etc/nginx/geoip && \
    wget -O - https://download.db-ip.com/free/dbip-country-lite-${GEO_DB_RELEASE}.mmdb.gz | gzip -d > /etc/nginx/geoip/dbip-city-lite.mmdb && \
    wget -O - https://download.db-ip.com/free/dbip-country-lite-${GEO_DB_RELEASE}.mmdb.gz | gzip -d > /etc/nginx/geoip/dbip-country-lite.mmdb

RUN echo 'Installing Nginx Modules' && \
    (cd "/opt/nginx-$NGINX_VERSION" && \
        ./configure --with-compat \
            --add-dynamic-module=../ModSecurity-nginx \
            --add-dynamic-module=../ngx_http_geoip2_module && \
        make modules \
    ) && \
    cp /opt/nginx-$NGINX_VERSION/objs/ngx_http_modsecurity_module.so \
        /opt/nginx-$NGINX_VERSION/objs/ngx_http_geoip2_module.so \
        /usr/lib/nginx/modules/ && \
    rm -fr /opt/* && \
    apk del general-dependencies

FROM nginx:${NGINX_VER}-alpine

LABEL maintainer="ahsalem"
# Copy nginx, owasp-modsecurity-crs, and modsecurity from the build image
COPY --from=base /etc/nginx/ /etc/nginx/
COPY --from=base /usr/local/modsecurity /usr/local/modsecurity
COPY --from=base /usr/local/owasp-modsecurity-crs /usr/local/owasp-modsecurity-crs
COPY --from=base /usr/lib/nginx/modules/ /usr/lib/nginx/modules/

# Copy local config files into the image
RUN mkdir -p /etc/nginx/certs
COPY conf/nginx/certs /etc/nginx/certs

COPY errors /usr/share/nginx/errors
COPY conf/nginx/ /etc/nginx/
COPY conf/modsec/ /etc/nginx/modsec/
COPY conf/owasp/ /usr/local/owasp-modsecurity-crs/

# COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

# # Copy SSL certificate
# COPY ./localhost.crt /etc/ssl/certs/localhost.crt
# COPY ./localhost.key /etc/ssl/private/localhost.key

COPY ./frontend /var/www/html

RUN chown -R nginx:nginx /var/www/html

RUN apk add --no-cache \
    curl-dev \
    libmaxminddb-dev \
    libstdc++ \
    libxml2-dev \
    lmdb-dev \
    pcre \
    tzdata \
    yajl && \
    chown -R nginx:nginx /usr/share/nginx

RUN sed -i 's/RUN SecRuleEngine DetectionOnly/RUN SecRuleEngine On/' /etc/nginx/modsec/modsecurity.conf

EXPOSE 80 3000
# EXPOSE 443
WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
