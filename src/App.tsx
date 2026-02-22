import { ThemeProvider } from 'styled-components';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import TreatmentPage from "./pages/TreatmentPage";
import Appointments from "./pages/Appointments";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Gallery from "./pages/Gallery";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import AdminOverview from "./pages/admin/Overview";
import AdminAppointments from "./pages/admin/Appointments";
import AdminTreatments from "./pages/admin/Treatments";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminBlog from "./pages/admin/Blog";
import AdminGallery from "./pages/admin/Gallery";
import AdminArchive from "./pages/admin/Archive";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AccessibilityWidget from "./components/AccessibilityWidget";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Sonner />
      <BrowserRouter>
        <AccessibilityWidget />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/treatment/:slug" element={<TreatmentPage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Dashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="treatments" element={<AdminTreatments />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="archive" element={<AdminArchive />} />
          </Route>
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
