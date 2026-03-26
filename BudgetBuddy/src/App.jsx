// src/App.jsx
import { Router, Route } from "@solidjs/router";

import Landing from "./pages/Landing";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      {/* Javne rute */}
      <Route path="/login"          component={LogIn} />
      <Route path="/signup"         component={SignUp} />
      <Route path="/signout"        component={SignOut} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Zaštićene rute */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile"   component={Profile} />

      {/* Landing page */}
      <Route path="/" component={Landing} />
    </Router>
  );
}
