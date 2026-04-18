import FadeInUp from "@/components/ui/FadeInUp";

const SHOW_METRICS = false;

export default function About() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white/[0.03] p-8 md:p-10">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">About Me</h2>
        </FadeInUp>
        <FadeInUp delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            I&apos;m a 3rd-year Computer Systems Engineering student at Carleton
            University, passionate about embedded and real-time operating
            systems. Currently developing firmware in C/C++ and desktop tools & 
            software in C# at Epocal, Siemens Healthineers, working on the 
            epoc&reg; Blood Analysis System.
          </p>
        </FadeInUp>
        <FadeInUp delay={0.3}>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            My work lives at the intersection of hardware and software; from
            QNX RTOS applications on Raspberry Pi to YOLOv8 computer vision
            pipelines, from microcontroller programming to cross-platform
            code generation tools. I focus on writing deterministic, reliable
            code and building systems that work when it matters.
          </p>
        </FadeInUp>

        {SHOW_METRICS && (
          <FadeInUp delay={0.45}>
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: "Co-op Terms", value: "2" },
                { label: "Projects Built", value: "6+" },
                { label: "Languages", value: "7+" },
                { label: "CGPA", value: "10+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInUp>
        )}
      </div>
    </section>
  );
}
