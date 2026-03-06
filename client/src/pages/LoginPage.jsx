import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser, forgotPassword, resetPassword, clearAuthError, clearForgotPasswordSuccess, clearResetPasswordSuccess } from "../store/slices/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user, forgotPasswordSuccess, resetPasswordSuccess } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", password: "", confirmPassword: "", email: "", fullName: "", phone: "", location: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({ token: "", newPassword: "", confirmPassword: "" });
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/profile");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setValidationError("");
    dispatch(loginUser(loginForm));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setValidationError("");
    if (registerForm.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    const { confirmPassword, ...data } = registerForm;
    dispatch(registerUser(data));
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setValidationError("");
    dispatch(forgotPassword(forgotEmail));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setValidationError("");
    if (resetForm.newPassword.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    dispatch(resetPassword({ token: resetForm.token, newPassword: resetForm.newPassword }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setValidationError("");
    dispatch(clearAuthError());
    dispatch(clearForgotPasswordSuccess());
    dispatch(clearResetPasswordSuccess());
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 bg-muted/30">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2" data-testid="text-auth-title">Welcome to Bible Mission</h1>
            <p className="text-muted-foreground">Sign in or create an account to access exclusive resources.</p>
          </div>

          <div className="bg-background border p-8">
            <div className="flex border-b mb-6">
              <button
                data-testid="tab-login"
                onClick={() => switchTab("login")}
                className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "login" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
              >
                Sign In
              </button>
              <button
                data-testid="tab-register"
                onClick={() => switchTab("register")}
                className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "register" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
              >
                Create Account
              </button>
            </div>

            {displayError && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm border border-destructive/20" data-testid="text-auth-error">{displayError}</div>}

            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <input data-testid="input-login-username" placeholder="Username" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input data-testid="input-login-password" type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <button data-testid="button-login-submit" type="submit" className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
                <div className="text-center">
                  <button type="button" data-testid="button-forgot-password" onClick={() => switchTab("forgot")} className="text-sm text-primary hover:underline">
                    Forgot your password?
                  </button>
                </div>
              </form>
            )}

            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <input data-testid="input-register-name" placeholder="Full name" value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input data-testid="input-register-email" type="email" placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input data-testid="input-register-username" placeholder="Choose a username" value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input data-testid="input-register-password" type="password" placeholder="Password (min 6 characters)" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input data-testid="input-register-confirm-password" type="password" placeholder="Confirm password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input data-testid="input-register-phone" placeholder="Phone (optional)" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <input data-testid="input-register-location" placeholder="City / Region (optional)" value={registerForm.location} onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                <button data-testid="button-register-submit" type="submit" className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}

            {activeTab === "forgot" && (
              <div>
                {forgotPasswordSuccess ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 text-green-800 text-sm border border-green-200" data-testid="text-forgot-success">
                      If an account with that email exists, a reset token has been generated. Please check your email or use the token below to reset your password.
                    </div>
                    <button type="button" data-testid="button-go-reset" onClick={() => switchTab("reset")} className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                      Enter Reset Token
                    </button>
                    <button type="button" onClick={() => switchTab("login")} className="w-full h-10 border border-input text-sm font-medium hover:bg-muted transition-colors">
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">Enter your email address and we'll send you a reset link.</p>
                    <input data-testid="input-forgot-email" type="email" placeholder="Email address" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                    <button data-testid="button-forgot-submit" type="submit" className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={loading}>
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                    <button type="button" onClick={() => switchTab("login")} className="w-full h-10 border border-input text-sm font-medium hover:bg-muted transition-colors">
                      Back to Sign In
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === "reset" && (
              <div>
                {resetPasswordSuccess ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 text-green-800 text-sm border border-green-200" data-testid="text-reset-success">
                      Your password has been reset successfully. You can now sign in with your new password.
                    </div>
                    <button type="button" onClick={() => switchTab("login")} className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                      Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">Enter the reset token you received and your new password.</p>
                    <input data-testid="input-reset-token" placeholder="Reset token" value={resetForm.token} onChange={(e) => setResetForm({ ...resetForm, token: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                    <input data-testid="input-reset-password" type="password" placeholder="New password (min 6 characters)" value={resetForm.newPassword} onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                    <input data-testid="input-reset-confirm" type="password" placeholder="Confirm new password" value={resetForm.confirmPassword} onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                    <button data-testid="button-reset-submit" type="submit" className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={loading}>
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    <button type="button" onClick={() => switchTab("login")} className="w-full h-10 border border-input text-sm font-medium hover:bg-muted transition-colors">
                      Back to Sign In
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
