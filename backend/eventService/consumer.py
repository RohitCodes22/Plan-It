import confluent_kafka
import json
import event_service

CONSUMER = confluent_kafka.Consumer({
    "bootstrap.servers": "kafka:9092",
    "group.id": "backend-service",
    "auto.offset.reset": "earliest"
})

CONSUMER.subscribe(["create_event"])
print("Event handler thread started ....")

while True:
    incoming_msg = CONSUMER.poll(1.0)
    if not incoming_msg:
        continue
    elif incoming_msg.error():
        print("ERROR detected")
        continue

    event = json.loads(incoming_msg.value().decode("utf-8"))
    topic = incoming_msg.topic()
    print(f"received event: {event} under topic: {topic}")

    # go through possible event topics
    if topic == "create_event":
        event_service.create_event(event["name"], [])
        print("Event created!")
    else: # does not match any known event topics
        print(f"ERROR: unknown event topic passed in: {topic}")
    
    print(f"received event: {event}")