import confluent_kafka
import json
import userService

CONSUMER = confluent_kafka.Consumer({
    "bootstrap.servers": "kafka:9092",
    "group.id": "backend-service",
    "auto.offset.reset": "earliest"
})

CONSUMER.subscribe(["create_user"])
print("Event handler thread started ....", flush=True)

while True:
    incoming_msg = CONSUMER.poll(.5)
    if not incoming_msg:
        continue
    elif incoming_msg.error():
        print("ERROR detected", flush=True)
        continue
    
    event = json.loads(incoming_msg.value().decode("utf-8"))
    topic = incoming_msg.topic()
    print(f"received event: {event} under topic: {topic}", flush=True)

    # go through possible event topics
    if topic == "create_user":
        userService.User.create_user(event.get("username"), event.get("fname"), event.get("lname"), event.get("email"), event.get("password"))
        print("User added!", flush=True)
    else: # does not match any known event topics
        print(f"ERROR: unknown event topic passed in: {topic}", flush=True)
    
    print(f"received event: {event}")