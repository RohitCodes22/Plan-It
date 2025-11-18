import databaseService

class User:
    def __init__(self, username, fname, lname, email, id):
        self.username = username
        self.fname = fname
        self.lname = lname
        self.email = email
        self.id = id
        
    def __init__(self, user_id):
        users = databaseService.retrieve_table("user")
        user = next(filter(lambda u: u["id"] == user_id, users), None)
        
        if not user:
            print("error getting user")
            return False
        
        self.username = user.username
        self.fname = user.fname
        self.lname = user.lname
        self.email = user.email
        self.id = user.id
        
    

        
class Moderator(User):
    pass

class Admin(User):
    pass
        
