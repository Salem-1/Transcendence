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
python manage.py migrate
python manage.py makemigrations db
python manage.py migrate db

# Create superuser
# echo "Creating superuser"
# check if superuser already exists

cat << EOF | python manage.py shell
from django.contrib.auth import get_user_model

User = get_user_model()

User.objects.filter(username='admin').exists() or \
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
EOF

python manage.py runserver 0.0.0.0:8000
