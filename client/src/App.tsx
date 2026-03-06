import { Switch, Route } from "wouter";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import store from "./store/store";
import { fetchProfile } from "./store/slices/authSlice";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ResourcesPage from "./pages/ResourcesPage";
import MeetingsPage from "./pages/MeetingsPage";
import ConnectPage from "./pages/ConnectPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/not-found";

function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((s: any) => s.auth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(fetchProfile() as any);
    }
  }, [token, isAuthenticated, dispatch]);

  return children;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/meetings" component={MeetingsPage} />
      <Route path="/connect" component={ConnectPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthBootstrap>
        <Router />
      </AuthBootstrap>
    </Provider>
  );
}

export default App;
