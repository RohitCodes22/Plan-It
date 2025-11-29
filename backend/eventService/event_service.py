from databaseService import mysql_driver
import json

class Event:
    def __init__(self, name: str, tags: list, published_by: str, description: str):
        self._name = name
        self._tags = tags
        self._published_by = published_by
        self._description = description


def create_event(name: str, tags: list, description=""):
    """
    Takes relevant data and initializes an event in the Events table
    """
    mysql_driver.write_to_db("Events",
        name=name,
        tags=json.dumps(tags),
        description=description
    )

def update_event(user_id: int, field: str, value: any):
    TABLE = "event"
    table = databaseService.retrieve_table(TABLE)

    item = None
    for i in range(len(table)):
        if table[i]["id"] == user_id:
            item = table[i]
            break
    
    item[field] = value

    databaseService.write_to_db()
   
            
def delete_event(id: int):
    pass

def generate_event_feed(user_locaton: tuple, filters: set, max_distance: float, num_events = -1) -> list:
    """
    Generates a list of local events based on a user location and a set of 
    inclusive filters

    user_location: (latitude: float, longitude: float),
    filters: set of string filters based on event-coordinator-defined tags
    max_distance: float. Defined in miles
    num_events: int. If -1 then grab all applicable events
    """

    pass

    # Write a MongoDB query to do this searching efficiently. I think MongoDB 
    # has built-in support for filtering based on distance, so should be easy


# for testing the file's functionality
if __name__ == "__main__":
    create_event("Rohit's Foot Appointment", ["fun", "important"], "BRUH")