
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

def send_otp_email(reciever, otp):
    message = Mail(
        from_email='pong@null.net',
        to_emails=reciever,
        subject='Pong otp ',
        html_content=f"<h4>your one time password is  {otp}</h4> ")
    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    response = sg.send(message)
    return (response)

try:
    send_otp_email("pong@null.net", "<this is test otp>")
except Exception as e:
    print(e)