from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

uri_rohit = os.getenv("MONGO_URI_ROHIT")
uri_colin = os.getenv("MONGO_URI_COLIN")
uri_sean = os.getenv("MONGO_URI_SEAN")

client_rohit = MongoClient(uri_rohit)
client_colin = MongoClient(uri_colin)
client_sean = MongoClient(uri_sean)

db_rohit = client_rohit.get_database()
db_colin = client_colin.get_database()
db_sean = client_sean.get_database()

# insert random data into the cluster to test the conenction
def insert_test_data():
    #add a table worth of information as a starter for each user
    test_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "tasks": [
            {"task": "Task 1", "completed": False},
            {"task": "Task 2", "completed": True}
        ]
    }
    # Insert into Rohit's database
    result = db_rohit.users.insert_one(test_data)
    #Do the same for Colin and Sean
    db_colin.users.insert_one(test_data)
    db_sean.users.insert_one(test_data)
    return result.inserted_id




if __name__ == "__main__":
    inserted_id = insert_test_data()
    print(f"Inserted test data with ID: {inserted_id}")


