
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";

import DonatePage from "./pages/DonatePage";
import FinancePage from "./pages/FinancePage";
import StatsPage from "./pages/StatsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ParametresPage from "./pages/ParametresPage";
import { useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { UserProvider } from "./contexts/UserContext";
import { trackPageView } from "./utils/analytics";
import RapportsPage from "./pages/RapportsPage";
import NewsPage from "./pages/NewsPage";

// Define routes configuration with redirects
const routes = [
  { path: "/", element: <Index /> },
  { path: "/rapports", element: <RapportsPage /> },
  { path: "/finances", element: <FinancePage /> },
  { path: "/statistiques", element: <StatisticsProvider><StatsPage /></StatisticsProvider> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/news", element: <NewsPage /> },
  { path: "/parametres", element: <ParametresPage /> },
  { path: "/donations", element: <DonatePage /> },
  { path: "/dashboard", element: <Navigate to="/" replace /> },
  { path: "*", element: <NotFound /> }
];

// Create query client with enhanced configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Router change handler component
const RouterChangeHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Track page view for analytics
    const currentPath = location.pathname;
    const pageName = currentPath === '/' ? 'dashboard' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);

  return null;
};

// Application main component with properly nested providers
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <UserProvider>
          <CRMProvider>
            <BrowserRouter>
              <TooltipProvider>
                <RouterChangeHandler />
                <Routes>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </TooltipProvider>
            </BrowserRouter>
          </CRMProvider>
        </UserProvider>
      </AppSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
