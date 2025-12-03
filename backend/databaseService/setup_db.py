import mysql.connector

DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "planit_admin",
    "password": "password1234",
    "database": "planit",
    "auth_plugin": "mysql_native_password"
}

def run_sql_file(path):
    """
    Reads and executes a .sql file against the MySQL database.
    """
    with open(path, "r", encoding="utf-8") as f:
        sql_commands = f.read()

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        for command in sql_commands.split(";"):
            if command.strip():
                cursor.execute(command)

        conn.commit()
        cursor.close()
        conn.close()
        print(f"Executed: {path}")

    except mysql.connector.Error as err:
        print(f"Error executing {path}: {err}")


def init_db():
    """Creates database tables."""
    run_sql_file("init_db.sql")


def populate_fake_data():
    """Inserts fake users, events, tasks."""
    run_sql_file("populate_fake_data.sql")


def setup_database():
    """
    Completely resets database by:
    1. Dropping & recreating tables
    2. Inserting fake sample data
    """
    print("Initializing database schema...")
    init_db()

    print("Populating fake data...")
    populate_fake_data()

    print("Database setup complete!")


if __name__ == "__main__":
    setup_database()
