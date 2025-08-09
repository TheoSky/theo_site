import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { ProtectedRoute } from "./components/auth/protected-route";
import { Layout } from "./components/layout/layout";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import BlogEditor from "./pages/BlogEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/new" element={
                <ProtectedRoute>
                  <BlogEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit/:id" element={
                <ProtectedRoute>
                  <BlogEditor />
                </ProtectedRoute>
              } />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
