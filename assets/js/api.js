const GRAPHQL_ENDPOINT = "https://learn.01founders.co/api/graphql-engine/v1/graphql";

// Fetch User Data from endpoint
async function fetchUserData() {
    const token = localStorage.getItem('jwt');

    if (!token) {
        console.error("No JWT found. User not authenticated.");
        return null;
    }

    const query = `
        query {
            user {
                id
                login 
                attrs
            }
        }
    `;

    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.user[0];

    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

// Load user info when profile.html is loaded
document.addEventListener("DOMContentLoaded", async () => {
    const user = await fetchUserData();
    if (user) {
        let userInfo = document.getElementById("user-info");

        const phone = user.attrs?.tel || "No phone available";
        const email = user.attrs?.email || "No email available";

        userInfo.innerText = `Welcome, ${user.login}!
        📞 ${phone} | 📧 ${email}`;

    } else {
        document.getElementById("user-info").innerText = "Failed to load user data.";
    }
});

// Make function available globally
window.fetchUserData = fetchUserData;
