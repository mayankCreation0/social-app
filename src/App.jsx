import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import { AppProvider, useApp } from './context/AppContext'
import LoginPage from "./pages/LoginPage"
import FeedPage from "./pages/FeedPage"
import ProtectedRoute from "./components/ProtectedRoute"
import CreatePost from "./pages/CreatePost"
import ProfilePage from "./pages/ProfilePage"
import { Loader } from "./components/common/Loader"
import Footer from "./components/common/Footer"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppProvider>
          <Toaster />
          <AppLayout>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <FeedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppLayout>
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

const AppLayout = ({ children }) => {
  const { loading } = useApp();

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen pb-12">
      {children}
      <Footer />
    </div>
  );
};

export default App;