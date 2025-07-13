import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  Dcg,
  Current,
  video,
  threejs,
  Cholatrek,
  SmartDev,
  Netflix,
  testy1,
  testy2,
  testy3,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
];

const experiences = [
  {
    title: "Developer Team Lead",
    company_name: "Disciples Church of God ",
    icon: Dcg,
    iconBg: "#ffff",
    date: "March 2020 - present",
    points: [
      "Maintained a 100% user satisfaction rating by developing and implementing software solutions based on users requirements.",
      "Boosted team efficiency by 100% by providing direction for Streaming activities.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Internship",
    company_name: "Cholatrek training institute",
    icon: Cholatrek,
    iconBg: "#ffff",
    date: "Sep 2021 - Dec 2022",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Community Lead",
    company_name: "SmartDev",
    icon: SmartDev,
    iconBg: "#ffff",
    date: "Jan 2022 - Present",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },

];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Solomon proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: testy1,
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rey Thompson does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: testy2,
  },
  {
    testimonial:
      "After Mr solomon optimized our website, our traffic increased by 50%. We can't thank him enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: testy3,
  },
];

const projects = [
  {
    name: "Sociaunifi",
    description:
      "Web-based platform that allows users to chat, watch videos, and manage friend request, providing a convenient and efficient solution for communication and entertainment needs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "firebase",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: Current,
    main_app_link: "https://thompsonsolomonsocialapp.netlify.app/",
    source_code_link: "https://sociaunifi.netlify.app/",
  },
  {
    name: "Trailer Trove ",
    description:
      "Web application that enables users to watch movie traliers and get entertained, with a user interface like the updated netflix .",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "rest-api",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: Netflix,
    main_app_link: "https://trailertrove.netlify.app/",
    source_code_link: "https://github.com/thompsonsolomon/Project",
  },
  {
    name: "Talk Tube",
    description:
      "A comprehensive Video call platform that allows users to make calls, shear emotions  and offers more than expected satisfaction.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: video,
    source_code_link: "https://thompsonsolomon-video-call.netlify.app",
    main_app_link: "https://tolktube.netlify.app/",
  },
];

export { services, technologies, experiences, testimonials, projects };
