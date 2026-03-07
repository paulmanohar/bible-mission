import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Mail, MapPin, Heart, Users, MessageSquare, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { submitPrayerRequest, submitPastorApplication, submitContactMessage, resetFormStatus } from "../store/slices/formsSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function FormSuccess({ title, message, onReset }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h4 className="font-serif text-xl font-bold mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm mb-4">{message}</p>
      <button onClick={onReset} className="text-sm text-primary font-medium hover:underline">Submit another</button>
    </div>
  );
}

function PrayerRequestForm() {
  const dispatch = useDispatch();
  const { prayerRequest } = useSelector((s) => s.forms);
  const [form, setForm] = useState({ name: "", email: "", phone: "", request: "", isAnonymous: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitPrayerRequest(form));
  };

  if (prayerRequest.status === "success") {
    return <FormSuccess title="Prayer Request Submitted" message="Our prayer team will lift your request before God." onReset={() => { dispatch(resetFormStatus("prayerRequest")); setForm({ name: "", email: "", phone: "", request: "", isAnonymous: false }); }} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input data-testid="input-prayer-name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <input data-testid="input-prayer-email" type="email" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <input data-testid="input-prayer-phone" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <textarea data-testid="input-prayer-request" placeholder="Share your prayer request..." rows={4} value={form.request} onChange={(e) => setForm({ ...form, request: e.target.value })} required className="w-full px-3 py-2 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} className="accent-primary" />
        Keep my request anonymous
      </label>
      {prayerRequest.error && <p className="text-destructive text-sm">{prayerRequest.error}</p>}
      <button data-testid="button-submit-prayer" type="submit" disabled={prayerRequest.status === "pending"} className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {prayerRequest.status === "pending" ? "Submitting..." : "Submit Prayer Request"}
      </button>
    </form>
  );
}

function PastorApplicationForm() {
  const dispatch = useDispatch();
  const { pastorApplication } = useSelector((s) => s.forms);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", location: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitPastorApplication(form));
  };

  if (pastorApplication.status === "success") {
    return <FormSuccess title="Application Submitted" message="We'll review your application and get back to you soon." onReset={() => { dispatch(resetFormStatus("pastorApplication")); setForm({ fullName: "", email: "", phone: "", location: "", message: "" }); }} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input data-testid="input-pastor-name" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <input data-testid="input-pastor-email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <input data-testid="input-pastor-phone" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <input data-testid="input-pastor-location" placeholder="City & Region" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <textarea data-testid="input-pastor-message" placeholder="Tell us about your ministry..." rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
      {pastorApplication.error && <p className="text-destructive text-sm">{pastorApplication.error}</p>}
      <button data-testid="button-submit-pastor" type="submit" disabled={pastorApplication.status === "pending"} className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {pastorApplication.status === "pending" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

function ContactForm() {
  const dispatch = useDispatch();
  const { contactMessage } = useSelector((s) => s.forms);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContactMessage(form));
  };

  if (contactMessage.status === "success") {
    return <FormSuccess title="Message Sent" message="We'll get back to you as soon as possible." onReset={() => { dispatch(resetFormStatus("contactMessage")); setForm({ name: "", email: "", subject: "", message: "" }); }} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input data-testid="input-contact-name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <input data-testid="input-contact-email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <input data-testid="input-contact-subject" placeholder="Subject (optional)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
      <textarea data-testid="input-contact-message" placeholder="Your message..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="w-full px-3 py-2 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
      {contactMessage.error && <p className="text-destructive text-sm">{contactMessage.error}</p>}
      <button data-testid="button-submit-contact" type="submit" disabled={contactMessage.status === "pending"} className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {contactMessage.status === "pending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState("prayer");

  const tabs = [
    { key: "prayer", label: "Prayer Request", icon: Heart },
    { key: "pastor", label: "Join as Pastor", icon: Users },
    { key: "contact", label: "Contact Us", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-widest mb-4 text-primary-foreground/70 font-medium">Connect</p>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight" data-testid="text-connect-page-title">
                We'd Love to Hear from You
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl">
                Whether you need prayer, want to join as a pastor, become a member, or simply want to reach out — we're here for you.
              </p>
            </div>
          </div>
        </section>

        {/* Forms Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left - Info */}
              <div className="lg:col-span-5 space-y-8">
                {/* 24/7 Prayer Helpline */}
                <div className="bg-primary text-primary-foreground p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-6 w-6" />
                    <h3 className="font-serif text-xl font-bold">24/7 Prayer Helpline</h3>
                  </div>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Our prayer warriors are available around the clock to pray with you and for you.
                  </p>
                  <p className="text-2xl font-bold" data-testid="text-helpline-number">+91 00000 00000</p>
                </div>

                {/* Warning */}
                <div className="border border-destructive/30 bg-destructive/5 p-6 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm mb-1">Important Notice</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-scam-warning">
                      Please do not send any money for prayer requests or to any individual claiming to pray through a helpline. Offerings should be sent only through the officially provided bank details.
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold">Contact Information</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Headquarters</p>
                        <p>Bible Mission Grounds, Guntur, Andhra Pradesh, India</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 shrink-0 text-primary" />
                      <p>contact@biblemission.life</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 shrink-0 text-primary" />
                      <p>+91 00000 00000</p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="border p-6">
                  <h3 className="font-serif text-xl font-bold mb-4">Official Bank Details for Offerings</h3>
                  <div className="bg-muted/50 p-4 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Bank:</span> <strong>State Bank of India</strong></p>
                    <p><span className="text-muted-foreground">Account Name:</span> <strong>Bible Mission</strong></p>
                    <p><span className="text-muted-foreground">Account No:</span> <strong>1234567890</strong></p>
                    <p><span className="text-muted-foreground">IFSC:</span> <strong>SBIN0000000</strong></p>
                  </div>
                </div>

                {/* Join as Member */}
                <div className="bg-muted/30 border p-6">
                  <h3 className="font-serif text-xl font-bold mb-3">Become a Member</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create an account to access exclusive content, subscribe to premium resources, and track your spiritual journey.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Access locked study materials</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Personalized recommendations</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Event registration & reminders</li>
                  </ul>
                  <a href="/login" className="block text-center h-10 leading-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" data-testid="link-signup">
                    Sign Up / Login
                  </a>
                </div>
              </div>

              {/* Right - Forms */}
              <div className="lg:col-span-7">
                {/* Tab Navigation */}
                <div className="flex border-b mb-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        data-testid={`tab-${tab.key}`}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.key
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="border p-8">
                  {activeTab === "prayer" && (
                    <div>
                      <h3 className="font-serif text-2xl font-bold mb-2">Submit a Prayer Request</h3>
                      <p className="text-muted-foreground text-sm mb-6">Our dedicated prayer team will lift your request before God.</p>
                      <PrayerRequestForm />
                    </div>
                  )}

                  {activeTab === "pastor" && (
                    <div>
                      <h3 className="font-serif text-2xl font-bold mb-2">Apply as a Pastor Partner</h3>
                      <p className="text-muted-foreground text-sm mb-6">Partner with Bible Mission to host events and lead congregations in your community.</p>
                      <PastorApplicationForm />
                    </div>
                  )}

                  {activeTab === "contact" && (
                    <div>
                      <h3 className="font-serif text-2xl font-bold mb-2">Send Us a Message</h3>
                      <p className="text-muted-foreground text-sm mb-6">Have a question or feedback? We'd love to hear from you.</p>
                      <ContactForm />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
