import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ResourcesSection from "../components/ResourcesSection";
import MeetingsSection from "../components/MeetingsSection";
import MediaSection from "../components/MediaSection";
import DevotionalSection from "../components/DevotionalSection";
import CTASection from "../components/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ResourcesSection />
        <MeetingsSection />
        <MediaSection />
        <DevotionalSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
