# Project Requirements

## Profile UI
1. Create Profile UI that displays data from GraphQL API endpoint ("https://learn.01founders.co/api/graphql-engine/v1/graphql")
2. Can use 3 Data types of choice from [User Identification, XP amount, Grades, Audits, Skills], Use SVG to display data

## Login
1. User info will require email:password or username:password
2. Authenticated with base64 encoding 
3. Authenticated users will then need a JWT from signin endpoint ("https://learn.01founders.co/api/auth/signin") to access GraphQL API for info
4. When making GraphQL queries a JWT will be supplied using Bearer Authentication

## Hosting
1. Use any hosting platform of choice to host project (i.e Netlify, Github Pages etc)