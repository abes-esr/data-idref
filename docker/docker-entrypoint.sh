#!/bin/sh
set -e

# Generate .htaccess from template by substitute ${VIRTUOSO_URL}
envsubst '${VIRTUOSO_URL}' \
    < /usr/local/apache2/htdocs/.htaccess.template \
    > /usr/local/apache2/htdocs/.htaccess

# Generate yasgui.js from template by substitute ${SPARQL_PUBLIC_ENDPOINT}
envsubst '${SPARQL_PUBLIC_ENDPOINT}' \
    < /usr/local/apache2/htdocs/js/yasgui.js.template \
    > /usr/local/apache2/htdocs/js/yasgui.js

exec "$@"
