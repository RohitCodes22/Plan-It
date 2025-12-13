def test_post_comment_success(client, mocker):
    mocker.patch("backend.main.databaseService.add_comment")

    res = client.post("/post_comment", json={
        "user_id": 1,
        "event_id": 1,
        "contents": "Nice event!"
    })

    assert res.status_code == 202


def test_post_comment_missing_fields(client):
    res = client.post("/post_comment", json={
        "user_id": 1
    })

    assert res.status_code == 400


def test_get_comments(client, mocker):
    mocker.patch("backend.main.databaseService.get_comments", return_value=[])

    res = client.get("/get_comments/1")

    assert res.status_code == 200
    assert res.json == []
