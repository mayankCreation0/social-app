import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
