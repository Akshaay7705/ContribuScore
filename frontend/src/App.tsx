// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import { ThemeProvider } from './contexts/ThemeContext';
// import Navbar from './components/Navbar';
// import ProtectedRoute from './components/ProtectedRoute';
// import PublicRoute from './components/PublicRoute';
// import LoginForm from './components/LoginForm';
// import Dashboard from './components/Dashboard';
// import PullRequests from './components/PullRequests';
// import Profile from './components/Profile';
// import UserProfile from './components/UserProfile';

// function AppLayout() {
  
//   // return (
//   //   <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//   //     <Navbar />
//   //     <main className="p-6">
//   //       <Routes>
//   //         <Route path="/" element={
            
//   //             <Dashboard />
            
//   //         } />
//   //         <Route path="/pull-requests" element={
           
//   //             <PullRequests />
            
//   //         } />
//   //         <Route path="/public-profile/:id" element={
            
//   //             <Profile />
//   //         } />
//   //         <Route path="/profile" element={
           
//   //             <UserProfile />
            
//   //         } />
//   //       </Routes>
//   //     </main>
//   //   </div>
//   // );

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <Navbar />
//       <main className="p-6">
//         <Routes>
//           <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//           <Route path="/pull-requests" element={<ProtectedRoute><PullRequests /></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
//           <Route path="/public-profile/:id" element={<Profile />} /> {/* public */}
//         </Routes>
//       </main>
//     </div>
//   );
// }

// function AppContent() {
//   // return (
//   //   <Router>
//   //     <Routes>
//   //       <Route path="/auth" element={
          
//   //           <LoginForm />
         
//   //       } />
//   //       <Route path="/auth/github" element={
          
//   //           <LoginForm />
          
//   //       } />
//   //       <Route path="/auth/callback" element={
          
//   //           <LoginForm />
         
//   //       } />
//   //       <Route path="/*" element={<AppLayout />} />
//   //     </Routes>
//   //   </Router>
//   // );

//   return (
//     <Router>
//       <Routes>
//         <Route path="/auth" element={<PublicRoute><LoginForm /></PublicRoute>} />
//         <Route path="/auth/github" element={<PublicRoute><LoginForm /></PublicRoute>} />
//         <Route path="/auth/callback" element={<PublicRoute><LoginForm /></PublicRoute>} />
//         <Route path="/*" element={<AppLayout />} />
//       </Routes>
//     </Router>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <ThemeProvider>
//         <AppContent />
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import PullRequests from './components/PullRequests';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/pull-requests" element={
            <ProtectedRoute>
              <PullRequests />
            </ProtectedRoute>
          } />
          <Route path="/public-profile/:id" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            <Route path="/auth/github" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            <Route path="/auth/callback" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
