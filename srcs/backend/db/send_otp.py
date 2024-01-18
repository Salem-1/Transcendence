from django.core.mail import EmailMessage, send_mail
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os


class Response:
    def __init__(self, status_code):
        self.status_code = status_code

def send_otp_email(reciever, otp):
    return (send_smtp_email(reciever, otp))

# def send_sendgrid_email(reciever, otp):
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

def send_smtp_email(reciever, otp):
    sent = send_mail(
    'Pong one time password',
    f"your otp is {otp}",
    os.environ.get("EMAIL_HOST_USER"),
    [reciever],
    fail_silently=False,
    )
    if sent:
        return email_logging(reciever, otp, 202)
    else:
        return email_logging(reciever, otp, 401)
        
    # email = EmailMessage(
    #    'Hello',
    #    'Hello from the other side',
    #    'pong@alqanaha.com',
    #    ['pong@null.net'],
    # )
    # email.send()

def email_logging(reciever, otp, sent):
    if sent:
        message =  "Email sent 😃"
    else:
        message =  "Failed to send 🥲"
    file_path = 'backend_tests/email_logs.txt'
    with open(file_path, "a+") as file:
        file.write(f"{message} {reciever} ----> {otp}\n")
    response = Response(sent)
    return response

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