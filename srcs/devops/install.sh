#!/bin/bash

#those are the installation command I used for your refrences
#creating python virtual environment
python -m venv env 
source env/bin/activate #if you use windows env/scripts/activate

pip install django
pip freeze > requirements.txt #

django-admin startproject backend #create new django project

python manage.py startapp db   #create databse files in django project
python manage.py runserver  # you can visit the project from the default localhost:8000


#donw load and install postgresql from ->>https://postgresapp.com/downloads.html
#configure path to use command line tool
sudo mkdir -p /etc/paths.d &&
echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp

python -m pip install psycopg2-binary

#apply the database migration 

cd backend
python manage.py migrate

python manage.py createsuperuser
pip install django-cors-headers












#trash
# #installing postgres, we will have to do this in a contianer later inshalla
# brew install postgresql@15 
# brew install --cask pgadmin4 #for the admin panel installation 
# open /Applications/pgAdmin\ 4.app #open postgresql desktop