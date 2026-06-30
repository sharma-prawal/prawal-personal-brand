import { createImageMeta } from "./imageMetadata.js";

export const profilePortrait = {
  title: "Prawal Sharma portrait",
  src: "/media/profile/IMG_2574.JPG",
  alt: "Prawal Sharma professional portrait",
  date: "Current profile asset",
  category: "Executive portrait",
  caption: "Professional portrait used as the primary executive brand image.",
  featured: true,
  priority: true
};

const professionalHighlightRecords = [
  {
    title: "USA Client Business Visit",
    category: "Client engagement",
    context: "Business travel to the United States for client-facing collaboration, relationship building, and delivery alignment.",
    story:
      "B1/B2 business visa holder with documented US onsite delivery — proof of international client-facing capability, stakeholder trust, and the ability to show up in person, not just deliver remotely.",
    proofLabel: "5 client visit photos",
    images: [
      "/media/usa_visit/502755631_9955026841221434_8795860600647518005_n.jpg",
      "/media/usa_visit/553760021_24637343969229812_8881836766352855585_n.jpg",
      "/media/usa_visit/555056820_24637344292563113_300192269111598785_n.jpg",
      "/media/usa_visit/555218569_24637344249229784_3002671700096038778_n.jpg",
      "/media/usa_visit/4003BE2D-7BD2-40C0-A013-BBC62CC819B6 (1).JPEG"
    ],
    links: []
  },
  {
    title: "Book Contributor",
    category: "Publication contribution",
    context: "Contributor to The Subtle Art of Effective Communication, an organizational book on communication and listening skills.",
    story:
      "A public professional artifact that demonstrates contribution beyond engineering delivery and reinforces communication as a leadership capability.",
    proofLabel: "3 book contribution pages",
    images: [
      "/media/book_contributor/the-subtle-art-of-effective-communication-original-imagny4gqm78nwn3.webp",
      "/media/book_contributor/81u7lEVEeKL._SL1500_.jpg",
      "/media/book_contributor/1680621098666.jpeg"
    ],
    links: [
      { label: "Verify on Amazon", url: "https://amzn.eu/d/fgmVx7H" },
      { label: "Verify on Flipkart", url: "https://bit.ly/40XXDR0" }
    ]
  }
];

export const professionalHighlights = professionalHighlightRecords.map((highlight) => ({
  ...highlight,
  images: highlight.images.map((src, index) =>
    createImageMeta(src, {
      title: `${highlight.title} proof ${index + 1}`,
      date: "Professional proof archive",
      category: highlight.category,
      alt: `${highlight.title} proof image ${index + 1}`,
      caption: index === 0 ? highlight.context : `${highlight.title} supporting proof image ${index + 1}.`,
      featured: index === 0,
      priority: index === 0
    })
  )
}));

export const internationalExposure = {
  title: "Onsite client delivery, B1/B2 visa, and global operating range",
  category: "Global delivery footprint",
  summary:
    "US onsite client delivery on a B1/B2 business visa — direct proof of international client-facing capability. UK and South Africa stakeholder alignment across multi-year engagements. Personal travel across Southeast Asia and the Middle East adds the cultural range to operate comfortably in any geography.",
  note:
    "The B1/B2 visa signals something specific: the ability to show up in person for clients in the US, not just deliver remotely. Combined with years of UK and South Africa stakeholder alignment, this is a global operating profile — not a global-delivery claim.",
  professionalCountries: ["United States", "United Kingdom", "South Africa"],
  personalCountries: ["Phuket", "Nepal", "Vietnam", "Dubai"],
  countries: ["United States", "United Kingdom", "South Africa", "Phuket", "Nepal", "Vietnam", "Dubai"]
};

