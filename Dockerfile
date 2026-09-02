FROM httpd:2.4

# envsubst (fourni par gettext-base) pour la substitution des variables au démarrage
RUN apt-get update \
    && apt-get install -y --no-install-recommends gettext-base \
    && rm -rf /var/lib/apt/lists/*

# Activation des modules nécessaires
RUN sed -i \
    -e 's/^#\(LoadModule rewrite_module\)/\1/' \
    -e 's/^#\(LoadModule headers_module\)/\1/' \
    -e 's/^#\(LoadModule proxy_module\)/\1/' \
    -e 's/^#\(LoadModule proxy_http_module\)/\1/' \
    /usr/local/apache2/conf/httpd.conf

# Autoriser les directives .htaccess
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf

# Contenu statique
COPY www/data-idref/ /usr/local/apache2/htdocs/

# Templates
COPY docker/.htaccess.template /usr/local/apache2/htdocs/.htaccess.template
COPY docker/yasgui.js.template  /usr/local/apache2/htdocs/js/yasgui.js.template

# Entrypoint
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Valeurs par défaut (à surcharger via docker-compose ou -e)
ENV VIRTUOSO_URL=http://localhost:8890
ENV SPARQL_PUBLIC_ENDPOINT=http://localhost/sparql

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["httpd-foreground"]
