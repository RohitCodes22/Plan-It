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


def send_email(message: object) -> int:
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_SERVER, PORT, context=context) as server:
            server.login(EMAIL_ADDRESS, PASSWORD)
            server.send_message(message)
        return 0
    except:
        print("SOMETHING WENT WRONG WHEN SENDING YOUR EMAIL!")
        print(f"Destination: {receiver_email}")
        print(f"Contents: {message}")

        return -1

def generate_subscribed_event_email(event_data: list, user_id: int) -> object:
    """
    Given an event's relevant data, create an email informing a subscribed user
    that the event will be re-occurring 

    event_data: {
        name: str,
        description: str,
        date: str

    }
    """
    # get user's real name and email
    user_name = "Sean"
    user_email = "swy62@umsystem.edu"

    # populate this with actual event data
    body = f"""\
    <html>
        <body>
            <p>Hi {user_name},<br><br>
            
            Did you know some events you subscribed to are happening soon?<br>
            Here's a quick rundown:
            </p>

            <ol>
                <li>
                    <p>Rohit's database reveal (12/21/2025)</p>
                </li>
            </ol>
        </body>
    </html>

    """
    msg = MIMEText(body, "HTML")
    msg["Subject"] = f"{user_name}, subscribed events happening soon!"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = user_email

    return msg

if __name__ == "__main__":

    send_email(generate_subscribed_event_email([], 0))
        
