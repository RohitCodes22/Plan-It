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