const awardRecords = [
  {
    title: "ESOP Ownership Achievement Award",
    issuer: "Successive Digital",
    date: "May 2026",
    description:
      "Recognition for long-term contribution, ownership mindset, and commitment toward organizational success.",
    images: [
      "/media/awards/ESOP Ownership Achievement Award/1777978180889.jpeg",
      "/media/awards/ESOP Ownership Achievement Award/1777978177532 (1).jpeg"
    ]
  },
  {
    title: "Outstanding Contribution Award",
    issuer: "Successive Digital",
    date: "May 2026",
    description:
      "Recognition for impactful engineering initiatives, ownership, collaboration, and contribution toward growth.",
    images: [
      "/media/awards/Outstanding Contribution Award/1777978179122.jpeg",
      "/media/awards/Outstanding Contribution Award/1777978177532.jpeg"
    ]
  },
  {
    title: "Employee of the Year (2023)",
    issuer: "Successive Digital",
    date: "April 2023",
    description: "Recognition for exceptional contribution to organizational growth and delivery excellence.",
    images: [
      "/media/awards/Employee of the Year (2023)/1680621106464.jpeg",
      "/media/awards/Employee of the Year (2023)/1680621100730 (1).jpeg"
    ]
  },
  {
    title: "Key Contributor Award",
    issuer: "Successive Digital",
    date: "April 2023",
    description: "Recognition as a key contributor for sustained engineering and delivery impact.",
    images: [
      "/media/awards/Key Contributor Award/1680621100730.jpeg"
    ]
  },
  {
    title: "Longevity Award",
    issuer: "Successive Digital",
    date: "April 2023",
    description: "Recognition for five valuable years of contribution with Successive Digital.",
    images: [
      "/media/awards/Longevity Award/1680621120058.jpeg",
      "/media/awards/Longevity Award/1680621100730.jpeg"
    ]
  },
  {
    title: "Exceptional Performer",
    issuer: "Successive Digital",
    date: "March 2022",
    description: "Recognition for consistently exceeding performance benchmarks.",
    images: [
      "/media/awards/Exceptional Performer/1646132398670.jpeg",
      "/media/awards/Exceptional Performer/1646132402394.jpeg"
    ]
  },
  {
    title: "Extra Achiever's Award",
    issuer: "Successive Digital",
    date: "March 2021",
    description: "Recognition for extra effort and commitment during lockdown work-from-home delivery.",
    images: [
      "/media/awards/Extra Achiever’s Award/1614768213256.jpeg",
      "/media/awards/Extra Achiever’s Award/1614768212327.jpeg",
      "/media/awards/Extra Achiever’s Award/1614768212887.jpeg",
      "/media/awards/Extra Achiever’s Award/1614768224497.jpeg",
      "/media/awards/Extra Achiever’s Award/1614768225532.jpeg"
    ]
  },
  {
    title: "Client Happiness Award",
    issuer: "Successive Digital",
    date: "March 2019",
    description: "Recognition for building client trust, delivery confidence, and strong stakeholder satisfaction.",
    images: ["/media/awards/Client Happiness Award/Screenshot 2026-05-20 at 12.56.11-PM.png"]
  },
  {
    title: "Star Performer of the Month",
    issuer: "Successive Digital",
    date: "February 2019",
    description: "Recognition as Star Performer of the Month.",
    images: ["/media/awards/Star Performer of the Month - 2019/Screenshot 2026-05-20 at 12.57.00-PM.png"]
  },
  {
    title: "Star Performer of the Month",
    issuer: "Successive Digital",
    date: "July 2018",
    description: "First Star Performer of the Month recognition.",
    images: ["/media/awards/Star Performer of the Month - 2018/Screenshot 2026-05-20 at 1.01.44-PM.png"]
  }
];

export const awardAssets = awardRecords.map((award) => ({
  ...award,
  category: "Award recognition",
  images: award.images.map((src, index) =>
    createImageMeta(src, {
      title: `${award.title} proof ${index + 1}`,
      date: award.date,
      category: "Award recognition",
      alt: `${award.title} award proof ${index + 1}`,
      caption: index === 0
        ? `${award.title} from ${award.issuer}. ${award.description}`
        : `${award.title} supporting award proof ${index + 1}.`,
      featured: index === 0,
      priority: index === 0
    })
  )
}));

