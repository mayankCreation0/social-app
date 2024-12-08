import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import LoginPage from "./pages/LoginPage"
import FeedPage from "./pages/FeedPage"
import ProtectedRoute from "./components/ProtectedRoute"
import CreatePost from "./pages/CreatePost"
import ProfilePage from "./pages/ProfilePage"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppProvider>
          <Toaster />
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
\            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App