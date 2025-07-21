import express from "express";
import axios from "axios";

import { graphql } from '@octokit/graphql';

export const getAuth = async (req, res,) => {
      const {code} = req.body;

      if(!code) return res.status(400).json({"error" : "No or Invalid code"});

      try {
         const tokenRes = await axios.post("https://github.com/login/oauth/access_token", {
             client_id: process.env.GITHUB_CLIENT_ID,
             client_secret: process.env.GITHUB_CLIENT_SECRET,
             code: code
         }, {
             headers: { Accept: "application/json" }
         });
 
         const accessToken = tokenRes.data.access_token;
         
         if (!accessToken) return res.status(400).send("Failed to get access token.");
 
          res.status(200).json({"data" : {
            "access_token" : accessToken,
            "type" : "bearer",
            "code" : code
          }});
     } catch (error) {
         console.error("Token Exchange Error:", error);
         res.status(500).send("Failed to exchange code for access token.");
     }
}


const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

export const getPR = async (req, res) => {
     
    const {username, accessToken} = req.body;

  try {

    if (!accessToken) {
    return res.status(400).json({ error: "Missing accessToken" });
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${accessToken}`,
    },
  });


    const response = await graphqlWithAuth(`
      query ($searchQuery: String!) {
        search(query: $searchQuery, type: ISSUE, first: 100) {
          nodes {
            ... on PullRequest {
              title
              url
              state
              createdAt
              mergedAt
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    `, {
      searchQuery: `type:pr author:${username}`
    });

    res.json({
      user: username,
      pullRequests: response.search.nodes,
    });

  } catch (err) {
    console.error("GraphQL Error:", err);
    res.status(500).json({ error: "Failed to fetch pull requests" });
  }
}

export const getReview = async (req, res) => {
  const { owner, repo, prnum, accessToken } = req.body;

  try {


    if (!accessToken) {
    return res.status(400).json({ error: "Missing accessToken" });
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${accessToken}`,
    },
  });

  
    const query = `
      query($owner: String!, $repo: String!, $prNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          pullRequest(number: $prNumber) {
            title

            reviews(first: 100) {
              nodes {
                author { login }
                body
                state
                submittedAt
                comments(first: 100) {
                  nodes {
                    body
                    path
                    position
                    createdAt
                    author {
                      login
                    }
                  }
                }
              }
            }

            reviewRequests(first: 100) {
              nodes {
                requestedReviewer {
                  ... on User {
                    login
                  }
                }
              }
            }

            comments(first: 100) {
              nodes {
                author { login }
                body
                createdAt
              }
            }
          }
        }
      }
    `;

    const response = await graphqlWithAuth(query, {
      owner,
      repo,
      prNumber: parseInt(prnum, 10),
    });

    const pr = response.repository.pullRequest;
    let ar = [];
    pr.reviews.nodes.map((r, index) => {
        
        let obj = {
          id : index+1,
          author : r.author.login,
          content : !r.comments.nodes[0] ? r.body : r.comments.nodes[0].body,
          sentiment : "positive",
          date : r.submittedAt.split('T')[0],
          isReviewer : r.comments.nodes.length > 0 ? true : false
        }

        
        ar.push(obj);
        
    });

    const length = ar.length;
    pr.comments.nodes.map((c, index) => {
        let obj = {
          id : length + index+1,
          author : c.author.login,
          content :  c.body,
          sentiment : "positive",
          date : c.createdAt.split('T')[0],
          isReviewer : false
        }

        ar.push(obj);
    })

     res.send(ar);


  } catch (error) {
    console.error("Error fetching PR feedback:", error);
    res.status(500).json({ error });
  }
};


export const getGitHubUserProfile = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing accessToken" });
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${accessToken}`,
    },
  });

  const query = `
    query {
      viewer {
        login
        name
        bio
        avatarUrl
        company
        location
        createdAt
        followers {
          totalCount
        }
        following {
          totalCount
        }
      }
    }
  `;

  try {
    const data = await graphqlWithAuth(query);
    res.json({ user: data.viewer });
  } catch (error) {
    console.error("GitHub GraphQL error:", error.message);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
};


export const getPRStats = async (req, res) => {
  const { owner, repo, prnum, accessToken } = req.body;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prnum}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    const { additions, deletions, changed_files } = response.data;

    // res.json({
    //   additions,
    //   deletions,
    //   changed_files,
    //   total_changes: additions + deletions,
    // });

    res.json({"data" : response.data});
  } catch (error) {
    console.error("Error fetching PR stats:", error);
    res.status(500).json({ error: "Failed to get PR statistics" });
  }
};



export const getPRDiffs = async (req, res) => {
  const { owner, repo, prnum, accessToken } = req.body;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prnum}/files`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    // For each file, return patch (diff) + stats
    const files = response.data.map(file => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch, // diff text (can be null for binary files)
    }));

    res.json({ files });
  } catch (error) {
    console.error("Error fetching PR file diffs:", error.message);
    res.status(500).json({ error: "Failed to fetch PR file changes" });
  }
};

const extractLines = (patch, type) => {
          if (!patch) return [];
          return patch
            .split("\n")
            .filter(line => line.startsWith(type) && !line.startsWith(type + type))
            .map(line => line.slice(1));
        }





export const getUserPRs = async (req, res) => {
  const { accessToken, username } = req.body;

  if (!accessToken || !username) {
    return res.status(400).json({ error: "Missing accessToken or username" });
  }

  try {
    const prList = await axios.get(`https://api.github.com/search/issues?q=type:pr+author:${username}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    
    const detailedPRs = await Promise.all(
      prList.data.items.map(async (pr) => {
        const [owner, repo] = pr.repository_url.replace("https://api.github.com/repos/", "").split("/");
        const prNumber = pr.number;

        const filesRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

      

        const ReviewRes = await axios.post('http://localhost:'+process.env.PORT+'/api/auth/getreview', {
             accessToken,
             owner,
             repo,
             prnum : prNumber
        })
        
        const files = filesRes.data.map(f => ({
          file: f.filename,
          changes: `+${f.additions} -${f.deletions}`,
          additions: extractLines(f.patch, '+'),
          deletions: extractLines(f.patch, '-')
        }));

        return {
          id: prNumber,
          title: pr.title,
          repo: `${owner}/${repo}`,
          status: pr.state === "closed" ? (pr.pull_request?.merged_at ? "accepted" : "rejected") : "pending",
          author: pr.user.login,
          date: pr.created_at,
          filesChanged: files.length,
          linesAdded: files.reduce((sum, f) => sum + f.additions.length, 0),
          linesRemoved: files.reduce((sum, f) => sum + f.deletions.length, 0),
          score: Math.floor(Math.random() * 40) + 60, // mock score (replace later)
          url: pr.html_url,
          files,
          comments : ReviewRes.data
        };
      })
    );

    res.json({ pullRequests: detailedPRs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch PRs" });
  }
};