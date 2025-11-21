import databaseService

def create_event(name: str, tags: list, description=""):
    event_obj = {
        "id": 0, # TODO: get this later
        "name": name,
        "tags": tags,
        "description": description,
        "attendees": [],
        "comments": []
    }

    databaseService.write_to_db(event_obj)


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
