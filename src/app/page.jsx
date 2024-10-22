'use client'

import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Preload, OrbitControls, shaderMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import { Button } from "@/components/ui/button"
import { Moon, Sun, Github, Linkedin, Code, FileText } from "lucide-react"
import { motion } from "framer-motion"
import * as THREE from 'three'


const BubbleMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color(0x4a0e4e),
    color2: new THREE.Color(0x0066ff),
    color3: new THREE.Color(0xffffff),
    mousePos: new THREE.Vector3(0, 0, 0),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying float vDisplacement;
  uniform float time;
  uniform vec3 mousePos;
  
  //	Simplex 3D Noise 
  //	by Ian McEwan, Ashima Arts
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  
  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    float noiseFreq = 1.5;
    float noiseAmp = 0.25;
    vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y, pos.z);
    pos.x += snoise(noisePos) * noiseAmp;
    pos.y += snoise(noisePos) * noiseAmp;
    pos.z += snoise(noisePos) * noiseAmp;
    
    // Add interactivity
    vec3 dir = pos - mousePos;
    float dist = length(dir);
    float strength = clamp(1.0 / (dist * dist), 0.0, 1.0);
    pos += normalize(dir) * strength * 0.1;
    
    vDisplacement = snoise(noisePos);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  }
  `,
  // Fragment Shader
  `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  
  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    vec3 color = mix(color1, color2, vDisplacement * 0.5 + 0.5);
    color = mix(color, color3, vDisplacement * 0.5 + 0.5);
    gl_FragColor = vec4(color, 1.0);
  }
  `
)

extend({ BubbleMaterial })

function StarBackground() {
  const ref = useRef()
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }))
  const { mouse, viewport } = useThree()

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
    
    // Add interactivity
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.01, 0.1)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, -y * 0.01, 0.1)
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]} ref={ref}>
      <Points positions={sphere} stride={3} frustumCulled={false}>
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

function FloatingBubble() {
  const meshRef = useRef()
  const { mouse, viewport } = useThree()

  useFrame((state) => {
    const { clock } = state
    meshRef.current.material.time = clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() / 2) * 0.1
    meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() / 4) * 0.2
    
    // Add interactivity
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    meshRef.current.material.mousePos.set(x, y, 0)
  })

  return (
    <mesh
      ref={meshRef}
      scale={1.2}
    >
      <icosahedronGeometry args={[1, 20]} />
      <bubbleMaterial 
        color1="#4a0e4e"
        color2="#0066ff"
        color3="#ffffff"
      />
    </mesh>
  )
}

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-red-500 hover:text-white transition-colors duration-200"
    aria-label={label}
  >
    <Icon className="w-7 h-7" />
  </a>
)

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(true)

 useEffect(() => {
  const cursor = document.createElement('div')
  cursor.className = 'custom-cursor'
  document.body.appendChild(cursor)

  const moveCursor = (e) => {
    cursor.style.left = `${e.clientX}px`
    cursor.style.top = `${e.clientY}px`
  }

  window.addEventListener('mousemove', moveCursor)

  return () => {
    window.removeEventListener('mousemove', moveCursor)
    if (document.body.contains(cursor)) {
      document.body.removeChild(cursor)
    }
  }
}, [])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        .custom-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid ${darkMode ? '#fff' : '#000'};
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: all 0.1s ease;
          transform: translate(-50%, -50%);
        }
        .hover-target:hover ~ .custom-cursor {
          transform: translate(-50%, -50%) scale(1.5);
        }
      `}</style>

      {/* 3D Animation Section */}
      <div className="h-screen w-full">
        <Canvas camera={{ position: [0, 0, 2] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <StarBackground />
            <FloatingBubble />
            <OrbitControls enableZoom={true} />
          </Suspense>
          <Preload all />
        </Canvas>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-extrabold mb-4 hover-target"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pradyuman Sharma
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 hover-target"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Full Stack Developer & Blockchain Developer
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center space-x-4 mb-8"
          >
            <SocialLink href="https://github.com/Pheonixrog" icon={Github} label="GitHub" />
            <SocialLink href="https://www.linkedin.com/in/pradyuman-5-sharma" icon={Linkedin} label="LinkedIn" />
            <SocialLink href="https://leetcode.com/u/pradyuman554/" icon={Code} label="LeetCode" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >

          <a
            href="https://docs.google.com/document/d/1u9EzfClYd6LLeCMgbrG7dfRLkaNsjuIvEIFxkdTDW6M/export?format=doc"
            download
          >
            <Button className="bg-purple-600 hover:bg-purple-700 hover-target">
              <FileText className="mr-2 h-4 w-4" /> Download Resume
            </Button>
          </a>

          </motion.div>
          
        </div>
        
      </div>

      {/* Theme Toggle */}
      <Button
        className="fixed bottom-4 right-4 p-2 rounded-full hover-target"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </Button>
      

      
    </div>
  )
}
