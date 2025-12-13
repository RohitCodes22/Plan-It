def login_session(client):
    with client.session_transaction() as sess:
        sess["logged_in"] = True
        sess["user_id"] = 1


def test_create_event(client, mocker):
    login_session(client)

    mocker.patch("backend.main.databaseService.create_event")

    res = client.post("/create_event", json={
        "name": "Test Event",
        "organizer_id": 1,
        "location": {
            "latitude": 37.9,
            "longitude": -91.7,
            "srid": 4326
        },
        "tags": ["test"],
        "description": "desc"
    })

    assert res.status_code == 200


def test_attend_event(client, mocker):
    login_session(client)

    mocker.patch("backend.main.databaseService.add_attendee")

    res = client.post("/attend_event/1")

    assert res.status_code == 200


def test_get_all_events(client, mocker):
    mocker.patch("backend.main.eventService.get_all_events", return_value=[])

    res = client.get("/get_event/all")

    assert res.status_code == 200
    assert res.json == []


def test_event_feed(client, mocker):
    mocker.patch(
        "backend.main.eventService.generate_event_feed",
        return_value=[]
    )

    res = client.post("/events/feed", json={
        "latitude": 37.9,
        "longitude": -91.7,
        "filters": [],
        "max_distance": 5000
    })

    assert res.status_code == 200
