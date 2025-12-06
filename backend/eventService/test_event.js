// test_event.js
// Run using:  node test_event.js

async function testNearbyEvents() {
  const lat = 37.948544;      // Rolla, MO
  const lng = -91.771530;     // Rolla, MO
  const distance = 5000;      // meters (5 km)

  const url = `http://localhost:80/events/nearby?lat=${lat}&lng=${lng}&distance=${distance}`;

  try {
    console.log("Calling:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
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

testNearbyEvents();