const conferenceRecords = [
  {
    title: "AI Impact Summit",
    location: "In-person AI event",
    year: "2026",
    eventType: "AI & Leadership",
    theme: "Artificial intelligence, enterprise adoption, and leadership perspective.",
    takeaway: "Translate AI adoption signals into practical engineering leadership choices.",
    images: [
      "/media/conferences/AI Impact Summit/IMG_6382.JPG",
      "/media/conferences/AI Impact Summit/IMG_6444 (1).JPG",
      "/media/conferences/AI Impact Summit/IMG_6474.JPG",
      "/media/conferences/AI Impact Summit/IMG_6450.JPG",
      "/media/conferences/AI Impact Summit/IMG_6453.JPG",
      "/media/conferences/AI Impact Summit/ai-impact-summit-stage.png"
    ]
  },
  {
    title: "AWS Symposium",
    location: "Cloud industry event",
    year: "2023",
    eventType: "Cloud Platform",
    theme: "AWS ecosystem, cloud architecture, and platform modernization.",
    takeaway: "Strengthen cloud-native perspective through direct platform and ecosystem exposure.",
    images: [
      "/media/conferences/AWS Symposium/1695625609596.jpeg",
      "/media/conferences/AWS Symposium/1695625604932.jpeg",
      "/media/conferences/AWS Symposium/1695625606653.jpeg",
      "/media/conferences/AWS Symposium/1695625607136.jpeg",
      "/media/conferences/AWS Symposium/1695625619844.jpeg"
    ]
  },
  {
    title: "Convergence India Expo 2026",
    location: "Technology expo",
    year: "2026",
    eventType: "Technology Expo",
    theme: "Digital infrastructure, emerging technology, and enterprise innovation.",
    takeaway: "Track industry shifts across digital platforms, AI, and connected ecosystems.",
    images: [
      "/media/conferences/Convergence India Expo 2026/IMG_7754.JPG",
      "/media/conferences/Convergence India Expo 2026/IMG_7747.JPG",
      "/media/conferences/Convergence India Expo 2026/IMG_7872.jpg",
      "/media/conferences/Convergence India Expo 2026/IMG_7649.JPG",
      "/media/conferences/Convergence India Expo 2026/IMG_7671.JPG",
      "/media/conferences/Convergence India Expo 2026/IMG_7696.JPG"
    ]
  },
  {
    title: "Deloitte Fast 50",
    location: "Leadership and recognition forum",
    year: "2023",
    eventType: "Invite-Only Forum",
    theme: "High-growth companies, technology leadership, and business momentum.",
    takeaway: "Connect engineering leadership to growth, execution quality, and business outcomes.",
    images: [
      "/media/conferences/Deloitte Fast 50/IMG_0368.jpg",
      "/media/conferences/Deloitte Fast 50/IMG_0372.jpg",
      "/media/conferences/Deloitte Fast 50/IMG_0383.jpg",
      "/media/conferences/Deloitte Fast 50/IMG_0393.jpg",
      "/media/conferences/Deloitte Fast 50/TechFast50_109.jpg",
      "/media/conferences/Deloitte Fast 50/TechFast50_126.jpg",
      "/media/conferences/Deloitte Fast 50/TechFast50_241.jpg",
      "/media/conferences/Deloitte Fast 50/TechFast50_787.jpg",
      "/media/conferences/Deloitte Fast 50/TechFast50_790.jpg"
    ]
  },
  {
    title: "IAMAI",
    location: "Digital industry forum",
    year: "2023",
    eventType: "National Forum",
    theme: "Internet, mobile, AI, and digital ecosystem conversations.",
    takeaway: "Stay close to industry direction across technology, policy, and digital adoption.",
    images: [
      "/media/conferences/IAMAI/2.jpg",
      "/media/conferences/IAMAI/3.jpeg",
      "/media/conferences/IAMAI/1.jpg",
      "/media/conferences/IAMAI/4.jpg"
    ]
  },
  {
    title: "MongoDB.local 2024",
    location: "Developer platform event",
    year: "2024",
    eventType: "Developer Event",
    theme: "Modern data platforms, developer productivity, and application architecture.",
    takeaway: "Connect data platform practices with scalable application and backend architecture.",
    images: [
      "/media/conferences/MongoDB.Local/2024/1694762207825.jpeg",
      "/media/conferences/MongoDB.Local/2024/1694762216252.jpeg",
      "/media/conferences/MongoDB.Local/2024/1694762220918.jpeg",
      "/media/conferences/MongoDB.Local/2024/Screenshot 2026-05-21 at 11.53.08-AM.png"
    ]
  },
  {
    title: "MongoDB.local 2025",
    location: "Developer platform event",
    year: "2025",
    eventType: "Developer Event",
    theme: "Data modeling, developer workflows, and modern database platforms.",
    takeaway: "Continue building depth in data-backed application platforms.",
    images: ["/media/conferences/MongoDB.Local/2025/unnamed (2).png"]
  },
  {
    title: "Unicommerce",
    location: "Enterprise commerce technology event",
    year: "2023",
    eventType: "Commerce Platform",
    theme: "Commerce platforms, operational systems, and digital business workflows.",
    takeaway: "Observe how scalable systems support operational and business execution.",
    images: [
      "/media/conferences/Unicommerce/3.jpg",
      "/media/conferences/Unicommerce/5.jpg",
      "/media/conferences/Unicommerce/2.jpg",
      "/media/conferences/Unicommerce/1.jpg",
      "/media/conferences/Unicommerce/4.jpg"
    ]
  }
];

export const conferenceAssets = conferenceRecords.map((conference) => ({
  ...conference,
  category: "Conference presence",
  images: conference.images.map((src, index) =>
    createImageMeta(src, {
      title: `${conference.title} proof ${index + 1}`,
      date: "Event proof archive",
      category: "Conference presence",
      alt: `${conference.title} conference proof image ${index + 1}`,
      caption: index === 0 ? conference.theme : `${conference.title} supporting conference moment ${index + 1}.`,
      featured: index === 0,
      priority: index === 0
    })
  )
}));
