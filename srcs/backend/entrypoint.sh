#!/bin/sh

echo "Waiting for postgresql to be ready..."
nc -z postgres 5432
while [ $? -ne 0 ]; do
    sleep 1
    nc -z postgres 5432
done

echo "PostgreSQL is ready"

# Apply database migrations
python manage.py makemigrations
python manage.py migrate --noinput
python manage.py makemigrations db
python manage.py migrate db

python manage.py collectstatic --no-input --clear
# Create superuser
# echo "Creating superuser"
# check if superuser already exists

cat << EOF | python manage.py shell
from django.contrib.auth import get_user_model

User = get_user_model()

User.objects.filter(username='admin').exists() or \
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
EOF
gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3 --reload
