// src/App.jsx
import { Router, Route } from "@solidjs/router";

import Landing from "./pages/Landing";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Stats from "./pages/Stats";

export default function App() {
  return (
    <Router>
      <Route path="/"               component={Landing} />
      <Route path="/login"          component={LogIn} />
      <Route path="/signup"         component={SignUp} />
      <Route path="/signout"        component={SignOut} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/dashboard"      component={Dashboard} />
      <Route path="/transactions"   component={Transactions} />
      <Route path="/profile"        component={Profile} />
      <Route path="/admin"          component={Admin} />
      <Route path="/stats"          component={Stats} />
    </Router>
  );
}