import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/DashboardPage";
import AdminLayout from "./components/LayOut";
import LoadingSpinner from "./utils/ui";
import ExperiencesPage from "./components/ExperiencePage";
import ExperienceForm from "./components/ExperienceForm";
import ProjectsPage from "./components/ProjectsPage";
import ProjectForm from "./components/ProjectForm";
import TestimonialsPage from "./components/TestimonialsPage";
import SubmitTestimonial from "./components/AddTestimonial";
import NotFound404 from "./components/notFound";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
              <Route path="add_testimonial" element={<SubmitTestimonial />} />
              <Route path="*" element={<NotFound404 />} />
          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="experiences" element={<ExperiencesPage />} />
            <Route path="experiences/new" element={<ExperienceForm />} />
            <Route path="experiences/edit/:id" element={<ExperienceForm />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}