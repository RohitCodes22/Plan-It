from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

db = client.get_database()

# insert random data into the cluster to test the conenction
def insert_test_data():
    test_collection = db.test_collection
    test_data = {"name": "test", "value": 42}
    result = test_collection.insert_one(test_data)
    return result.inserted_id

if __name__ == "__main__":
    inserted_id = insert_test_data()
    print(f"Inserted test data with ID: {inserted_id}")


