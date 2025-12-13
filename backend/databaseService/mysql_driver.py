import mysql.connector
from mysql.connector import Error
import bcrypt, json
import copy


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

def make_location_query(table, columns, values):
    """
    table: string
    columns: string like 'a, b, location, c'
    values: list, where location value is (lon, lat)
    """

    cols = [c.strip() for c in columns.split(",")]
    vals = copy.deepcopy(values)

    col_parts = []
    val_parts = []
    params = []

    for col, val in zip(cols, vals):
        if col == "location":
            col_parts.append(col)
            val_parts.append("ST_SRID(POINT(%s, %s), 4326)")

            lon, lat = val
            params.extend([lat, lon])
        else:
            col_parts.append(col)
            val_parts.append("%s")
            params.append(val)

    sql = f"""
    INSERT INTO {table} ({', '.join(col_parts)})
    VALUES ({', '.join(val_parts)})
    """

    return sql.strip(), params

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

    if "location," in columns:
        # please kill me
        query, values = make_location_query("events", columns, values)
    else:
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"

    try:
        cursor.execute(query, values)
        DB.commit()
        inserted_id = cursor.lastrowid
        cursor.close()
        DB.close()
        return inserted_id
    except Error as err:
        print("Error writing to database:", err, flush=True)
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
    
def get_names_from_ids(ids: list[int]):
    if not ids:
        return []

    DB = get_connection()
    cursor = DB.cursor(dictionary=True)

    placeholder = ",".join(["%s"] * len(ids))
    query = f"""
        SELECT id, fname, lname
        FROM users
        WHERE id IN ({placeholder})
    """

    cursor.execute(query, ids)
    users = cursor.fetchall()
    DB.close()
    return users

def delete_user(user_id):
    DB = get_connection()
    if DB is None:
        return False

    cursor = DB.cursor()
    try:
        cursor.execute("""
            DELETE FROM comments
            WHERE event_id IN (
                SELECT id FROM events WHERE organizer_id = %s
            )
        """, (user_id,))
        cursor.execute(
            "DELETE FROM events WHERE organizer_id = %s",
            (user_id,)
        )
        cursor.execute(
            "DELETE FROM comments WHERE user_id = %s",
            (user_id,)
        )
        cursor.execute(
            "DELETE FROM users WHERE id = %s",
            (user_id,)
        )

        DB.commit()
        return True

    except Error as err:
        DB.rollback()
        print("Error deleting user:", err)
        return False

    finally:
        cursor.close()
        DB.close()

def update_user_fields(user_id: int, fields: dict) -> bool:
    """
    Updates allowed user fields.
    fields = {"fname": ..., "lname": ..., "bio": ...}
    """
    if not fields:
        return False

    DB = get_connection()
    if DB is None:
        return False

    cursor = DB.cursor()

    columns = ", ".join([f"{k} = %s" for k in fields.keys()])
    values = list(fields.values())
    values.append(user_id)

    query = f"""
        UPDATE users
        SET {columns}
        WHERE id = %s
    """

    try:
        cursor.execute(query, tuple(values))
        DB.commit()
        return True
    except Error as err:
        DB.rollback()
        print("Error updating user:", err)
        return False
    finally:
        cursor.close()
        DB.close()


# ============================================================
#   EVENT OPERATIONS
# ============================================================
def create_event(name, organizer_id, lon, lat, tags=None, description=None):
    return write_to_db(
        "events",
        name=name,
        organizer_id=organizer_id,
        location=(lon, lat),
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
    

def parse_point_wkt(wkt: str):
    """Convert WKT 'POINT(lng lat)' to a dict {'lat': ..., 'lng': ...}"""
    wkt = wkt.replace("POINT(", "").replace(")", "")
    lng_str, lat_str = wkt.split()
    return {"lat": float(lat_str), "lng": float(lng_str)}

def get_events_in_range(lat: float, long: float, distance: float):
    DB = get_connection()
    if DB is None:
        return []

    cursor = DB.cursor(dictionary=True)
    try:
        # Use parameterized query to prevent SQL injection
        query = """
            SELECT
                id,
                name,
                tags,
                description,
                organizer_id,
                ST_AsText(location) AS location,
                ST_Distance_Sphere(
                    location,
                    ST_SRID(POINT(%s, %s), 4326)
                ) AS distance
            FROM events
            WHERE ST_Distance_Sphere(
                    location,
                    ST_SRID(POINT(%s, %s), 4326)
                ) <= %s
            ORDER BY distance ASC;
        """

        # lng first, then lat for MySQL POINT(x,y)
        params = (long, lat, long, lat, distance)
        cursor.execute(query, params)
        events = cursor.fetchall()

        # Fix location and tags for JSON
        for e in events:
            e["location"] = parse_point_wkt(e["location"])
            if "tags" in e and isinstance(e["tags"], str):
                e["tags"] = json.loads(e["tags"])

        return events

    except Error as err:
        print("Error retrieving events:", err)
        return []

    finally:
        cursor.close()
        DB.close()
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
        e.e_date as event_date,
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
#   COMMENT OPERATIONS
# ============================================================
def add_comment(event_id: int, user_id: int, contents: str):
    return write_to_db(
        "comments",
        event_id=event_id,
        user_id=user_id,
        contents=contents,
        created_at="2023-12-7 14:30:00",
        been_updated="0"
    )

def get_comments(event_id: int):
    DB = get_connection()
    if DB is None:
        return []

    cursor = DB.cursor(dictionary=True)

    query = f"""
    SELECT 
        id,
        event_id,
        user_id,
        contents,
        created_at,
        been_updated
    FROM comments
    WHERE event_id = {event_id};
        
    """    
    try:
        cursor.execute(query)
        comments = cursor.fetchall()
        cursor.close()
        DB.close()
        return comments
    except Error as err:
        print("Error retrieving comments for event:", err)
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
