import { ThemeProvider } from 'styled-components';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AccessibilityWidget from "./components/AccessibilityWidget";

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Sonner />
    <AccessibilityWidget />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
