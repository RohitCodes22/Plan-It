import mysql.connector 

try:
    DB = mysql.connector.connect(
        host="127.0.0.1",
        user="planit_admin",
        password="password1234",
        database="planit",
        auth_plugin="mysql_native_password"
    )
except mysql.connector.Error as err:
    print(f"{err} (contact Rohit Sayeeganesh for help)")