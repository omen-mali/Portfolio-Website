import SplashScreen from "@/components/splash/SplashScreen";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Community from "@/components/sections/Community";
import Interests from "@/components/sections/Interests";
import Showcase from "@/components/sections/Showcase";
import Terminal from "@/components/sections/Terminal";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import ScrollToSection from "@/components/layout/ScrollToSection";
import ScrollDots from "@/components/layout/ScrollDots";

export default function Home() {
  return (
    <>
      <ScrollToSection />
      <SplashScreen />
      <Navbar />
      <ScrollDots />
      <main id="main-content">
        <Hero />
        {/* Everything below the hero sits on a solid panel slightly lighter
            than the base background, hiding the dot grid / starfield while
            still sitting behind content and filled containers. */}
        <div className="section-underlay relative">
          <Terminal />
          <About />
          <Showcase />
          <Experience />
          <Projects />
          <Skills />
          <Community />
          <Interests />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
