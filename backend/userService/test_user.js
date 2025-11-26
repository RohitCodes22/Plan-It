// test.js

async function testSignup() {
    try {
        const response = await fetch("http://localhost:80/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "testUser22",
                fname: "Test",
                lname: "User",
                email: "testuse22r@example.com",
                password: "mypassword123"
            })
        });

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Response:", data);

    } catch (err) {
        console.error("Error:", err);
    }
}

testSignup();
