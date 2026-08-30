import { Nav } from "@/components/Nav";
import { Hero } from "@/components/hero/Hero";
import { LiveDashboard } from "@/components/dashboard/LiveDashboard";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { hasResume } from "@/lib/resume";

export default function Home() {
  // Resolved on the server at build time — the CV CTAs only render once the
  // PDF actually exists in public/.
  const resume = hasResume();

  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero resume={resume} />
        <LiveDashboard />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact resume={resume} />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}
