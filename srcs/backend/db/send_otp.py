from django.core.mail import EmailMessage, send_mail
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os


class Response:
    def __init__(self, status_code):
        self.status_code = status_code

def dummy_send_otp_email_till_fix_smtp_issue(reciever, otp):
    file_path = 'backend_tests/sent_dummy_emails.txt'
    with open(file_path, 'a') as file:
        file.write(f"{reciever} ----> {otp}\n")
    response = Response(202)
    return response

def send_otp_email(reciever, otp):
    return (dummy_send_otp_email_till_fix_smtp_issue(reciever, otp))
    # message = Mail(
    #     from_email='pong@null.net',
    #     to_emails=reciever,
    #     subject='Pong otp ',
    #     html_content=f"<h4>your one time password is  {otp}</h4> ")
    # sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    # response = sg.send(message)
    # return (response)

def not_valid_email(request_body):
    forbidden_chars = {"'", "\"", "\\", "#", "$", "%", 
                        "^", "&", "*", "(", ")", "!"}
    if (not request_body) or ("email" not  in request_body):
        return True
    email = request_body["email"]
    if (not email) or (len(email) < 5) or (len(email) > 80) \
            or email.find("@") < 1 or email.find(".") < 3 \
            or (any(char in forbidden_chars for char in email)):
        return True
    return False

def send_smtp_email():
    send_mail(
    'Subject',
    'Message Body',
    'rechat.noreply@gmail.com',
    ['pong@null.net'],
    fail_silently=False,
    )
    
    email = EmailMessage(
       'Hello',
       'Hello from the other side',
       'rechat.noreply@gmail.com',
       ['pong@null.net'],
    )
    email.send()

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