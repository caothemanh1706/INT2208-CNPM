import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Statistics } from './pages/Statistics';
import { History } from './pages/History';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: 'statistics', Component: Statistics },
      { path: 'history', Component: History },
      { path: 'goals', Component: Goals },
      { path: 'settings', Component: Settings },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
