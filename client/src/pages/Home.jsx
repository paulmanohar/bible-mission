import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ResourcesSection from "../components/ResourcesSection";
import MeetingsSection from "../components/MeetingsSection";
import BroadcastSection from "../components/BroadcastSection";
import PodcastSection from "../components/PodcastSection";
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
        <BroadcastSection />
        <PodcastSection />
        <DevotionalSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
