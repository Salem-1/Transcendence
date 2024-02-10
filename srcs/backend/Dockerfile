# Use an official Python runtime as the base image
FROM python:3.12.1-alpine

# Set the working directory in the container
RUN mkdir /app
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .
COPY backend_tests .
#add backend tests
# Install the project dependencies
RUN apk update \
  && apk add gcc libc-dev g++ libffi-dev libxml2 \
  && rm -rf /var/cache/apk/*
  
RUN  pip install --no-cache-dir -r requirements.txt

# Copy the project code into the container
COPY . .

RUN mkdir -p /app/backend/staticfiles
# Set the environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port on which the Django app will run
EXPOSE 443

# Run the Django development server
CMD ["/bin/sh", "entrypoint.sh"]
