import databaseService
import json

class Event:

    def __init__(self, name: str, tags: list, organizer_id: int, description: str):
        """
        Writing a new event to the database
        """
        self._name = name
        self._tags = tags
        self._published_by = organizer_id
        self._description = description

    @classmethod
    def read_event(cls, e_id: int):
        """
        Reading in from a the database
        """
        return databaseService.get_event_by_id(e_id)

    @classmethod
    def write_event(cls, name: str, tags: list, organizer_id: int, description: str):
        event_id = databaseService.write_to_db(
            "events",
            name=name,
            tags=tags, # jsonify this for the DB
            description=description,
            organizer_id=organizer_id
        )

        if not event_id:
            print(f"Error creating event '{name}'")
        else:
            print(f"success creating event '{name}'. New ID is {event_id}")

        return cls(name, tags, organizer_id, description)
    


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
    max_distance: float. Defined in meters
    num_events: int. If -1 then grab all applicable events
    """

    
    lat, long = user_locaton
    events_in_range = databaseService.get_events_in_range(lat, long, max_distance)
    events = list(filter(lambda event: any(tag in filters for tag in event.get("tags")), events_in_range))
    
    if num_events > 0:
        events = events[:num_events]
    
    return events

    # Write a MongoDB query to do this searching efficiently. I think MongoDB 
    # has built-in support for filtering based on distance, so should be easy


def get_events_within_distance(lat: float, long: float, distance: float):
    """
    Returns events that are within a set distance
    
    lat: latitude of request
    long: longitutde of request
    distance: straight line distance in meters
    """
    
    events = databaseService.get_events_in_range(lat, long, distance)
    return events
    


# for testing the file's functionality
if __name__ == "__main__":
    print("working!")
    # event = Event.write_event(
    #     "CS-4090 Work session", 
    #     ["not fun", "Mia", "CBT"], 
    #     1,
    #     "Join us as we try to wrap our feeble minds around low-cohesion databases"
    # )
    
    #print(get_events_within_distance(-91.77153, 37.948544, 5000))
    print(generate_event_feed(( 37.948544,-91.77153 ), "fun", 5000))