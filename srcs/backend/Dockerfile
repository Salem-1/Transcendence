# Use an official Python runtime as the base image
FROM python:3.12.1-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the project dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project code into the container
COPY . .

# Set the environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port on which the Django app will run
EXPOSE 8000

# Run the Django development server
CMD ["/bin/sh", "entrypoint.sh"]
