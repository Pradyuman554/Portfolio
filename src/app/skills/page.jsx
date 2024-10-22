"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import {
  Code,
  Globe,
  Brain,
  Database,
  Terminal,
  Cloud,
  Award,
  ChevronDown,
} from "lucide-react";

const StarField = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(20000), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.001}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const SkillIcon = ({ Icon }) => (
  <div className="bg-gray-800 p-2 rounded-full border-2 border-purple-500  ">
    <Icon className="w-6 h-6 text-purple-400" />
  </div>
);

const Skill = ({ name, description, Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 rounded-lg shadow-lg  transition-all duration-300 border border-purple-500/30 "
  >
    <div className="flex items-center mb-2">
      <SkillIcon Icon={Icon} />
      <h3 className="text-lg font-semibold text-purple-200 ml-2">{name}</h3>
    </div>
    <p className="text-sm text-purple-100/80">{description}</p>
  </motion.div>
);

const Certificate = ({ name, issuer, date, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 rounded-lg shadow-lg  transition-all duration-300 border border-purple-500/30 "
  >
    <div className="flex items-center mb-2">
      <Award className="w-6 h-6 text-purple-400 mr-2" />
      <h3 className="text-lg font-semibold text-purple-200">{name}</h3>
    </div>
    {image && (
      <img src={image} alt={name} className="w-full h-auto rounded-md mb-2" />
    )}
    <p className="text-sm text-purple-100/80">{issuer}</p>
    <p className="text-xs text-purple-200/60">{date}</p>
  </motion.div>
);

const SkillProgressBar = ({ skill, level }) => (
  <div className="my-2">
    <div className="flex justify-between mb-1">
      <span className="text-xs font-medium text-white">{skill}</span>
      <span className="text-xs font-medium text-white">{level}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div
        className="bg-purple-300 h-1.5 rounded-full"
        style={{ width: `${level}%` }}
      ></div>
    </div>
  </div>
);

const SkillSection = ({
  title,
  icon: Icon,
  skills = [],
  certificates = [],
  levels = [],
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-12">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-2xl font-bold text-purple-300  transition-colors duration-300"
      >
        <SkillIcon Icon={Icon} />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-200">
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-purple-400" />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap -mx-4">
              <div className="w-full lg:w-1/2 px-4">
                {skills.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-white mt-4 mb-2">
                      Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {skills.map((skill, index) => (
                        <Skill key={index} {...skill} />
                      ))}
                    </div>
                  </>
                )}
                {certificates.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-white mt-4 mb-2">
                      Certificates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.map((cert, index) => (
                        <Certificate key={index} {...cert} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="w-full lg:w-1/2 px-4">
                {levels.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-white mt-4 mb-2">
                      Skill Levels
                    </h3>
                    {levels.map((level, index) => (
                      <SkillProgressBar key={index} {...level} />
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Component() {
  const skillSections = [
    {
      title: "Coding Languages",
      icon: Code,
      skills: [
        {
          name: "JavaScript",
          description: "ES6+, Async/Await, Functional Programming , OOPs ",
          Icon: Code,
        },
        {
          name: "Python",
          description: "Numpy, Pandas, Machine Learning , Neural Networks",
          Icon: Code,
        },
        { name: "Java", description: "OOPs, Multithreading ", Icon: Code },
      ],
      levels: [
        { skill: "JavaScript", level: 70 },
        { skill: "Python", level: 75 },
        { skill: "Java", level: 80 },
      ],
      certificates: [
        {
          name: "Introduction to Python",
          issuer: "Coursera",
          date: "2024",
          image:
            "assets/Certifications/intro_to_python1.jpg?height=100&width=200",
        },
      ],
    },
    {
      title: "Core",
      icon: Brain,
      skills: [
        {
          name: "Computer Networks",
          description:
            "TCP/IP, HTTP, UDP , OSI Model , Network Security , Routing , Switching  ",
          Icon: Brain,
        },
        {
          name: "Multi-core computer architecture",
          description: " ",
          Icon: Brain,
        },
        {
          name: "DSA",
          description: "Arrays, Strings, Linked Lists, Stacks, Queues, Trees ",
          Icon: Brain,
        },
        {
          name: "OOPs",
          description: "Encapsulation, Abstraction, Inheritance, Polymorphism ",
          Icon: Brain,
        },
        // { name: "scikit-learn", description: "Machine Learning, Data Preprocessing", Icon: Brain },
      ],
      levels: [
        // { skill: "TensorFlow", level: 75 },
        // { skill: "PyTorch", level: 70 },
        // { skill: "scikit-learn", level: 65 }
      ],
      certificates: [
        {
          name: "Multi-Core Computer Architecture",
          issuer: "NPTEL",
          date: "2023",
          image:
            "assets/Certifications/Multi-Core Computer Architecture.jpg?height=100&width=200",
        },
      ],
    },
    {
      title: "Web Development",
      icon: Globe,
      skills: [
        {
          name: "Git version control",
          description: "Git, GitHub, GitLab ",
          Icon: Globe,
        },
        {
          name: "Next.js",
          description:
            "Server-side Rendering, Client-side Rendering, App-routing",
          Icon: Globe,
        },
        { name: "React", description: "Hooks, Next.js", Icon: Globe },
        { name: "HTML", description: "Semantic HTML", Icon: Globe },
        { name: "CSS", description: "Styled Components", Icon: Globe },
        { name: "Node.js", description: "Express, RESTful APIs", Icon: Globe },
        { name: "Express.js", description: "RESTful APIs", Icon: Globe },
      ],
      levels: [
        { skill: "Git version control", level: 90 },
        { skill: "Next.js", level: 80 },
        { skill: "React", level: 80 },
        { skill: "HTML", level: 90 },
        { skill: "CSS", level: 90 },
        { skill: "Node.js", level: 70 },
        { skill: "Express.js", level: 70 },
      ],
      certificates: [
        // { name: "Full Stack Web Developer", issuer: "FreeCodeCamp", date: "2023", image: "/placeholder.svg?height=100&width=200" },
        // { name: "Vue.js Mastery", issuer: "Vue School", date: "2022", image: "/placeholder.svg?height=100&width=200" },
      ],
    },
    {
      title: "Blockchain",
      icon: Globe,
      skills: [
        { name: "Solidity", description: " Solidity ", Icon: Globe },
        // { name: "HTML", description: "Semantic HTML", Icon: Globe },
        // { name: "CSS", description: "Styled Components", Icon: Globe },

        // { name: "Node.js", description: "Express, RESTful APIs", Icon: Globe },
      ],
      levels: [
        { skill: "Solidity", level: 80 },
        // { skill: "React", level: 80 },
        // { skill: "HTML", level: 90 },
        // { skill: "CSS", level: 90 },
        // { skill: "Node.js", level: 70 }
      ],
      certificates: [
        {
          name: "Blockchain by Infosys",
          issuer: "Infosys",
          date: "2023",
          image:
            "assets/Certifications/Blockchain infoyses.jpg?height=100&width=200",
        },
        // { name: "Full Stack Web Developer", issuer: "FreeCodeCamp", date: "2023", image: "/placeholder.svg?height=100&width=200" },
        // { name: "Vue.js Mastery", issuer: "Vue School", date: "2022", image: "/placeholder.svg?height=100&width=200" },
      ],
    },
    {
      title: "AI/ML",
      icon: Brain,
      skills: [
        {
          name: "TensorFlow",
          description: "Neural Networks, Deep Learning, Computer Vision",
          Icon: Brain,
        },
        {
          name: "Pandas",
          description: "Data Analysis, Data Preprocessing",
          Icon: Brain,
        },
        {
          name: "Matplotlib",
          description: "Data Visualization",
          Icon: Brain,
        },
      ],
      levels: [
        { skill: "TensorFlow", level: 75 },
        { skill: "Pandas", level: 70 },
        { skill: "Matplotlib", level: 65 },
      ],
      certificates: [
        {
          name: "Introduction to Machine learning",
          issuer: "NPTEL",
          date: "2024",
          image: "assets/Certifications/Introduction To Machine Learning - IITKGP_page-0001.jpg?height=100&width=200",
        },
        // {
        //   name: "Machine Learning Engineer",
        //   issuer: "Udacity",
        //   date: "2022",
        //   image: "/placeholder.svg?height=100&width=200",
        // },
      ],
    },
    {
      title: "Databases",
      icon: Database,
      skills: [
        {
          name: "MongoDB",
          description: "NoSQL, Aggregation Framework",
          Icon: Database,
        },
        {
          name: "PostgreSQL",
          description: "Relational, ACID, JSON support",
          Icon: Database,
        },
        { name: "Mysql", description: "Relational, ACID", Icon: Database },
      ],
      levels: [
        { skill: "MongoDB", level: 80 },
        { skill: "PostgreSQL", level: 75 },
        { skill: "Mysql", level: 80 },
      ],
      certificates: [
        {
          name: "Intro to database by META",
          issuer: "Coursera",
          date: "2024",
          image:
            "assets/Certifications/Coursera intro to database by meta_page-0001.jpg?height=100&width=200",
        },
        {
          name: "NO sql database by IBM",
          issuer: "Coursera",
          date: "2024",
          image:
            "assets/Certifications/Coursera No sql databases by ibm_page-0001.jpg?height=100&width=200",
        },
        {
          name: "Introduction to RDBMS by IBM",
          issuer: "Coursera",
          date: "2024",
          image:
            "assets/Certifications/Coursera introduction to RDBMS by ibm_page-0001.jpg?height=100&width=200",
        },
      ],
    },
    {
      title: "Operating Systems",
      icon: Terminal,
      skills: [
        {
          name: "Linux",
          description: "Ubuntu, debian, Shell scripting",
          Icon: Terminal,
        },
        {
          name: "Windows",
          description: "Server Administration, PowerShell",
          Icon: Terminal,
        },
      ],
      levels: [
        { skill: "Linux", level: 80 },
        { skill: "Windows", level: 85 },
      ],
      certificates: [
        // {
        //   name: "Linux System Administrator",
        //   issuer: "Linux Foundation",
        //   date: "2023",
        //   image: "/placeholder.svg?height=100&width=200",
        // },
        // {
        //   name: "Windows Server Certification",
        //   issuer: "Microsoft",
        //   date: "2022",
        //   image: "/placeholder.svg?height=100&width=200",
        // },
      ],
    },
    {
      title: "Cyber Security",
      icon: Terminal,
      skills: [
        { name: "Cyber Security", description: "Netwrok Security, Linux, Cloud Computing, Cryptography, Network Architecture, Computer Security Incident Management, SQL, Risk Management, Python Programming", Icon: Terminal },
      ],
      levels: [
        // { skill: "AWS", level: 80 }
      ],
      certificates: [
        {
          name: "Google Cybersecurity Professional Certificate",
          issuer: "Google",
          date: "2023",
          image:
            "assets/Certifications/Coursera google cybersecurity.jpg?height=100&width=200",
        },
      ],
    },
    {
      title: "Cloud Computing",
      icon: Cloud,
      skills: [
        { name: "AWS", description: "EC2, S3 ,  Load Balancer", Icon: Cloud },
      ],
      levels: [{ skill: "AWS", level: 80 }],
      certificates: [
        {
          name: "Cloud Computing",
          issuer: "NEPTEL",
          date: "2024",
          image:
            "assets/Certifications/Cloud Computing.jpg?height=100&width=200",
        },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-900 text-purple-100 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarField />
        </Canvas>
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-200"
          >
            My Skills Portfolio
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-16"
          >
            {skillSections.map((section, index) => (
              <SkillSection key={index} {...section} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
