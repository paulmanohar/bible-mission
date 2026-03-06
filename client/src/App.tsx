import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrap>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthBootstrap>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
