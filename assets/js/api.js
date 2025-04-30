import { titleCase } from "./utils.js";

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

// Fetch Transaction Table Data
async function fetchTransactions() {
    const token = localStorage.getItem('jwt');

    if (!token) {
        console.error("No JWT found. Cannot fetch transactions.");
        return null;
    }

    const query = `
        query {
            transaction {
                id
                type
                amount
                objectId
                createdAt
                path
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

        console.log("🔍 Full Transaction Data:", data.data.transaction);
        console.log("🧐 All Transaction Types:", [...new Set(data.data.transaction.map(tx => tx.type))]); // Check unique transaction types
        return data.data.transaction;
    } catch (error) {
        console.error("Error fetching transaction data:", error);
        return null;
    }
}

// Calculate Audit ratio
async function calculateAuditRatio() {
    const transactions = await fetchTransactions(); // Get all transaction data
    if (!transactions) {
        console.error("No transactions data available.");
        return null;
    }

    // ✅ Get XP Done (up) and XP Received (down) like the original method
    const doneXP = transactions
        .filter(tx => tx.type === "up")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const receivedXP = transactions
        .filter(tx => tx.type === "down")
        .reduce((sum, tx) => sum + tx.amount, 0);

    // ✅ Log raw XP values before formatting
    console.log(`🧐 Restored XP Values: Done = ${doneXP}, Received = ${receivedXP}`);

    // ✅ Convert XP amounts to formatted MB or KB
    const doneFormatted = formatSize(doneXP);
    const receivedFormatted = formatSize(receivedXP);

    // ✅ Calculate Audit Ratio Using Simple Formula
    const auditRatio = receivedXP > 0 ? (doneXP / receivedXP) : 0;

    // ✅ Log in the correct format
    console.log(`🔍 Audits ratio`);
    console.log(`Done: ${doneFormatted} ↑`);
    console.log(`Received: ${receivedFormatted} ↓`);
    console.log(`${auditRatio.toFixed(1)}`);
    console.log(`Best ratio ever!`);

    return { auditRatio, doneFormatted, receivedFormatted };
}



// Convert XP amount to MB/KB and return formatted string
function formatSize(amount) {
    const mb = amount / (1024 * 1024);
    if (mb >= 1) {
        return `${(Math.round((mb + Number.EPSILON) * 10) / 10).toFixed(1)} MB`; // ✅ Fix floating-point rounding
    }
    const kb = amount / 1024;
    return `${kb.toFixed(0)} kB`; // ✅ Convert to KB if < 1MB
}


// Load user info when profile.html is loaded
document.addEventListener("DOMContentLoaded", async () => {
    const user = await fetchUserData();
    if (user) {
        const welcomeMsg = document.getElementById("welcome-msg");
        welcomeMsg.innerText = `Welcome, ${titleCase(user.login)}!`;

        let userInfo = document.getElementById("user-info");

        const phone = user.attrs?.tel || "No phone available";
        const email = user.attrs?.email || "No email available";

        userInfo.innerHTML = `
        <p>Contact Details:</p>
        <span>📞 ${phone} | 📧 ${email}</span>
        `;

    } else {
        document.getElementById("user-info").innerText = "Failed to load user data.";
    }
    await fetchTransactions();
    const auditData = await calculateAuditRatio();

    if (auditData) {
        const auditInfo = document.getElementById("audit-info");
        auditInfo.innerHTML = `
        <h3>Audits Ratio ${auditData.auditRatio.toFixed(1)}</h3>
        <div class="audit-stats">
            <p><b>Done:</b> <i>${auditData.doneFormatted}</i> ⬆️</p>
            <p><b>Received:</b> <i>${auditData.receivedFormatted} 📥</i></p>
        </div>
    `;
    }
});

// Make function available globally
window.fetchUserData = fetchUserData;
window.fetchTransactions = fetchTransactions;
window.calculateAuditRatio = calculateAuditRatio;
