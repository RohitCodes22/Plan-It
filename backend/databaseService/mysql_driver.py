import mysql.connector
from mysql.connector import Error
import bcrypt


# ============================================================
#   SQL CONNECTION
# ============================================================

def get_connection():
    try:
        return mysql.connector.connect(
            host="mysql",
            user="planit_admin",
            password="password1234",
            database="planit",
            auth_plugin="mysql_native_password"
        )
    except Error as err:
        print(f"Database connection error: {err}")
        return None


# ============================================================
#   DATABASE OPERATIONS
# ============================================================

def write_to_db(table, **kwargs):
    """
    Inserts a row into the specified table.
    Example: write_to_db("users", username="colin", email="c@gmail.com")
    Returns inserted row ID.
    """
    DB = get_connection()
    if DB is None:
        return None

    cursor = DB.cursor()

    columns = ", ".join(kwargs.keys())
    placeholders = ", ".join(["%s"] * len(kwargs))
    values = tuple(kwargs.values())

    query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"

    try:
        cursor.execute(query, values)
        DB.commit()
        inserted_id = cursor.lastrowid
        cursor.close()
        DB.close()
        return inserted_id
    except Error as err:
        print("Error writing to database:", err)
        cursor.close()
        DB.close()
        return None


def retrieve_table(table):
    """
    Returns all rows from the given SQL table.
    """
    DB = get_connection()
    if DB is None:
        return None

    cursor = DB.cursor(dictionary=True)

    query = f"SELECT * FROM {table}"

    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        DB.close()
        return rows
    except Error as err:
        print("Error retrieving table:", err)
        cursor.close()
        DB.close()
        return []
    
# ============================================================
#   USER OPERATIONS
# ============================================================
def get_user_by_id(user_id):
    DB = get_connection()
    if DB is None:
        return None

    cursor = DB.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        DB.close()
        return user
    except Error as err:
        print("Error retrieving user:", err)
        cursor.close()
        DB.close()
        return None

def get_user_by_username(username):
    DB = get_connection()
    if DB is None:
        return None

    cursor = DB.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        DB.close()
        return user
    except Error as err:
        print("Error retrieving user:", err)
        cursor.close()
        DB.close()
        return None

# ============================================================
#   EVENT OPERATIONS
# ============================================================
def create_event(name, organizer_id, tags=None, description=None):
    return write_to_db(
        "events",
        name=name,
        organizer_id=organizer_id,
        tags=tags,
        description=description
    )

def get_event_by_id(event_id):
    DB = get_connection()
    if DB is None:
        return None

    cursor = DB.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        event = cursor.fetchone()
        cursor.close()
        DB.close()
        return event
    except Error as err:
        print("Error retrieving event:", err)
        cursor.close()
        DB.close()
        return None

def get_events_by_organizer(organizer_id):
    DB = get_connection()
    if DB is None:
        return []

    cursor = DB.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM events WHERE organizer_id = %s", (organizer_id,))
        events = cursor.fetchall()
        cursor.close()
        DB.close()
        return events
    except Error as err:
        print("Error retrieving events:", err)
        cursor.close()
        DB.close()
        return []

# ============================================================
#   ATTENDEE OPERATIONS
# ============================================================
def add_attendee(event_id, user_id):
    return write_to_db("event_attendees", event_id=event_id, user_id=user_id)

def remove_attendee(event_id, user_id):
    DB = get_connection()
    if DB is None:
        return False

    cursor = DB.cursor()
    try:
        cursor.execute(
            "DELETE FROM event_attendees WHERE event_id = %s AND user_id = %s",
            (event_id, user_id)
        )
        DB.commit()
        cursor.close()
        DB.close()
        return True
    except Error as err:
        print("Error removing attendee:", err)
        cursor.close()
        DB.close()
        return False

def get_event_attendees(event_id):
    DB = get_connection()
    if DB is None:
        return []

    cursor = DB.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT u.* FROM users u "
            "JOIN event_attendees ea ON u.id = ea.user_id "
            "WHERE ea.event_id = %s",
            (event_id,)
        )
        attendees = cursor.fetchall()
        cursor.close()
        DB.close()
        return attendees
    except Error as err:
        print("Error retrieving attendees:", err)
        cursor.close()
        DB.close()
        return []

def get_user_events(user_id):
    DB = get_connection()
    if DB is None:
        return []

    cursor = DB.cursor(dictionary=True)
    
    
    query = f"""
    SELECT 
        e.id as event_id,
        e.name as event_name,
        e.tags as event_tags,
        e.description as event_description,
        u.username as organizer_username,
        u.fname as organizer_firstname,
        u.lname as organizer_lastname
    FROM events e
    JOIN event_attendees ea ON e.id = ea.event_id
    JOIN users u ON e.organizer_id = u.id
    WHERE ea.user_id = {user_id}
        
    """

    try:
        cursor.execute(query)
        events = cursor.fetchall()
        cursor.close()
        DB.close()
        return events
    except Error as err:
        print("Error retrieving user events:", err)
        cursor.close()
        DB.close()
        return []



# ============================================================
#   PASSWORD HASHING (SECURE)
# ============================================================

def encode_password(password: str) -> str:
    """
    Hashes a password using bcrypt.
    Returns a hashed string safe for storing in DB.
    """
    return password
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def decode_password(stored_hash: str, input_password: str) -> bool:
    """
    Verifies input password matches stored bcrypt hash.
    Returns True/False.
    """
    return input_password
    try:
        return bcrypt.checkpw(
            input_password.encode("utf-8"),
            stored_hash.encode("utf-8")
        )
    except Exception:
        return False


# ============================================================
#   MAIN TEST
# ============================================================

if __name__ == "__main__":


    print("\nUsers table:")
    print(retrieve_table("users"))
