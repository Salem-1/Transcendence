#! /bin/sh

# replace INTRA-LINK in html with intra link
intra_link="https://api.intra.42.fr/oauth/authorize?client_id=$intra_client_id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code"
sed 's|INTRA-LINK|$intra_link|g' -i /var/www/html/landing_page.html

