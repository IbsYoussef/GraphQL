const API_URL = "https://learn.01founders.co/api/auth/signin";

// Function to login
async function login(username, password) {
    // 
    const encodedCredentials = btoa(`${username}:${password}`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Basic ${encodedCredentials}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Invalid credentials. Please try again.');
        }

        const token = await response.json(); // JWT received from the server
        localStorage.setItem('jwt', token);
        window.location.assign('profile.html');
    } catch (error) {
        alert(error.message); // Display error message
    }
}

// Function to check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        console.log("User not authenticated. Redirecting to login...");
        window.location.assign("index.html"); // Redirect to login page if not authenticated
    }
}

// Function to logout
function logout() {
    console.log("Logging out...");
    localStorage.removeItem('jwt'); // Remove JWT
    window.location.assign("index.html"); // Redirect to login page
}

window.logout = logout;
window.checkAuth = checkAuth;