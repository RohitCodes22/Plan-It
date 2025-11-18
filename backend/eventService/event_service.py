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