#!/bin/sh

nc -z postgres 5432
while [ $? -ne 0 ]; do
    echo "Waiting for postgresql to be ready..."
    sleep 1
    nc -z postgres 5432
done

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
# echo "Creating superuser"
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'password123')" | python manage.py shell

python manage.py runserver 0.0.0.0:3000
