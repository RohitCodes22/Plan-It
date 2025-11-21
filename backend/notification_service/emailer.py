import smtplib, ssl
import os
from email.mime.text import MIMEText

def get_password() -> str:
    return os.getenv("PLAN_IT_PASSWORD")[1:-1]

# constants
PORT = 465
PASSWORD = get_password()
SMTP_SERVER = "smtp.gmail.com"
EMAIL_ADDRESS = "planit.notificationbot@gmail.com"

test_message = """
Subject: New events in your area!

Rohit's very epic birthday party! (5.1 mi.)
"""


def send_email(receiver_email: str, message: str) -> None:
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(SMTP_SERVER, PORT, context=context) as server:
        print(f"username: {EMAIL_ADDRESS}, password: {PASSWORD}")
        server.login(EMAIL_ADDRESS, PASSWORD)
        server.sendmail(EMAIL_ADDRESS, receiver_email, message)

if __name__ == "__main__":

    send_email("swy62@umsystem.edu", test_message)
        
