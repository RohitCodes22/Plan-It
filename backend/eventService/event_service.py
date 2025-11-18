
def create_event(name: str, tags: list, description=""):
    event_obj = {
        id: 0, # TODO: get this later
        name: name,
        tags: tags,
        description: description,
        attendees: [],
        comments: []
    }

    # TODO: modify the databse

def update_event(field: str, value: any):
    pass

def delete_event():
    pass