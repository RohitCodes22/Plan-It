import databaseService

USER_DB_TABLE = "users"

class User:
    def __init__(self, key: str, value):        
        '''
        Args: 
            key (str): primary key used to identify user
            value: value searching for
        '''
        users = databaseService.retrieve_table(USER_DB_TABLE)
        
        if not users:
            print("Error retriving users from db")
            return None
        
        user = next(filter(lambda u: u[key] == value, users), None)
        
        if not user:
            print("error getting user")
            return None
        
        self.populate_user_from_row(user)

    @classmethod
    def create_user(cls, username, fname, lname, email, password):
        """
        Creates a new user in the database, returns a User object.
        """

        encoded_pw = password# databaseService.encode_password(password)
        user_data = {
            "username": username,
            "fname": fname,
            "lname": lname,
            "email": email,
            "password": encoded_pw
        }

        # insert into db
        new_id = databaseService.write_to_db(USER_DB_TABLE, **user_data)

        if new_id is None:
            print("Error creating user")
            return None

        user_data["id"] = new_id
        user_obj = cls.__new__(cls)
        user_obj.populate_user_from_row(user_data)

        return user_obj


    def verify_password(self, password):
        return password == databaseService.decode_password("", self.encoded_password)
    
    def populate_user_from_row(self, user):
        self.username = user.get("username")
        self.fname = user.get("fname")
        self.lname = user.get("lname")
        self.email = user.get("email")
        self.id = user.get("id")
        self.encoded_password = user.get("password")
        
    def user_info_to_json_struct(self):
        info = {
            "username": self.username,
            "fname": self.fname,
            "lname": self.lname,
            "email": self.email,
        }
        
        return info
    
    def get_user_events(self):
        events = databaseService.get_user_events(self.id)
        return events        
        
    def delete_user(self):
        databaseService.delete_user(self.id)

        
class Moderator(User):
    pass

class Admin(User):
    pass
        
        

