// test.js

async function testLogin() {
  try {
    const response = await fetch(`http://localhost:80/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // VERY IMPORTANT for Flask session cookies
      body: JSON.stringify({
        username: "spiderhit",
        password: "pass", // ignored by backend unless implemented
      }),
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function testSignup() {
  try {
    const response = await fetch("http://localhost:80/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "joesy",
        fname: "a",
        lname: "b",
        email: "c@example.com",
        password: "mypassword123",
      }),
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function testGetEvents() {
  try {
    const response = await fetch(`http://localhost/user/get_user_events/spiderhit`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Parsed JSON:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testLogin()
testGetEvents();

//testSignup();
