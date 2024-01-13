from django.core.mail import EmailMessage, send_mail
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

def send_test_email(reciever, name):
    message = Mail(
        from_email='pong@null.net',
        to_emails=reciever,
        subject='Transcnedence otp test email',
        html_content=f"<strong>Asslamo Alikom ya {name}, This is message is sent by our django server</strong>")
    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    response = sg.send(message)
    print(response.status_code)
    print(response.body)
    print(response.headers)


def send_smtp_email():
    send_mail(
    'Subject',
    'Message Body',
    'pong@null.net',
    ['pong@null.net'],
    fail_silently=False,
    )
    
    # email = EmailMessage(
    #    'Hello',
    #    'Hello from the other side',
    #    'pong@null.net',
    #    ['pong@null.net'],
    # )
    # email.send()

"""
    Bism Ellah
    OTP logic:
        1-enable_otp: asks for email
        2-set secret in the backend
        3-send otp to the email
        4-Prompot for otp
        5-if otp okay set otp to true in the backend
        6-congratulate the user 
        7-if false, show error and close alert back to home page
        8-upon login, send otp to the recorded email
        9-prompt for otp as usal 
        10-celebrate

"""