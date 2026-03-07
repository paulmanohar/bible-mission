import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect } from "react";
import store from "./store/store";
import { fetchProfile } from "./store/slices/authSlice";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ResourcesPage from "./pages/ResourcesPage";
import MeetingsPage from "./pages/MeetingsPage";
import ConnectPage from "./pages/ConnectPage";
import SearchPage from "./pages/SearchPage";
import BookDetailPage from "./pages/BookDetailPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import PodcastDetailPage from "./pages/PodcastDetailPage";
import EventDetailPage from "./pages/EventDetailPage";
import NotFound from "./pages/not-found";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooksPage from "./pages/admin/AdminBooksPage";
import AdminArticlesPage from "./pages/admin/AdminArticlesPage";
import AdminPodcastsPage from "./pages/admin/AdminPodcastsPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminLivestreamsPage from "./pages/admin/AdminLivestreamsPage";

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
        <ScrollToTop />
        <AuthBootstrap>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/books/:id/:slug?" element={<BookDetailPage />} />
            <Route path="/articles/:id/:slug?" element={<ArticleDetailPage />} />
            <Route path="/podcasts/:id/:slug?" element={<PodcastDetailPage />} />
            <Route path="/events/:id/:slug?" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="books" element={<AdminBooksPage />} />
              <Route path="articles" element={<AdminArticlesPage />} />
              <Route path="podcasts" element={<AdminPodcastsPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="livestreams" element={<AdminLivestreamsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthBootstrap>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
