import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateProfile, changePassword, clearProfileSuccess, clearAuthError } from "../store/slices/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, profileLoading, profileError, profileSuccess, passwordSuccess } = useSelector((s) => s.auth);

  const [profileForm, setProfileForm] = useState({ fullName: "", email: "", phone: "", location: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (profileSuccess || passwordSuccess) {
      const timer = setTimeout(() => dispatch(clearProfileSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [profileSuccess, passwordSuccess, dispatch]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(updateProfile(profileForm));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError("");
    dispatch(clearAuthError());
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    dispatch(changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }));
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-serif font-bold text-primary">{user.fullName?.charAt(0)}</span>
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold" data-testid="text-profile-name">{user.fullName}</h1>
                <p className="text-sm text-muted-foreground">@{user.username} &middot; {user.role}</p>
              </div>
            </div>
            <button data-testid="button-logout" onClick={handleLogout} className="h-10 px-6 border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
              Sign Out
            </button>
          </div>

          <div className="flex gap-2 mb-6 border-b">
            <button
              data-testid="tab-edit-profile"
              onClick={() => { setActiveSection("profile"); dispatch(clearAuthError()); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeSection === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            >
              Edit Profile
            </button>
            <button
              data-testid="tab-change-password"
              onClick={() => { setActiveSection("password"); dispatch(clearAuthError()); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeSection === "password" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            >
              Change Password
            </button>
            <button
              data-testid="tab-account-info"
              onClick={() => setActiveSection("info")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeSection === "info" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            >
              Account Info
            </button>
          </div>

          {profileError && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm border border-destructive/20" data-testid="text-profile-error">{profileError}</div>}

          {activeSection === "profile" && (
            <div className="bg-background border p-6">
              <h2 className="font-serif text-lg font-bold mb-4">Edit Profile</h2>
              {profileSuccess && <div className="mb-4 p-3 bg-green-50 text-green-800 text-sm border border-green-200" data-testid="text-profile-success">Profile updated successfully!</div>}
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input data-testid="input-profile-name" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input data-testid="input-profile-email" type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input data-testid="input-profile-phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input data-testid="input-profile-location" value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <button data-testid="button-save-profile" type="submit" className="h-10 px-6 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={profileLoading}>
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "password" && (
            <div className="bg-background border p-6">
              <h2 className="font-serif text-lg font-bold mb-4">Change Password</h2>
              {passwordSuccess && <div className="mb-4 p-3 bg-green-50 text-green-800 text-sm border border-green-200" data-testid="text-password-success">Password changed successfully!</div>}
              {passwordError && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm border border-destructive/20">{passwordError}</div>}
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input data-testid="input-current-password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input data-testid="input-new-password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input data-testid="input-confirm-new-password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <button data-testid="button-change-password" type="submit" className="h-10 px-6 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={profileLoading}>
                  {profileLoading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "info" && (
            <div className="bg-background border p-6">
              <h2 className="font-serif text-lg font-bold mb-4">Account Information</h2>
              <div className="space-y-3 max-w-lg">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Username</span>
                  <span className="text-sm font-medium" data-testid="text-info-username">@{user.username}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <span className="text-sm font-medium" data-testid="text-info-fullname">{user.fullName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium" data-testid="text-info-email">{user.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <span className="text-sm font-medium capitalize" data-testid="text-info-role">{user.role}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium" data-testid="text-info-phone">{user.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-medium" data-testid="text-info-location">{user.location || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium" data-testid="text-info-joined">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
