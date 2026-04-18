import SplashScreen from "@/components/splash/SplashScreen";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Showcase from "@/components/sections/Showcase";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import ScrollToSection from "@/components/layout/ScrollToSection";

export default function Home() {
  return (
    <>
      <ScrollToSection />
      <SplashScreen />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Showcase />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
