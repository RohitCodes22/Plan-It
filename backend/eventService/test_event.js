// test_event.js
// Run using:  node test_event.js

async function testNearbyEvents() {
  const lat = 37.948544; // Rolla, MO
  const lng = -91.77153; // Rolla, MO
  const distance = 5000; // meters (5 km)
  const filters = ["fun"];
  const url = `http://localhost:80/events/feed?lat=${lat}&lng=${lng}&distance=${distance}&filters=${filters}`;

  try {
    console.log("Calling:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Error response:", res.status, await res.text());
      return;
    }

    const data = await res.json();
    console.log("\n=== Nearby Events ===\n");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

async function testSignup() {
  try {
    const lat = 37.948544; // Rolla, MO
    const lng = -91.77153; // Rolla, MO
    const distance = 5000; // meters (5 km)
    const filters = ["fun"];

    const response = await fetch("http://localhost:80/events/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        max_distance: distance,
        filters: filters,
      }),
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

//testNearbyEvents();

testSignup()