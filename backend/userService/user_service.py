import databaseService

class User:
    # def __init__(self, username, fname, lname, email, id):
    #     self.username = username
    #     self.fname = fname
    #     self.lname = lname
    #     self.email = email
    #     self.id = id
        
    def __init__(self, key: str, value):        
        '''
        Args: 
            key (str): primary key used to identify user
            value: value searching for
        '''
        users = databaseService.retrieve_table("user")
        user = next(filter(lambda u: u[key] == value, users), None)
        
        if not user:
            print("error getting user")
            return None
        
        self.populate_user_from_row(user)

    def verify_password(self, password):
        return password == databaseService.decode_password(self.encoded_password)
    
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
        
        
    

        
class Moderator(User):
    pass

class Admin(User):
    pass
        
