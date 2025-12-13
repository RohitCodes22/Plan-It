def test_signup_missing_fields(client):
    res = client.post("/signup", json={
        "username": "testuser"
    })

    assert res.status_code == 400


def test_login_success(client, mocker):
    fake_user = mocker.Mock()
    fake_user.id = 1
    fake_user.verify_password.return_value = True

    mocker.patch("main.userService.User", return_value=fake_user)

    res = client.post("/login", json={
        "username": "testuser",
        "password": "password"
    })

    assert res.status_code == 200
    assert b"login successful" in res.data


def test_login_invalid_credentials(client, mocker):
    fake_user = mocker.Mock()
    fake_user.verify_password.return_value = False

    mocker.patch("main.userService.User", return_value=fake_user)

    res = client.post("/login", json={
        "username": "testuser",
        "password": "wrong"
    })

    assert res.status_code == 401


def test_delete_account_success(client, mocker):
    fake_user = mocker.Mock()
    mocker.patch("main.userService.User", return_value=fake_user)

    with client.session_transaction() as sess:
        sess["logged_in"] = True
        sess["user_id"] = 1

    res = client.delete("/delete_account")

    assert res.status_code == 200
