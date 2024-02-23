import os
import base64
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Replace with the path to your credentials JSON file
credentials_file = './service-key.json'

# Your Gmail address
sender_email = "pong42abudhabi@gmail.com"
# The recipient's email address
recipient_email = "pong@null.net"
# Email subject
email_subject = "Test Email for otp service"
# Email body
email_body = "This is a test email sent using the Gmail API, your otp is <000000>"

def create_service():
    creds = service_account.Credentials.from_service_account_file(
        credentials_file,
        scopes=['https://www.googleapis.com/auth/gmail.send']
    )
    service = build('gmail', 'v1', credentials=creds)
    return service

def create_message(sender, to, subject, body):
    message = f"From: {sender}\nTo: {to}\nSubject: {subject}\n\n{body}"
    raw_message = base64.urlsafe_b64encode(message.encode("utf-8")).decode("utf-8")
    return {'raw': raw_message}


def send_message(service, sender, to, subject, body):
    message = create_message(sender, to, subject, body)
    try:
        message = service.users().messages().send(userId=sender_email, body=message).execute()
        return message
    except Exception as error:
        print(f"An error occurred: {error}")


def main():
    service = create_service()
    send_message(service, sender_email, recipient_email, email_subject, email_body)

if __name__ == '__main__':
    main()
