FROM nginx:1.25-alpine3.18-slim

# Copy nginx config
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

# # Copy SSL certificate
# COPY ./localhost.crt /etc/ssl/certs/localhost.crt
# COPY ./localhost.key /etc/ssl/private/localhost.key

COPY ./frontend /var/www/html

RUN chown -R nginx:nginx /var/www/html

EXPOSE 80 3000
# EXPOSE 443

COPY ./conf/setup.sh ./

RUN ["sh", "./setup.sh"]

CMD ["nginx", "-g", "daemon off;"]
