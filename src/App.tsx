import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import ClassDetails from "./pages/ClassDetails";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* App routes */}
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/classes" element={<Classes />} />
        <Route path="/app/classes/:classname" element={<ClassDetails />} />
        <Route path="/app/classes/:classname/students" element={<Students />} />
        <Route path="/app/students/:reg_no" element={<StudentDetails />} />
        <Route path="/app/attendance" element={<Attendance />} />
        <Route path="/app/profile" element={<Profile />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
