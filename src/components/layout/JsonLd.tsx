const SITE_URL = "https://momenali.com";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Momen Ali",
    url: SITE_URL,
    jobTitle: "Embedded Software Engineer",
    description:
      "Embedded Software Engineer & Systems Programmer specializing in QNX, Linux, C#, Python, and Java.",
    sameAs: ["https://www.linkedin.com/in/momen-m-ali/"],
    knowsAbout: [
      "QNX",
      "Linux",
      "Embedded Systems",
      "Systems Programming",
      "C",
      "C++",
      "C#",
      "Python",
      "Java",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
