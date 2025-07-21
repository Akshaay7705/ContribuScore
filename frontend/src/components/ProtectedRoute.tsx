// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';



// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }

//   return <>{children}</>;
// }


import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
