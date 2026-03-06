import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold" data-testid="text-footer-brand">Bible Mission</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              A global religious organization with headquarters in Guntur, Andhra Pradesh. We are dedicated to spreading the teachings of our Spiritual Father M.Devadas Ayyagaru.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="hover:text-white/80 transition-colors" data-testid="link-facebook"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white/80 transition-colors" data-testid="link-youtube"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white/80 transition-colors" data-testid="link-instagram"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Books & Resources</Link></li>
              <li><Link to="/meetings" className="hover:text-white transition-colors">Upcoming Meetings</Link></li>
              <li><Link to="/connect" className="hover:text-white transition-colors">Join as Pastor / Member</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Connect With Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Headquarters<br />Guntur, Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <div>
                  <span className="block font-semibold text-white">24/7 Prayer Helpline</span>
                  <span>+91 00000 00000</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <span>contact@biblemission.life</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Offerings</h4>
            <div className="bg-white/10 p-4 rounded-lg space-y-2 text-sm text-primary-foreground/80">
              <p className="font-medium text-white">Official Bank Details:</p>
              <p>Bank: State Bank of India</p>
              <p>A/C Name: Bible Mission</p>
              <p>A/C No: 1234567890</p>
              <p>IFSC: SBIN0000000</p>
            </div>
            <div className="text-xs text-primary-foreground/60 p-3 border border-white/20 rounded bg-white/5" data-testid="text-offering-warning">
              <strong className="text-white">Important Note:</strong> Please do not send any money for prayer requests or to any individual claiming to pray through a helpline. Offerings should be sent only through these officially provided bank details.
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Bible Mission. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
