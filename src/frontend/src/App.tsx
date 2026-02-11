import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import DashboardPage from './pages/DashboardPage';
import ConversationPage from './pages/ConversationPage';
import SessionSummaryPage from './pages/SessionSummaryPage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './components/AppLayout';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const conversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/conversation',
  component: ConversationPage,
});

const summaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/summary/$sessionId',
  component: SessionSummaryPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, conversationRoute, summaryRoute, settingsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
