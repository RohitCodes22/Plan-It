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
        
        print(user)
        
        if not user:
            print("error getting user")
            return False
        
        self.username = user.get("username")
        self.fname = user.get("fname")
        self.lname = user.get("lname")
        self.email = user.get("email")
        self.id = user.get("id")
        
    

        
class Moderator(User):
    pass

class Admin(User):
    pass
        
