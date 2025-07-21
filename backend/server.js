import express from "express";
import 'dotenv/config';
import axios from "axios";
import session from 'express-session';
import cors from 'cors';
import { getAuth, getGitHubUserProfile, getPR, getPRDiffs, getPRStats, getReview, getUserPRs } from "./api/oAuth.js";


// import express from "express";
// console.log("✅ Imported express");

// import 'dotenv/config';
// console.log("✅ Loaded .env");

// import axios from "axios";
// console.log("✅ Imported axios");

// import { getAuth, getGitHubUserProfile, getPR, getReview } from "./api/oAuth.js";
// console.log("✅ Imported all route handlers");

const app = express();

app.use(express.json());



app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// app.get('/api/auth/github', getGithub);
// app.get('/api/auth/github/callback', getUsers);
app.get("/", (req, res) => {
    res.send("Hii");
});
app.get('/api/auth/github', (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
    res.redirect(redirectUri); // Redirect to GitHub login
});

app.post('/api/auth/get-accessToken', getAuth);
app.post("/api/auth/get-prs", getUserPRs);
app.post('/api/auth/getpr', getPR);
app.post('/api/auth/getreview', getReview);
app.post('/api/auth/get-user-details',getGitHubUserProfile);
app.post('/api/auth/get-pr-stats', getPRStats);
app.post('/api/auth/getFileChanges', getPRDiffs);


const PORT =  9000;
console.log("✅ Server file starting...");

try {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Listening on port ${PORT}...`);
  });

  server.on("error", (err) => {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  });
} catch (err) {
  console.error("❌ Synchronous error during server start:", err);
}
