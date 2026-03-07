import { MapPin, BookOpen, Users, Globe, Heart, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const milestones = [
  { year: "1960s", title: "The Beginning", description: "Spiritual Father M.Devadas Ayyagaru began his ministry, dedicating his life to preaching the Gospel and writing foundational theological works." },
  { year: "1970s", title: "Growth & Expansion", description: "Bible Mission expanded across Andhra Pradesh with new congregations being established in multiple districts." },
  { year: "1980s", title: "National Reach", description: "The mission extended to other Indian states, with pastors being trained and sent to lead new communities." },
  { year: "1990s", title: "Publishing Ministry", description: "A significant body of books and study materials were published in both Telugu and English, reaching thousands of readers." },
  { year: "2000s", title: "Global Outreach", description: "Bible Mission began its international outreach, connecting with believers across the globe." },
  { year: "2020s", title: "Digital Ministry", description: "Embracing technology with livestreams, podcasts, and an online platform to continue the mission worldwide." },
];

const values = [
  { icon: BookOpen, title: "Biblical Truth", description: "We hold firmly to the inerrant Word of God as the foundation of all teaching and practice." },
  { icon: Heart, title: "Prayer & Devotion", description: "A life of prayer is central to our faith. We maintain a 24/7 prayer helpline for all who seek spiritual support." },
  { icon: Users, title: "Community", description: "We believe in the power of fellowship and the importance of gathering together for worship and mutual encouragement." },
  { icon: Globe, title: "Global Mission", description: "Our calling extends to every corner of the earth, proclaiming the truth and transforming lives worldwide." },
];

const leaders = [
  { name: "M.Devadas Ayyagaru", role: "Spiritual Father & Founder", description: "The visionary who founded Bible Mission and authored numerous books that continue to guide believers worldwide." },
  { name: "Senior Pastor", role: "Head Pastor, Guntur HQ", description: "Leads the main congregation at our Guntur headquarters and oversees the global ministry operations." },
  { name: "Regional Pastors", role: "State & International Leaders", description: "Dedicated pastors who lead congregations and organize events across India and around the world." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-widest mb-4 text-primary-foreground/70 font-medium">About Bible Mission</p>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight" data-testid="text-about-title">
                Rooted in Faith.<br />Growing Worldwide.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl">
                Bible Mission is a global religious organization headquartered in Guntur, Andhra Pradesh. Founded by our Spiritual Father M.Devadas Ayyagaru, we are committed to proclaiming biblical truth and nurturing believers across every nation.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Bible Mission was born out of a deep burden to bring the transformative message of the Gospel to the people of India and beyond. Our Spiritual Father, M.Devadas Ayyagaru, devoted his life to studying, writing, and teaching the Word of God.
                  </p>
                  <p>
                    What began as a small gathering of devoted believers in Guntur, Andhra Pradesh, has grown into a worldwide movement with pastors and congregations spanning multiple countries. The mission's growth is a testament to the faithfulness of God and the dedication of those who serve.
                  </p>
                  <p>
                    Today, Bible Mission continues to expand through digital platforms, bringing teachings, podcasts, livestreams, and an extensive library of books to seekers everywhere.
                  </p>
                </div>
              </div>
              <div className="bg-muted/30 border p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="font-serif text-xl font-bold">Headquarters</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Our headquarters are located in the heart of Guntur, Andhra Pradesh, India. This is where our annual conventions, pastoral training, and administrative operations are centered.
                </p>
                <div className="bg-background border p-4">
                  <p className="font-medium mb-1">Bible Mission Grounds</p>
                  <p className="text-sm text-muted-foreground">Guntur, Andhra Pradesh, India</p>
                  <p className="text-sm text-muted-foreground mt-2">Email: contact@biblemission.life</p>
                  <p className="text-sm text-muted-foreground">Website: biblemission.life</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg">The core principles that guide everything we do.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <div key={i} className="bg-background border p-8 hover:border-primary/30 transition-colors" data-testid={`card-value-${i}`}>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-center">Our Journey</h2>
            <div className="max-w-3xl mx-auto space-y-0">
              {milestones.map((item, i) => (
                <div key={i} className="flex gap-6 md:gap-10" data-testid={`timeline-item-${i}`}>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-bold">
                      {item.year.replace("s", "")}
                    </div>
                    {i < milestones.length - 1 && <div className="w-px flex-1 bg-border min-h-[40px]" />}
                  </div>
                  <div className="pb-10">
                    <h3 className="font-serif text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-center">Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {leaders.map((leader, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 text-center" data-testid={`card-leader-${i}`}>
                  <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white/60" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-1">{leader.name}</h3>
                  <p className="text-sm text-primary-foreground/60 mb-4">{leader.role}</p>
                  <p className="text-sm text-primary-foreground/80 leading-relaxed">{leader.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Want to Learn More?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              We'd love to hear from you. Reach out through our contact page or call our 24/7 prayer helpline.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/connect" className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium" data-testid="link-contact-us">
                Contact Us
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span className="font-medium">24/7 Helpline: +91 00000 00000</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
