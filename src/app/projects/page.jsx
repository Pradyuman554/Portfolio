'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Preload } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

const StarField = (props) => {
  const ref = useRef()
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }))

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

function Component() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    setProjects([
      // {
      //   id: 1,
      //   title: "AI-Powered Portfolio Generator",
      //   description: "A web application that uses AI to generate personalized portfolio websites based on user input and preferences.",
      //   image: "/placeholder.svg?height=400&width=600",
      //   video: "/placeholder.svg?height=400&width=600",
      //   github: "https://github.com/yourusername/ai-portfolio-generator",
      //   deployment: "https://ai-portfolio-generator.com"
      // },
      {
        id: 1,
        title: "Tessaract (Blockchain-based Supply Chain Tracker)",
        description: "A decentralized application (dApp) for tracking products through the supply chain, ensuring transparency and authenticity.",
        image: "assets/projects/supplychain/img1.png?height=400&width=600",
        // video: "/placeholder.svg?height=400&width=600",
        github: "https://github.com/withrajatsharma/supply-chain",
        // deployment: "https://github.com/withrajatsharma/supply-chain"
      },
      {
        id: 3,
        title: "Coding Platform",
        description: "An educational coading platform, you can play with code in playground or compete with others in coding challenges.",
        image: "assets/projects/coadingplatform/img1.png?height=400&width=600",
        // video: "/placeholder.svg?height=400&width=600",
        github: "https://github.com/Pheonixrog/Coading-Platform",
        // deployment: "https://ar-learn.edu"
      },
      {
        id: 4,
        title: "Portfolio",
        description: "A next.js portfolio website which showcases my skills and projects.",
        image: "assets/projects/porfolio/img1.png?height=400&width=600",
        // video: "/placeholder.svg?height=400&width=600",
        github: "https://github.com/Pheonixrog/PortfolioV2",
        // deployment: "https://ar-learn.edu"

      }
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarField />
          <Preload all />
        </Canvas>
      </div>
      
      <main className="container mx-auto px-4 py-16 relative z-10">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Projects
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Explore my latest work in web development, blockchain, and more.
        </motion.p>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <React.Fragment key={project.id}>
              <ProjectSection project={project} index={index} />
              {index < projects.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 bg-opacity-50 backdrop-blur-md py-8 mt-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Pradyuman Sharma. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const ProjectSection = ({ project, index }) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row items-center gap-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
        <Card className="overflow-hidden bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <img src={project.image} alt={project.title} className="w-full h-auto" />
            {project.video && (
              <video src={project.video} controls className="w-full mt-4">
                Your browser does not support the video tag.
              </video>
            )}
          </CardContent>
        </Card>
      </div>
      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
        <h2 className="text-3xl font-bold mb-4 text-purple-300">{project.title}</h2>
        <p className="text-gray-300 mb-6">{project.description}</p>
        <div className="flex flex-wrap gap-4">
          {project.github && (
            <Button className='bg-black' variant="outline" asChild>
              <Link href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </Link>
            </Button>
          )}
          {project.deployment && (
            <Button asChild>
              <Link href={project.deployment} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <ExternalLink className="w-5 h-5" />
                <span>Live Demo</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const Separator = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className="relative my-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
      style={{
        scaleX,
        transformOrigin: "left",
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8 }}
    />
  )
}

export default Component