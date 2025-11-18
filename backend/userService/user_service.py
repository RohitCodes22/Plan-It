import databaseService

class User:
    def __init__(self, username, fname, lname, email):
        self.username = username
        self.fname = fname
        self.lname = lname
        self.email = email
        
class Moderator(User):
    pass

class Admin(User):
    pass
        

def get_user_information(user_id):
    databaseService.retrieve_table("user")