Purpose: Authenticate users to access the GraphQL API using JWT.

## Requirements:
1) Use the signin endpoint (https://learn.01founders.co/api/auth/signin) to obtain the JWT token to access the GraphQL API.

-- Supply credentials in username:password or email:password format using Basic authentication (Base64-encoded).

2) Display an appropriate error message for invalid login attempts.

3) Implement JWT-based session management:
-- Store the token securely (e.g., localStorage).
-- Use the token with Bearer authentication for all GraphQL API requests.

4) Provide a logout method to clear the token and end the session.

Additional Notes:
When making GraphQL queries, you'll supply the JWT using Bearer authentication. It will only allow access to the data belonging to the authenticated user.
Inspect the JWT to retrieve the authenticated user's ID for further queries.