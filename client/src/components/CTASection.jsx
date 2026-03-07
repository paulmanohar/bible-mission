import { Phone, Heart, Users, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30" id="connect">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 md:mb-6" data-testid="text-connect-title">Want to know more?</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Whether you are seeking prayer, looking to join our community, or want to partner with us in ministry, we are here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="bg-background border border-border p-6 md:p-8 hover:border-primary/50 transition-colors group flex flex-col h-full">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Heart className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 md:mb-3">Prayer Requests</h3>
            <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-6 flex-1">Need spiritual support? Submit a prayer request or call our 24/7 helpline.</p>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 font-medium bg-muted p-3 text-sm"><Phone className="h-5 w-5 text-primary" /><span>+91 00000 00000</span></div>
              <Link to="/connect">
                <span className="w-full border border-border py-2 text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center cursor-pointer" data-testid="button-prayer-request">
                  Submit Request Online
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-background border border-border p-6 md:p-8 hover:border-primary/50 transition-colors group flex flex-col h-full">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Users className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 md:mb-3">Become a Member</h3>
            <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-6 flex-1">Join our global family. Access exclusive content, track your spiritual journey.</p>
            <ul className="space-y-2 mb-4 md:mb-6 text-sm text-muted-foreground flex-1">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Access locked study materials</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Personalized recommendations</li>
            </ul>
            <Link to="/login">
              <span className="w-full bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer" data-testid="button-member-signup">
                Sign Up / Login
              </span>
            </Link>
          </div>

          <div className="bg-primary text-primary-foreground p-6 md:p-8 hover:bg-primary/95 transition-colors flex flex-col h-full md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center mb-4 md:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M5 6h14" /></svg>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 md:mb-3">Join as a Pastor</h3>
            <p className="text-primary-foreground/80 text-sm md:text-base mb-4 md:mb-6 flex-1">Partner with Bible Mission to host events, lead congregations, and spread the teachings.</p>
            <div className="space-y-3 md:space-y-4">
              <p className="text-sm font-medium text-white bg-white/10 p-3 md:p-4 border border-white/20">
                Submit event details, posters, and pin locations to be featured on our official pages.
              </p>
              <Link to="/connect">
                <span className="w-full bg-white text-primary py-2 text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center cursor-pointer" data-testid="button-pastor-apply">
                  Apply for Partnership
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
