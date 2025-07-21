// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { User, AuthContextType } from '../types';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Mock user data
// const mockUser: User = {
//   id: '1',
//   username: 'akshaaybs',
//   name: 'Akshay BS',
//   email: 'akshay@github.com',
//   avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
//   bio: 'Full-stack developer passionate about open source and clean code',
//   location: 'San Francisco, CA',
//   company: 'TechCorp',
//   githubUrl: 'https://github.com/akshaaybs',
//   joinedDate: '2022-01-15'
// };

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is already logged in (from localStorage)
//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
    
//     // Check for GitHub OAuth callback
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');
//     if (code) {
//       // In a real app, exchange code for access token
//       handleGitHubCallback(code);
//     }
    
//     setLoading(false);
//   }, []);

//   const handleGitHubCallback = async (code: string) => {
//     setLoading(true);
//     // Simulate GitHub OAuth flow
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // In a real app, you would:
//     // 1. Exchange code for access token
//     // 2. Fetch user data from GitHub API
//     // 3. Create/update user in your database
    
//     setUser(mockUser);
//     localStorage.setItem('user', JSON.stringify(mockUser));
    
//     // Clean up URL
//     window.history.replaceState({}, document.title, window.location.pathname);
//     setLoading(false);
//   };

//   const loginWithGitHub = () => {
//     // In a real app, redirect to GitHub OAuth
//     const clientId = 'your_github_client_id';
//     const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
//     const scope = 'read:user user:email public_repo';
    
//     // For demo purposes, simulate the callback
//     setTimeout(() => {
//       handleGitHubCallback('mock_code');
//     }, 1000);
    
//     // In production, uncomment this:
//     // window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     loginWithGitHub,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { User, AuthContextType } from '../types';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

  // ✅ Check localStorage and GitHub OAuth code on initial load
// useEffect(() => {
//   const initAuth = async () => {
//     setLoading(true);

//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//       setLoading(false);
//       return;
//     }

//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code'); // ✅ This only works on redirect back from GitHub

//     console.log(code);
    
//     if (code) {
//       await handleGitHubCallback(code);
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     setLoading(false);
//   };

//   initAuth();
// }, []);


//   // ✅ Called after GitHub redirects back with a code
//   const handleGitHubCallback = async (code: string) => {
//     try {
//       // Step 1: Exchange code for access token
//       const tokenRes = await axios.post(`${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/get-accessToken`, { code });
//       const accessToken = tokenRes.data?.data?.access_token;

//       if (!accessToken) throw new Error("Access token missing");

//       // Step 2: Use access token to get user details
//       const userRes = await axios.post(`${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/get-user-details`, {
//         accessToken
//       });

//       const githubUser = userRes.data?.user;
//       if (!githubUser) throw new Error("User info missing");

//       // Step 3: Format and save user
//       const formattedUser: User = {
//         id: githubUser.login,
//         username: githubUser.login,
//         name: githubUser.name || githubUser.login,
//         email: '', // GitHub GraphQL API v4 doesn't return email by default
//         avatar: githubUser.avatarUrl,
//         bio: githubUser.bio || '',
//         location: githubUser.location || '',
//         company: githubUser.company || '',
//         githubUrl: `https://github.com/${githubUser.login}`,
//         joinedDate: githubUser.createdAt,
//       };

//       setUser(formattedUser);
//       localStorage.setItem('user', JSON.stringify(formattedUser));
//     } catch (error) {
//       console.error("GitHub login failed:", error);
//     }
//   };




import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      // Check localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      }

      // Look for GitHub code
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log(code);
      
      if (code) {
        await handleGitHubCallback(code);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const handleGitHubCallback = async (code: string) => {
    try {
      const tokenRes = await axios.post(`${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/get-accessToken`, { code });
      const accessToken = tokenRes.data.data.access_token;

      console.log(accessToken);
      const userRes = await axios.post(`${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/get-user-details`, { accessToken });
      const githubUser = userRes.data.user;

      const userObj: User = {
        id: githubUser.login,
        username: githubUser.login,
        name: githubUser.name || githubUser.login,
        email: '',
        avatar: githubUser.avatarUrl,
        bio: githubUser.bio,
        location: githubUser.location,
        company: githubUser.company,
        githubUrl: `https://github.com/${githubUser.login}`,
        joinedDate: githubUser.createdAt,
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', accessToken);
    } catch (err) {
      console.error('GitHub login failed:', err);
    }
  };

  const loginWithGitHub = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/github`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loginWithGitHub,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}




// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { AuthContextType, User } from "../types";

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");
//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setAccessToken(storedToken);
//     }

//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");
//     if (code) {
//       exchangeCodeForToken(code);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const exchangeCodeForToken = async (code: string) => {
//     try {
//       console.log(code);
      
//       const res = await axios.post(`${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/get-accessToken`, { code });
//       const token = res.data.data.access_token;
//       setAccessToken(token);
//       localStorage.setItem("token", token);
//       console.log(token);
//       const formdata = { "accessToken" : token}
//       const userRes = await axios.post(`${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/get-user-details`, formdata);

//       const u = userRes.data;
//       const userObj = {
//         id: String(u.id),
//         username: u.login,
//         name: u.name,
//         email: u.email,
//         avatar: u.avatar_url,
//         bio: u.bio,
//         location: u.location,
//         company: u.company,
//         githubUrl: u.html_url,
//         joinedDate: u.created_at,
//       };
//       setUser(userObj);
//       localStorage.setItem("user", JSON.stringify(userObj));

//       console.log(userObj);
      

//       window.history.replaceState({}, document.title, window.location.pathname);
//     } catch (err) {
//       console.error("GitHub Auth Failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setAccessToken(null);
//     localStorage.clear();
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginWithGitHub, logout, loading, accessToken }}>
//       {children}
//     </AuthContext.Provider>
//   );

//   function loginWithGitHub() {
//     window.location.href = `${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/github`;
//   }
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// }



// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { AuthContextType, User } from "../types";

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");
//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setAccessToken(storedToken);
//     }

//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");
//     if (code) {
//       exchangeCodeForToken(code);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const exchangeCodeForToken = async (code: string) => {
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/get-accessToken`, { code });
//       const token = res.data.data.access_token;
//       setAccessToken(token);
//       localStorage.setItem("token", token);

//       const userRes = await axios.post(`${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/get-user-details`, {
//         accessToken: "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"
//       });

//       const u = userRes.data;
//       const userObj: User = {
//         id: String(u.id),
//         username: u.login,
//         name: u.name,
//         email: u.email,
//         avatar: u.avatar_url,
//         bio: u.bio,
//         location: u.location,
//         company: u.company,
//         githubUrl: u.html_url,
//         joinedDate: u.created_at,
//       };

//       setUser(userObj);
//       localStorage.setItem("user", JSON.stringify(userObj));

//       // Remove code from URL
//       window.history.replaceState({}, document.title, window.location.pathname);
//     } catch (err) {
//       console.error("GitHub Auth Failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginWithGitHub = () => {
//     window.location.href = `${import.meta.env.VITE_BACKEND_ROUTE}/api/auth/github`;
//   };

//   const logout = () => {
//     setUser(null);
//     setAccessToken(null);
//     localStorage.clear();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         loginWithGitHub,
//         logout,
//         loading,
//         accessToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// }
