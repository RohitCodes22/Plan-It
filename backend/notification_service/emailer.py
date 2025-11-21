import smtplib, ssl
import jinja2
import os
from email.mime.text import MIMEText

def get_password() -> str:
    return os.getenv("PLAN_IT_PASSWORD")[1:-1]

# constants
PORT = 465
PASSWORD = get_password()
SMTP_SERVER = "smtp.gmail.com"
EMAIL_ADDRESS = "planit.notificationbot@gmail.com"


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

def generate_subscribed_event_email(events: list, user_id: int) -> object:
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
    user_name = "Colin"
    user_email = "cashpg@umsystem.edu"

    # populate this with actual event data
    body = """\
    <html>
        <body>
            <p>Hi {{user_name}},<br><br>
            
            Did you know some events you subscribed to are happening soon?<br>
            Here's a quick rundown:
            </p>

            <ol>
                {% for event in events %}
                    <li> 
                        {{event.name}}: {{event.date}}
                    </li>
                {% endfor %}
            </ol>
        </body>
    </html>
    """

    body_template = jinja2.Template(body)
    complete_body = body_template.render({
        "user_name": user_name,
        "events": events
    })

    msg = MIMEText(complete_body, "HTML")
    msg["Subject"] = f"{user_name}, Your Subscribed Events Are Happening Soon!"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = user_email

    return msg

if __name__ == "__main__":

    send_email(
        generate_subscribed_event_email([
            {"name": "Rohit's database reveal!", "date": "11/22/2025"},
            {"name": "Crumbl Cookie run", "date": "11/23/2025"},
            ], 0
        )
    )

        
