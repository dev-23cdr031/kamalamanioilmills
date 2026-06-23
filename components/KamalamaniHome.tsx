'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Image from 'next/image'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Leaf,
  Menu,
  Quote,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const products = [
  { name: 'Groundnut Oil', pack: '1 Litre Pouch', size: '1 l', price: '₹210', image: '/products/product-groundnut-pouch-tall.png', benefit: 'Pure groundnut oil in a compact half litre pouch for everyday cooking.', features: ['Compact pack', 'Freshness protected', 'Kitchen friendly'] },
  { name: 'Groundnut Oil', pack: 'Half Litre Pouch', size: '500 ml', price: '₹112', image: '/products/product-groundnut-pouch.png', benefit: 'Naturally aromatic groundnut oil in a convenient family pouch.', features: ['Selected groundnuts', 'Rich natural aroma', 'Fresh pouch pack'] },
  { name: 'Groundnut Oil Bottle', pack: '1 Litre Bottle', size: '1 L', price: '₹220', image: '/products/product-groundnut-bottle-amber.png', benefit: 'Premium groundnut oil bottle with clean pouring and sealed freshness.', features: ['Easy-pour bottle', 'Premium packaging', 'Sealed freshness'] },
  { name: 'Groundnut Oil Can', pack: '5 Litre Can', size: '5 L', price: '₹1066', image: '/products/product-groundnut-can-5l.png', benefit: 'Sturdy can packaging designed for regular cooking and bulk needs.', features: ['Strong can', 'Value pack', 'Secure closure'] },
  { name: 'Groundnut Oil Tin', pack: '15 kg Tin', size: '15 kg', price: '₹3400', image: '/products/groundnut-oil-15kg-tin.jpg', benefit: 'Bulk groundnut oil tin for hotels, stores, and regular family cooking needs.', features: ['15 kg tin', 'Bulk value', 'Shop-ready pack'] },
  { name: 'Palm Oil Tin', pack: '15 kg Tin', size: '15 kg', price: '₹2480', image: '/products/palm-oil-15kg-tin.jpg', benefit: 'Reliable palm oil tin for consistent frying, cooking, and commercial kitchen use.', features: ['15 kg tin', 'Consistent cooking', 'Bulk pack'] },
  { name: 'Groundnut Oil Cake', pack: 'Per kg', size: '1 kg', price: '₹60', image: '/products/groundnut-oil-cake.jpg', benefit: 'Groundnut oil cake available by weight, packed for farm and feed requirements.', features: ['₹60 per kg', 'Groundnut cake', 'By weight'] },
  { name: 'Palm Oil', pack: '1 Litre Pouch', size: '1 L', price: '₹153', image: '/products/product-palmolein-pouch-1l.png', benefit: 'A refined, dependable palm oil pouch for crisp and consistent everyday cooking.', features: ['1 litre pouch', 'Refined palmolein', 'Family pack'] },
  { name: 'Palm Oil', pack: 'Half Litre Pouch', size: '500 ml', price: '₹78', image: '/products/product-palmolein-pouch.png', benefit: 'A refined, dependable palm oil pouch for smaller kitchens and daily use.', features: ['500 ml pouch', 'Refined quality', 'Economical pack'] },
]

const founders = [
  { name: 'S C Periyasamy', image: '/founders/s-c-periyasamy.jpg', role: 'Founder', note: 'A founding force behind Kamalamani Oil Mills, remembered for discipline, trust, and a deep respect for honest trade.', position: '50% 36%' },
  { name: 'C P Thinakaran', image: '/founders/c-p-thinakaran.jpg', role: 'Founder', note: 'Carried the family standard forward with steady leadership and a belief that quality must be visible in every batch.', position: '50% 24%' },
  { name: 'C P Churchill', image: '/founders/c-p-churchill.jpg', role: 'Founder', note: 'Helped shape the mill with practical care, operational focus, and a commitment to dependable products.', position: '50% 22%' },
  { name: 'C P Guna Sekaran', image: '/founders/c-p-guna-sekaran.jpg', role: 'Founder', note: 'Strengthened the legacy through consistency, responsibility, and service to homes and shopkeepers.', position: '50% 24%' },
]

const journey = [
  { title: 'Seed', image: '/process/seed.jpg', copy: 'Great oil begins before the mill starts. We choose clean, mature groundnuts with the rich character needed for a naturally golden colour, comforting aroma, and dependable taste.', tone: '#0d2b1f' },
  { title: 'Harvest', image: '/process/harvest-groundnuts.jpg', copy: 'From the field, every batch is handled with care so the freshness of the nut is protected. This is where honest sourcing becomes the flavour families remember.', tone: '#293b19' },
  { title: 'Processing', image: '/process/processing.jpg', copy: 'Selected groundnuts move through a disciplined process designed to preserve taste, clarity, and consistency. The result is oil that looks pure, cooks beautifully, and feels premium from the first pour.', tone: '#403416' },
  { title: 'Testing', image: '/process/testing.jpg', copy: 'Before it carries our name, every batch is checked for freshness, clarity, aroma, and cooking confidence. Quality is not promised at the end. It is verified at every step.', tone: '#183125' },
  { title: 'Packaging', image: '/process/packaging.jpg', copy: 'Fresh oil is packed with care so its colour, aroma, and trust stay protected until it reaches shops and homes. Strong packaging means customers receive the same standard every time.', tone: '#382716' },
  { title: 'Kitchen', image: '/process/kitchen.jpg', copy: 'In the kitchen, Kamalamani becomes part of everyday meals: crisp dosas, fragrant gravies, festive sweets, and family recipes that deserve oil with purity you can see and taste.', tone: '#10291d' },
]

const machines = [
  { title: 'Oil Press Gears', image: '/machinery/oil-press-gears.jpg' },
  { title: 'Filter Press', image: '/machinery/filter-press.jpg' },
  { title: 'Rotary Press', image: '/machinery/rotary-press.jpg' },
  { title: 'Expeller Line', image: '/machinery/expeller-line.jpg' },
  { title: 'Bottle Filling', image: '/machinery/bottle-filling.jpg' },
]

const testimonials = [
  {
    name: 'Dev Dharrshan',
    city: 'Virudhunagar, Tamil Nadu',
    image: '/testimonials/dev-dharrshan.jpg',
    avatarPosition: '56% 88%',
    avatarScale: 1,
    review: 'Kamalamani Oil Mills delivers exceptional quality and purity. The aroma and freshness of their groundnut oil truly stand out. Their commitment to quality makes them our first choice every time.',
  },
  {
    name: 'Divya Dharshini',
    city: 'Namakkal, Tamil Nadu',
    image: '/testimonials/divya-dharshini-clean.jpg',
    avatarPosition: '58% 50%',
    avatarScale: 1,
    review: 'I am highly impressed by the consistency and quality of their products. The oils are fresh, healthy, and packaged professionally. Excellent customer experience.',
  },
  {
    name: 'Karupuchaamy Aishwarya',
    city: 'Visakhapatnam, Andhra Pradesh',
    image: '/testimonials/karupuchaamy-aishwarya.jpg',
    avatarPosition: '54% 58%',
    avatarScale: 1,
    review: 'The quality standards maintained by Kamalamani Oil Mills are outstanding. Every purchase reflects trust, purity, and professionalism.',
  },
  {
    name: 'Anusree',
    city: 'Tiruppur, Tamil Nadu',
    image: '/testimonials/anusree.jpg',
    avatarPosition: '60% 56%',
    avatarScale: 1,
    review: 'The products are of premium quality and the customer support is excellent. I confidently recommend Kamalamani Oil Mills to others.',
  },
  {
    name: 'Avaneesh',
    city: 'Erode, Tamil Nadu',
    image: '/testimonials/avaneesh.jpg',
    avatarPosition: '48% 56%',
    avatarScale: 1,
    review: 'Reliable quality, hygienic packaging, and excellent service. Kamalamani Oil Mills has consistently exceeded expectations.',
  },
  {
    name: 'Arvind',
    city: 'Karur, Tamil Nadu',
    image: '/testimonials/arvind.jpg',
    avatarPosition: '38% 54%',
    avatarScale: 1,
    review: 'The purity and freshness of the oils are remarkable. Their dedication to maintaining high standards is clearly visible in every product.',
  },
]

function AvatarImage({ testimonial, large = false }: { testimonial: (typeof testimonials)[number]; large?: boolean }) {
  return (
    <div className={`${large ? 'h-36 w-28 md:h-44 md:w-36' : 'h-28 w-24'} group/avatar relative shrink-0 overflow-hidden rounded-[1rem] border-2 border-[#e5bd64] bg-[#092019] shadow-[0_0_0_6px_rgba(215,170,79,.09),0_0_34px_rgba(215,170,79,.26)] transition duration-500 hover:scale-[1.04] hover:shadow-[0_0_0_8px_rgba(215,170,79,.12),0_0_48px_rgba(239,211,127,.42)]`}>
      <Image
        src={testimonial.image}
        alt={`${testimonial.name} customer photo`}
        fill
        sizes={large ? '144px' : '96px'}
        className="object-cover transition duration-700 group-hover/avatar:brightness-110"
        style={{
          objectPosition: testimonial.avatarPosition,
          transform: `scale(${testimonial.avatarScale})`,
        }}
      />
      <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/20" />
    </div>
  )
}

function TestimonialFocusImage({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[1.5rem] border border-[#e5bd64]/50 bg-[#092019] shadow-[0_30px_90px_rgba(0,0,0,.35)]">
      <Image
        src={testimonial.image}
        alt={`${testimonial.name} customer photo`}
        fill
        sizes="(max-width: 1024px) 90vw, 360px"
        className="object-cover"
        style={{ objectPosition: testimonial.avatarPosition, transform: `scale(${testimonial.avatarScale})` }}
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
    </div>
  )
}

function TestimonialCard({ testimonial, onOpen }: { testimonial: (typeof testimonials)[number]; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onOpen()
      }}
      whileHover={{ y: -10, rotateX: 3, rotateY: -3, scale: 1.018 }}
      className="testimonial-card group relative flex h-[360px] w-[360px] shrink-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#e6bd62]/18 bg-white/[.075] p-7 text-left shadow-[0_28px_90px_rgba(0,0,0,.24)] backdrop-blur-2xl transition duration-500 hover:border-[#f4d98f]/55 hover:shadow-[0_34px_110px_rgba(0,0,0,.32),0_0_44px_rgba(215,170,79,.18)] md:w-[420px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(245,210,127,.22),transparent_38%)] opacity-60 transition group-hover:opacity-100" />
      <div className="relative z-10 flex items-center gap-4">
        <AvatarImage testimonial={testimonial} />
        <div className="min-w-0">
          <h3 className="truncate font-display text-2xl leading-tight text-[#fff1c9]">{testimonial.name}</h3>
          <p className="mt-1 text-[10px] uppercase tracking-[.18em] text-white/42">{testimonial.city}</p>
        </div>
      </div>
      <div className="relative z-10 mt-7 flex gap-1 text-lg text-[#e5bd64]" aria-label="5 star rating">★★★★★</div>
      <Quote className="relative z-10 mt-6 h-8 w-8 text-[#e5bd64]/70" />
      <p className="relative z-10 mt-4 text-sm leading-7 text-white/68">{testimonial.review}</p>
      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-white/10 pt-5">
        <span className="text-[9px] font-bold uppercase tracking-[.22em] text-[#e5bd64]">Tap to focus</span>
        <ArrowUpRight className="h-4 w-4 text-[#e5bd64] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </motion.button>
  )
}

function GoldenDrop() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.35
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.55) * 0.08
  })

  return (
    <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.7}>
      <mesh ref={ref} scale={[1.25, 1.65, 1.25]} position={[0, 0.1, 0]}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhysicalMaterial
          color="#d7a846"
          metalness={0.55}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={2.4}
        />
      </mesh>
      <mesh position={[0, 1.28, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.72, 0.72, 0.72]}>
        <coneGeometry args={[0.72, 1.5, 64]} />
        <meshPhysicalMaterial color="#d7a846" metalness={0.55} roughness={0.12} clearcoat={1} />
      </mesh>
    </Float>
  )
}

function DropletScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 36 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 5]} intensity={4} color="#fff1bc" />
      <pointLight position={[-4, -2, 3]} intensity={2} color="#a86b18" />
      <GoldenDrop />
      <Environment preset="sunset" />
    </Canvas>
  )
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`${compact ? 'h-16 w-16 md:h-18 md:w-18' : 'h-32 w-32'} relative overflow-hidden rounded-full border border-[#d7aa4f]/45 bg-[#009f51] shadow-[0_0_28px_rgba(215,170,79,.18)]`}

      aria-label="Kamalamani brand logo"
      role="img"
    >
      <Image
        src="/kamalamani-product-logo.jpg"
        alt="Kamalamani product logo"
        fill
        sizes={compact ? '64px' : '128px'}
        priority={false}
        className="object-contain p-2 [image-rendering: -webkit-optimize-contrast] [image-rendering: crisp-edges]"
      />
    </div>
  )
}


function MagneticButton({ href, children, filled = false }: { href: string; children: React.ReactNode; filled?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 170, damping: 16 })
  const springY = useSpring(y, { stiffness: 170, damping: 16 })

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((event.clientX - rect.left - rect.width / 2) * 0.22)
        y.set((event.clientY - rect.top - rect.height / 2) * 0.22)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className={`liquid-button relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border px-7 text-[11px] font-bold uppercase tracking-[.2em] transition-colors ${
        filled ? 'border-[#d7aa4f] bg-[#d7aa4f] text-[#071a13] hover:text-[#071a13]' : 'border-white/25 bg-white/5 text-white hover:text-[#071a13]'
      }`}
    >
      <span>{children}</span>
      <ArrowUpRight className="relative z-10 h-4 w-4" />
    </motion.a>
  )
}

function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 3000)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: .65 }}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#030a07]"
    >
      <motion.div
        initial={{ y: '-38vh', scale: .5 }}
        animate={{ y: '7vh', scale: 1 }}
        transition={{ duration: 1.45, ease: [0.55, 0, 0.7, 1] }}
        className="h-12 w-10 rounded-[60%_40%_65%_35%/70%_45%_55%_30%] bg-gradient-to-br from-[#fff0ae] via-[#d9a33e] to-[#7d4c0d] shadow-[0_0_50px_rgba(225,177,78,.5)]"
      />
      <motion.div
        initial={{ scale: 0, opacity: .8 }}
        animate={{ scale: 12, opacity: 0 }}
        transition={{ delay: 1.43, duration: 1.15, ease: 'easeOut' }}
        className="absolute top-[57%] h-24 w-24 rounded-full border border-[#e1b451]"
      />
      <motion.div
        initial={{ opacity: 0, filter: 'blur(14px)', y: 12 }}
        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ delay: 1.75, duration: .9 }}
        className="absolute top-[60%] flex flex-col items-center text-center"
      >
        <div className="mb-5"><BrandLogo /></div>
        <div className="font-display text-3xl tracking-[.12em] text-[#f0d58e]">KAMALAMANI</div>
        <div className="mt-2 text-[9px] tracking-[.55em] text-white/55">OIL MILLS</div>
      </motion.div>
    </motion.div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const links = [['Legacy', '#legacy'], ['Founders', '#founders'], ['Products', '#products'], ['Machinery', '#machinery'], ['Process', '#journey'], ['Reviews', '#testimonials'], ['Quality', '#quality']]
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071a13]/45 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-5 md:px-10">
        <a href="#home" className="flex items-center gap-3">
          <BrandLogo compact />
          <div>
            <div className="font-display text-xl leading-none tracking-[.08em] text-[#f2d991]">KAMALAMANI</div>
            <div className="mt-1 text-[7px] tracking-[.45em] text-white/45">OIL MILLS</div>
          </div>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => <a key={label} href={href} className="text-[10px] uppercase tracking-[.2em] text-white/60 transition hover:text-[#edcf82]">{label}</a>)}
        </nav>
        <a href="#contact" className="hidden rounded-full border border-[#d7aa4f]/50 px-5 py-3 text-[9px] font-bold uppercase tracking-[.2em] text-[#efd78f] transition hover:bg-[#d7aa4f] hover:text-[#071a13] lg:block">Talk to us</a>
        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="text-[#efd78f] lg:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-white/10 bg-[#071a13] px-6 py-6 lg:hidden">{links.map(([label, href]) => <a onClick={() => setOpen(false)} key={label} href={href} className="block border-b border-white/10 py-4 font-display text-2xl text-white/80">{label}</a>)}</div>}
    </header>
  )
}

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className="max-w-3xl">
      <div className={`mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.34em] ${light ? 'text-[#79561d]' : 'text-[#d7aa4f]'}`}>
        <span className={`h-px w-10 ${light ? 'bg-[#79561d]' : 'bg-[#d7aa4f]'}`} /> {eyebrow}
      </div>
      <h2 className={`font-display text-5xl leading-[.92] md:text-7xl ${light ? 'text-[#092019]' : 'text-[#f4f0e5]'}`}>{title}</h2>
    </div>
  )
}

function ProductCard({ product, index, onOpen }: { product: (typeof products)[number]; index: number; onOpen: () => void }) {
  const card = useRef<HTMLElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const lightX = useMotionValue(50)
  const lightY = useMotionValue(35)
  const smoothRotateX = useSpring(rotateX, { stiffness: 160, damping: 20 })
  const smoothRotateY = useSpring(rotateY, { stiffness: 160, damping: 20 })
  const spotlight = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(231,191,91,.22), transparent 42%)`

  return (
    <motion.article
      ref={card}
      style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, perspective: 1100 }}
      onMouseMove={(event) => {
        const rect = card.current?.getBoundingClientRect()
        if (!rect) return
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        rotateY.set((px - .5) * 9)
        rotateX.set((.5 - py) * 8)
        lightX.set(px * 100)
        lightY.set(py * 100)
      }}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); lightX.set(50); lightY.set(35) }}
      onClick={onOpen}
      className="product-card group relative flex min-h-[660px] cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-[#e8c873]/18 bg-[#0b291d] shadow-[0_35px_90px_rgba(0,0,0,.28)] transition-[border-color,box-shadow] duration-500 hover:border-[#f0cc70]/55 hover:shadow-[0_42px_100px_rgba(0,0,0,.34),0_0_42px_rgba(215,170,79,.16)]"
    >
      <motion.div
        className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="absolute inset-x-8 top-10 flex items-center justify-between text-[9px] uppercase tracking-[.22em] text-[#e5c36d]/65">
        <span>0{index + 1}</span><span>{product.size}</span>
      </div>
      <div className="absolute left-1/2 top-[31%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e1ac3e]/15 blur-[65px] transition duration-500 group-hover:scale-125 group-hover:bg-[#e1ac3e]/25" />
      <motion.div
        className="relative mx-8 mt-16 h-[350px] shrink-0"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.8 + index * .25, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image src={product.image} alt={`${product.name} ${product.pack}`} fill sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw" className="object-contain drop-shadow-[0_35px_28px_rgba(0,0,0,.42)] transition duration-700 group-hover:-translate-y-5 group-hover:scale-[1.06]" />
        <div className="product-sweep absolute inset-y-5 left-[-40%] w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 blur-sm group-hover:opacity-100" />
      </motion.div>
      <div className="relative z-10 mt-auto border-t border-white/10 bg-[#061b13]/88 p-6 backdrop-blur-xl md:p-7">
        <div className="text-[9px] uppercase tracking-[.25em] text-[#d6a94e]">{product.pack}</div>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h3 className="font-display text-3xl leading-tight text-[#f5e8c5]">{product.name}</h3>
          <div className="rounded-full border border-[#d7aa4f]/35 bg-[#d7aa4f]/10 px-4 py-2 font-display text-2xl leading-none text-[#f5d885] shadow-[0_0_24px_rgba(215,170,79,.12)]">{product.price}</div>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/58">{product.benefit}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {product.features.map((feature) => <span key={feature} className="rounded-full border border-white/12 bg-white/[.035] px-3 py-2 text-[8px] uppercase tracking-[.12em] text-white/62">{feature}</span>)}
        </div>
        <button className="mt-6 flex w-full items-center justify-between rounded-full bg-[#d7aa4f] px-5 py-3 text-[9px] font-bold uppercase tracking-[.2em] text-[#071a13] transition duration-300 group-hover:px-7">View details <ArrowUpRight className="h-4 w-4" /></button>
      </div>
      {Array.from({ length: 7 }, (_, i) => <motion.i key={i} className="absolute h-1 w-1 rounded-full bg-[#f0cc70]" style={{ left: `${18 + (i * 13) % 68}%`, top: `${16 + (i * 17) % 60}%` }} animate={{ y: [8, -20, 8], opacity: [.1, .75, .1] }} transition={{ duration: 3.5 + i * .3, repeat: Infinity, delay: i * .25 }} />)}
    </motion.article>
  )
}

function FounderCard({ founder, index }: { founder: (typeof founders)[number]; index: number }) {
  return (
    <motion.article
      className="founder-card group relative min-h-[520px] overflow-hidden rounded-[1.75rem] border border-[#e7c36b]/16 bg-[#0a2419] shadow-[0_32px_95px_rgba(0,0,0,.26)]"
      whileHover={{ y: -14, rotateX: 3, rotateY: index % 2 ? -3 : 3, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_10%,rgba(232,194,105,.22),transparent_34%),linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,0))] opacity-70 transition duration-500 group-hover:opacity-100" />
      <div className="relative h-[340px] overflow-hidden rounded-b-[2rem] bg-[#123426]">
        <Image
          src={founder.image}
          alt={`${founder.name} founder portrait`}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 25vw"
          className="object-cover grayscale-[18%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
          style={{ objectPosition: founder.position }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,18,12,0)_46%,rgba(5,18,12,.82)_100%)]" />
      </div>
      <div className="relative z-10 p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[9px] uppercase tracking-[.28em] text-[#d7aa4f]">{founder.role}</div>
          <span className="h-px flex-1 bg-gradient-to-r from-[#d7aa4f]/60 to-transparent" />
        </div>
        <h3 className="mt-4 font-display text-4xl leading-none text-[#fff0c8]">{founder.name}</h3>
        <p className="mt-5 text-sm leading-7 text-white/56">{founder.note}</p>
      </div>
      <motion.div
        className="absolute bottom-5 right-5 h-14 w-14 rounded-full border border-[#e7c36b]/20"
        animate={{ scale: [1, 1.12, 1], opacity: [.35, .8, .35] }}
        transition={{ duration: 3.2 + index * .25, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.article>
  )
}

export function KamalamaniHome() {
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[number] | null>(null)
  const [selectedTestimonial, setSelectedTestimonial] = useState<(typeof testimonials)[number] | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const hero = useRef<HTMLElement>(null)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const smoothX = useSpring(cursorX, { stiffness: 500, damping: 35 })
  const smoothY = useSpring(cursorY, { stiffness: 500, damping: 35 })
  const particles = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 100}%`,
    delay: (i % 8) * .45,
    size: 2 + (i % 3),
  })), [])

  useEffect(() => {
    if (loading) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.from('.hero-word', { y: 80, opacity: 0, filter: 'blur(14px)', stagger: .09, duration: 1.15, ease: 'power4.out', delay: .15 })
      gsap.to('.hero-bg', {
        scale: 1.13,
        yPercent: 8,
        scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
      })
      gsap.to('.drop-wrap', {
        yPercent: 48,
        scale: .62,
        borderRadius: '24%',
        scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: 1 },
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 84%' } })
      })
      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((el, index) => {
        gsap.from(el, { x: index % 2 ? 70 : -70, opacity: 0, duration: .9, scrollTrigger: { trigger: el, start: 'top 82%' } })
      })
      gsap.from('.meter-fill', { width: 0, duration: 1.5, stagger: .18, ease: 'power3.out', scrollTrigger: { trigger: '#quality', start: 'top 65%' } })
      gsap.from('.product-card', { y: 100, opacity: 0, filter: 'blur(12px)', duration: 1.5, stagger: .16, ease: 'power4.out', scrollTrigger: { trigger: '#products', start: 'top 68%' } })
      gsap.from('.founder-card', { y: 90, opacity: 0, rotateX: 8, filter: 'blur(14px)', duration: 1.25, stagger: .14, ease: 'power4.out', scrollTrigger: { trigger: '#founders', start: 'top 68%' } })
      gsap.from('.product-meter', { width: 0, duration: 1.5, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.product-comparison', start: 'top 82%' } })
      gsap.utils.toArray<HTMLElement>('.count').forEach((el) => {
        const target = Number(el.dataset.value)
        const state = { value: 0 }
        gsap.to(state, { value: target, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' }, onUpdate: () => { el.textContent = `${Math.round(state.value)}${el.dataset.suffix || ''}` } })
      })
    }, root)

    return () => {
      ctx.revert()
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [loading])

  useEffect(() => {
    const move = (event: MouseEvent) => { cursorX.set(event.clientX - 10); cursorY.set(event.clientY - 10) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY])

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      {!loading && (
        <div ref={root} className="relative overflow-hidden bg-[#071a13]">
          <motion.div style={{ x: smoothX, y: smoothY }} className="custom-cursor pointer-events-none fixed left-0 top-0 z-[90] h-5 w-5 rounded-full border border-[#f2d387] mix-blend-difference" />
          <Header />

          <main>
            <section ref={hero} id="home" className="grain relative flex min-h-screen items-center overflow-hidden pt-24">
              <div className="hero-bg absolute inset-0 scale-105 bg-[url('/kamalamani-fields.png')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,19,13,.92)_0%,rgba(4,19,13,.62)_42%,rgba(4,19,13,.2)_70%,rgba(4,19,13,.5)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,13,.35),transparent_40%,#071a13_100%)]" />
              <div className="sun-ray -right-[8vw] -top-44" />
              {/* Removed large oil droplet scene on home page (requested) */}
              {particles.map((p, i) => <motion.i key={i} className="absolute rounded-full bg-[#f6d77d]" style={{ left: p.left, top: p.top, width: p.size, height: p.size }} animate={{ y: [0, -38, 0], opacity: [.08, .7, .08] }} transition={{ duration: 4 + i % 4, repeat: Infinity, delay: p.delay }} />)}

              <div className="relative z-10 mx-auto grid w-full max-w-[1480px] items-center gap-8 px-5 pb-16 pt-20 md:px-10 lg:grid-cols-[1.15fr_.85fr]">
                <div>
                  <div className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.34em] text-[#e7c775]"><span className="h-px w-12 bg-[#d7aa4f]" /> Rooted in purity since 1986</div>
                  <h1 className="font-display max-w-5xl text-[clamp(3.5rem,7.4vw,8rem)] leading-[.82] tracking-[-.035em]">
                    <span className="hero-word inline-block">Pureness</span>{' '}
                    <span className="hero-word gold-text inline-block">from nature.</span><br />
                    <span className="hero-word inline-block text-white/92">Crafted for</span>{' '}
                    <span className="hero-word inline-block text-white/92">every home.</span>
                  </h1>
                  <p className="mt-8 max-w-xl text-sm leading-7 text-white/62 md:text-base">Delivering premium edible oils with purity, tradition, and trust. Made for the rituals that turn everyday meals into nourishment.</p>
                  <div className="mt-9 flex flex-wrap gap-4">
                    <MagneticButton href="#products" filled>Explore products</MagneticButton>
                    <MagneticButton href="#legacy">Our journey</MagneticButton>
                  </div>
                </div>

                <div className="drop-wrap relative mx-auto h-[390px] w-full max-w-[460px] md:h-[520px]">
                  <div className="absolute inset-[12%] rounded-full bg-[#d8a53c]/15 blur-3xl" />
                  {/* Removed big oil droplet scene (requested) */}
                  {/* <DropletScene /> */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[.35em] text-[#efd789]/65">Nature, refined</div>
                </div>
              </div>
              <a href="#legacy" className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[8px] uppercase tracking-[.32em] text-white/45">
                Scroll to discover
                <span className="relative h-10 w-px overflow-hidden bg-white/20"><motion.span animate={{ y: [-16, 40] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute left-0 top-0 h-4 w-px bg-[#e8c66e]" /></span>
              </a>
            </section>

            <section id="legacy" className="relative bg-[#f1ede1] px-5 py-28 text-[#092019] md:px-10 md:py-40">
              <div className="mx-auto max-w-[1380px]">
                <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
                  <div data-reveal><SectionTitle eyebrow="Our legacy" title="Tradition that moves forward." light /></div>
                  <p data-reveal className="max-w-2xl self-end text-lg leading-8 text-[#244137]/70">For generations, we have believed that quality is not a claim. It is a discipline repeated at every stage, from seed selection to the seal on every bottle.</p>
                </div>
                <div className="relative mt-24 grid gap-12 before:absolute before:left-[23px] before:top-0 before:h-full before:w-px before:bg-[#af843a]/30 md:before:left-1/2">
                  {[
                    ['1962', 'A promise begins', 'Kamalamani starts with a simple purpose: make honest cooking oil available to every family.'],
                    ['2002', 'Modern craft', 'New processing standards arrive without compromising the care of traditional methods.'],
                    ['2016', 'A wider table', 'Distribution expands, carrying our commitment into thousands of homes.'],
                    ['Today', 'Purity, elevated', 'A renewed brand and an enduring focus on quality shape the next chapter.'],
                  ].map(([year, title, copy], i) => (
                    <div key={year} className={`timeline-item relative grid items-center gap-8 pl-16 md:grid-cols-2 md:pl-0 ${i % 2 ? '' : 'md:text-right'}`}>
                      <span className="absolute left-0 top-2 grid h-12 w-12 place-items-center rounded-full border border-[#b58839]/35 bg-[#f1ede1] text-[#8e651f] md:left-1/2 md:-translate-x-1/2">{i + 1}</span>
                      <div className={i % 2 ? 'md:col-start-2 md:pl-16' : 'md:pr-16'}>
                        <div className="font-display text-6xl text-[#b18230]">{year}</div>
                        <h3 className="mt-2 font-display text-3xl">{title}</h3>
                        <p className="mt-3 text-sm leading-7 text-[#244137]/65">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="founders" className="grain relative overflow-hidden bg-[#071a13] px-5 py-28 md:px-10 md:py-40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(215,170,79,.23),transparent_32%),radial-gradient(circle_at_88%_78%,rgba(244,216,143,.12),transparent_34%),linear-gradient(180deg,#071a13_0%,#0b241a_100%)]" />
              <div className="absolute left-[-18vw] top-16 h-[46vw] w-[46vw] rounded-full border border-[#e4bd64]/10" />
              <div className="absolute right-[-14vw] bottom-[-16vh] h-[54vw] w-[54vw] rounded-full border border-[#e4bd64]/10" />
              <div className="relative mx-auto max-w-[1480px]">
                <div data-reveal className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
                  <SectionTitle eyebrow="Our founders" title="The hands that built the trust." />
                  <p className="max-w-xl text-sm leading-7 text-white/52 lg:justify-self-end">A tribute to the people whose discipline, care, and family values shaped Kamalamani Oil Mills into a name customers can depend on.</p>
                </div>

                <div className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {founders.map((founder, index) => (
                    <FounderCard key={founder.name} founder={founder} index={index} />
                  ))}
                </div>

                <div data-reveal className="mt-20 grid gap-8 border-y border-[#e7c36b]/15 py-10 md:grid-cols-[.65fr_1.35fr] md:items-center">
                  <div className="font-display text-5xl leading-none text-[#f4e7c4] md:text-7xl">Built by family. Carried by trust.</div>
                  <p className="text-sm leading-7 text-white/50">Their work continues through every batch, every pack, and every relationship with the homes and businesses that choose Kamalamani.</p>
                </div>
              </div>
            </section>

            <section id="products" className="grain relative overflow-hidden px-5 py-28 md:px-10 md:py-40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,#1b4932_0%,#071a13_58%)]" />
              <div className="sun-ray -right-[20vw] -top-[40vh] opacity-40" />
              <div className="relative mx-auto max-w-[1480px]">
                <div data-reveal className="mx-auto max-w-4xl text-center">
                  <div className="mb-5 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[.34em] text-[#d7aa4f]"><span className="h-px w-10 bg-[#d7aa4f]" /> The collection <span className="h-px w-10 bg-[#d7aa4f]" /></div>
                  <h2 aria-label="Premium products" className="font-display text-5xl leading-none text-[#f4f0e5] md:text-8xl">
                    <span className="block">
                      {'PREMIUM'.split('').map((letter, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.035, duration: 0.55 }}
                          className={letter === ' ' ? 'inline-block w-[.25em]' : 'gold-text inline-block'}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </span>
                    <span className="block">
                      {'PRODUCTS'.split('').map((letter, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.035, duration: 0.55 }}
                          className={letter === ' ' ? 'inline-block w-[.25em]' : 'gold-text inline-block'}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </span>
                  </h2>
                  <p className="mt-6 text-sm leading-7 text-white/50 md:text-base">Crafted with purity, tradition, and excellence.</p>
                </div>
                <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {products.map((product, i) => (
                    <ProductCard key={`${product.name}-${product.pack}`} product={product} index={i} onOpen={() => setSelectedProduct(product)} />
                  ))}
                </div>

                <div className="product-comparison glass mt-24 grid gap-10 rounded-[2.25rem] p-8 md:p-12 lg:grid-cols-[.7fr_1.3fr]">
                  <div>
                    <div className="text-[9px] uppercase tracking-[.3em] text-[#d7aa4f]">The Kamalamani standard</div>
                    <h3 className="mt-4 font-display text-4xl text-[#f5e8c5] md:text-5xl">Why choose our oils?</h3>
                    <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">Four promises guide every product that carries our name.</p>
                  </div>
                  <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                    {['Purity', 'Freshness', 'Quality', 'Trust'].map((label) => (
                      <div key={label}>
                        <div className="mb-3 flex justify-between text-[9px] font-bold uppercase tracking-[.2em] text-white/65"><span>{label}</span><span className="text-[#e5c36d]">100%</span></div>
                        <div className="h-[2px] overflow-hidden bg-white/10"><div className="product-meter h-full w-full bg-gradient-to-r from-[#8b641f] via-[#e6bd62] to-[#fff0bd]" /></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div data-reveal className="mt-24 text-center">
                  <div className="text-[9px] uppercase tracking-[.3em] text-[#d7aa4f]">Premium oils for every kitchen</div>
                  <h3 className="mt-5 font-display text-5xl text-[#f4f0e5] md:text-7xl">Experience purity in every drop.</h3>
                  <div className="mt-9 flex flex-wrap justify-center gap-4">
                    <MagneticButton href="#products" filled>View all products</MagneticButton>
                    <MagneticButton href="#contact">Contact us</MagneticButton>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative bg-[#0b241a] px-5 py-28 md:px-10 md:py-40">
              <div className="mx-auto max-w-[1380px]">
                <div data-reveal className="grid gap-10 lg:grid-cols-2 lg:items-end">
                  <SectionTitle eyebrow="Why Kamalamani" title="Quality you can feel." />
                  <p className="max-w-lg text-sm leading-7 text-white/52 lg:justify-self-end">An uncompromising approach to sourcing, manufacturing, and consistency keeps every bottle worthy of your kitchen.</p>
                </div>
                <div className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    [ShieldCheck, '100% Quality Focus', 'Disciplined attention at every stage.'],
                    [Sparkles, 'Trusted Manufacturing', 'Modern systems, thoughtfully managed.'],
                    [Leaf, 'Premium Ingredients', 'Selected for freshness and integrity.'],
                    [Check, 'Customer Satisfaction', 'Made to earn a place in every home.'],
                  ].map(([Icon, title, copy], i) => {
                    const CardIcon = Icon as typeof ShieldCheck
                    return (
                      <motion.div key={title as string} data-reveal whileHover={{ y: -12, rotateX: 4, rotateY: i % 2 ? -4 : 4 }} className="glass min-h-72 rounded-[2rem] p-8">
                        <div className="grid h-12 w-12 place-items-center rounded-full border border-[#dab25c]/25 bg-[#dab25c]/10 text-[#e6c36e]"><CardIcon className="h-5 w-5" /></div>
                        <div className="mt-16 text-[10px] tracking-[.25em] text-[#d7aa4f]/50">0{i + 1}</div>
                        <h3 className="mt-3 font-display text-3xl text-[#f3e7c8]">{title as string}</h3>
                        <p className="mt-3 text-sm leading-6 text-white/45">{copy as string}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </section>

            <section id="machinery" className="grain relative overflow-hidden bg-[#f2eee3] px-5 py-28 text-[#092019] md:px-10 md:py-40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(183,138,59,.18),transparent_34%),linear-gradient(180deg,#f2eee3_0%,#e6ddc8_100%)]" />
              <div className="relative mx-auto max-w-[1480px]">
                <div data-reveal className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                  <SectionTitle eyebrow="Our machinery" title="The machines behind every batch." light />
                  <p className="max-w-xl text-sm leading-7 text-[#244137]/68 lg:justify-self-end">A look inside the mill floor where pressing, filtering, filling, and packing come together to manufacture Kamalamani products.</p>
                </div>

                <div className="relative mt-16 overflow-hidden py-6">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f2eee3] to-transparent md:w-36" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f2eee3] to-transparent md:w-36" />
                  <div className="machinery-track flex w-max gap-5">
                    {[...machines, ...machines].map((machine, index) => (
                      <motion.article key={`${machine.title}-${index}`} whileHover={{ y: -10, scale: 1.02 }} className="relative h-[360px] w-[300px] shrink-0 overflow-hidden rounded-[1.25rem] border border-[#8b641f]/20 bg-[#10291d] shadow-[0_24px_70px_rgba(20,32,22,.22)] md:h-[430px] md:w-[420px]">
                        <Image src={machine.image} alt={`${machine.title} used at Kamalamani Oil Mills`} fill sizes="(max-width: 768px) 300px, 420px" className="object-cover transition duration-700 hover:scale-105" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,13,0)_35%,rgba(4,19,13,.82)_100%)]" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="mb-3 h-px w-12 bg-[#e5bd64]" />
                          <h3 className="font-display text-3xl leading-none text-[#fff1c9]">{machine.title}</h3>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="journey" className="relative">
              {journey.map((step, index) => {
                return (
                  <div key={step.title} className="journey-stage sticky top-0 flex items-center overflow-hidden px-5 md:px-10" style={{ backgroundColor: step.tone, zIndex: index + 1 }}>
                    <div className="absolute right-[-10vw] top-[-20vh] h-[70vw] w-[70vw] rounded-full border border-[#e4bd64]/10" />
                    <div className="absolute right-[4vw] top-[8vh] h-[42vw] w-[42vw] rounded-full border border-[#e4bd64]/10" />
                    <div className="mx-auto grid w-full max-w-[1380px] gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
                      <div>
                        <div className="text-[10px] uppercase tracking-[.32em] text-[#e4bd64]">The journey of every drop · 0{index + 1}</div>
                        <h2 className="mt-6 font-display text-7xl leading-none md:text-9xl">{step.title}</h2>
                        <p className="mt-7 max-w-md text-base leading-8 text-white/55">{step.copy}</p>
                        <div className="mt-10 flex items-center gap-3 text-[9px] uppercase tracking-[.24em] text-[#e4bd64]/65"><ArrowDown className="h-4 w-4" /> See the next promise</div>
                      </div>
                      <div className="relative min-h-[420px]">
                        <div className="absolute -inset-6 rounded-[2.5rem] bg-[#e0ae49]/15 blur-[80px]" />
                        <motion.div whileInView={{ scale: [0.92, 1], y: [36, 0], opacity: [0, 1] }} viewport={{ once: true, amount: .35 }} transition={{ duration: .95, ease: [0.2, .8, .2, 1] }} className="glass relative h-[420px] overflow-hidden rounded-[2rem] border border-[#f1cb72]/18 shadow-[0_45px_120px_rgba(0,0,0,.34)] md:h-[560px]">
                          <Image src={step.image} alt={`${step.title} stage of Kamalamani oil process`} fill sizes="(max-width: 1024px) 90vw, 58vw" className="object-cover transition duration-700 hover:scale-105" priority={index === 0} />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,18,12,.02)_0%,rgba(5,18,12,.18)_48%,rgba(5,18,12,.74)_100%)]" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <div className="mb-3 h-px w-16 bg-[#e4bd64]" />
                            <div className="font-display text-3xl text-[#f6e7bd] md:text-5xl">From {step.title.toLowerCase()} to trust</div>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/62">A visible step in the care behind every Kamalamani bottle.</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </section>

            <section id="quality" className="bg-[#f2eee3] px-5 py-28 text-[#092019] md:px-10 md:py-40">
              <div className="mx-auto grid max-w-[1380px] gap-16 lg:grid-cols-[.8fr_1.2fr]">
                <div data-reveal>
                  <SectionTitle eyebrow="Quality experience" title="Measured beyond the label." light />
                  <p className="mt-8 max-w-md text-sm leading-7 text-[#244137]/65">A clear standard, made visible. Every measure reflects the consistency we work to deliver, batch after batch.</p>
                </div>
                <div className="space-y-10 self-end">
                  {[['Purity', 100], ['Freshness', 100], ['Quality', 100], ['Customer Trust', 100]].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="mb-3 flex justify-between text-[11px] font-bold uppercase tracking-[.2em]"><span>{label}</span><span>{value}%</span></div>
                      <div className="h-[3px] overflow-hidden bg-[#123426]/15"><div className="meter-fill h-full bg-gradient-to-r from-[#8b641f] to-[#e5bd64]" style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden bg-[#0b241a] px-5 py-28 md:px-10 md:py-36">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(205,154,53,.18),transparent_55%)]" />
              <div className="relative mx-auto grid max-w-[1380px] gap-16 text-center md:grid-cols-3">
                {[['10000', '+', 'Happy families'], ['50', '+', 'Distribution partners'], ['100', '%', 'Quality commitment']].map(([value, suffix, label]) => (
                  <div key={label} data-reveal>
                    <div className="count gold-text font-display text-7xl md:text-8xl" data-value={value} data-suffix={suffix}>0</div>
                    <div className="mt-4 text-[10px] uppercase tracking-[.28em] text-white/45">{label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section id="testimonials" className="grain relative overflow-hidden bg-[#061710] px-5 py-28 md:px-10 md:py-40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(215,170,79,.24),transparent_32%),radial-gradient(circle_at_78%_42%,rgba(255,241,190,.12),transparent_30%),linear-gradient(135deg,#061710_0%,#0d2b1f_44%,#061710_100%)]" />
              <div className="absolute inset-0 opacity-60">
                {particles.map((p, i) => <motion.i key={`review-particle-${i}`} className="absolute rounded-full bg-[#f6d77d]" style={{ left: p.left, top: p.top, width: p.size + 1, height: p.size + 1 }} animate={{ y: [18, -52, 18], opacity: [.08, .7, .08], scale: [1, 1.7, 1] }} transition={{ duration: 5 + i % 5, repeat: Infinity, delay: p.delay }} />)}
              </div>
              <div className="absolute left-[-14vw] top-[-20vh] h-[42vw] w-[42vw] rounded-full border border-[#e4bd64]/10" />
              <div className="absolute bottom-[-20vh] right-[-10vw] h-[52vw] w-[52vw] rounded-full border border-[#e4bd64]/10" />
              <div className="relative mx-auto max-w-[1480px]">
                <div data-reveal className="mx-auto max-w-4xl text-center">
                  <div className="mb-5 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[.34em] text-[#d7aa4f]"><span className="h-px w-10 bg-[#d7aa4f]" /> Testimonials and reviews <span className="h-px w-10 bg-[#d7aa4f]" /></div>
                  <h2 className="font-display text-5xl leading-none text-[#f4f0e5] md:text-8xl">What Our Customers Say</h2>
                  <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/58 md:text-base">Thousands trust Kamalamani Oil Mills for purity, quality, and consistency.</p>
                </div>

                <div className="relative mt-20 overflow-hidden py-8">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#061710] to-transparent md:w-40" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#061710] to-transparent md:w-40" />
                  <div className="testimonial-track flex w-max gap-6">
                    {[...testimonials, ...testimonials].map((testimonial, i) => (
                      <TestimonialCard key={`${testimonial.name}-${i}`} testimonial={testimonial} onOpen={() => setSelectedTestimonial(testimonial)} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="hidden">
              <div className="mx-auto max-w-[1380px]">
                <div data-reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                  <SectionTitle eyebrow="At the family table" title="Trust, in their words." light />
                  <div className="font-display text-8xl leading-none text-[#b78a3b]/30">“</div>
                </div>
                <div className="mt-20 grid gap-6 md:grid-cols-3">
                  {[
                    ['The aroma and clarity tell you immediately that care has gone into it.', 'Priya R.', 'Coimbatore'],
                    ['Kamalamani has become part of our everyday cooking. It simply feels dependable.', 'Lakshmi S.', 'Erode'],
                    ['Premium quality without losing the familiar taste our family loves.', 'Arun K.', 'Salem'],
                  ].map(([quote, name, city], i) => (
                    <motion.article key={name} data-reveal whileHover={{ y: -12, scale: 1.015 }} className={`rounded-[2rem] border border-[#183c2d]/10 bg-white/55 p-8 shadow-[0_24px_80px_rgba(17,49,35,.08)] ${i === 1 ? 'md:-translate-y-8' : ''}`}>
                      <Quote className="h-7 w-7 text-[#b17e2a]" />
                      <p className="mt-10 font-display text-2xl leading-9">{quote}</p>
                      <div className="mt-10 border-t border-[#183c2d]/10 pt-5"><strong className="text-xs uppercase tracking-[.18em]">{name}</strong><span className="ml-3 text-xs text-[#29493d]/55">{city}</span></div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>

            <section id="contact" className="grain relative flex min-h-[92vh] items-center overflow-hidden px-5 py-28 md:px-10">
              <div className="absolute inset-0 scale-110 bg-[url('/kamalamani-fields.png')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,19,.45),rgba(7,26,19,.82)),radial-gradient(circle_at_70%_20%,rgba(242,185,65,.28),transparent_35%)]" />
              {particles.slice(0, 18).map((p, i) => <motion.i key={i} className="absolute rounded-full bg-[#f6d77d]" style={{ left: p.left, top: p.top, width: p.size, height: p.size }} animate={{ y: [10, -55], opacity: [0, .8, 0] }} transition={{ duration: 4 + i % 3, repeat: Infinity, delay: p.delay }} />)}
              <div data-reveal className="relative mx-auto max-w-5xl text-center">
                <div className="mx-auto mb-8 flex w-fit items-center gap-3 text-[10px] uppercase tracking-[.34em] text-[#efd27f]"><span className="h-px w-10 bg-[#d7aa4f]" /> Bring purity home <span className="h-px w-10 bg-[#d7aa4f]" /></div>
                <h2 className="font-display text-[clamp(4rem,9vw,9rem)] leading-[.8] tracking-[-.04em]">Experience purity<br /><span className="gold-text">in every drop.</span></h2>
                <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/58">Discover oils made with a deeper respect for ingredients, process, and the people gathered around your table.</p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <MagneticButton href="#products" filled>Explore products</MagneticButton>
                    <MagneticButton href="mailto:kamalamanioilmills1@gmail.com">Contact us</MagneticButton>
                </div>
              </div>
            </section>
          </main>

          <a
            href="https://wa.me/9842867838"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp 9842867838"
            className="fixed right-5 bottom-5 z-[70] grid h-16 w-16 place-items-center rounded-full bg-[#1bd741] text-white shadow-[0_20px_60px_rgba(27,215,65,.45)] ring-2 ring-white/25 transition hover:scale-[1.06] hover:ring-white/40"
          >
            <span className="text-[18px] font-extrabold leading-none text-white">WA</span>
          </a>
          <footer className="border-t border-white/10 bg-[#061710] px-5 py-12 md:px-10">


            <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="flex items-center gap-4">
                <BrandLogo compact />
                <div>
                  <div className="font-display text-3xl tracking-[.08em] text-[#efd78f]">KAMALAMANI</div>
                  <div className="mt-2 text-[8px] tracking-[.5em] text-white/35">OIL MILLS</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-[9px] uppercase tracking-[.2em] text-white/40">
                <a href="#legacy">Legacy</a><a href="#founders">Founders</a><a href="#products">Products</a><a href="#machinery">Machinery</a><a href="#journey">Process</a><a href="#testimonials">Reviews</a><a href="#quality">Quality</a>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <a
                  href="https://wa.me/9842867838"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] uppercase tracking-[.15em] text-[#e5bd64] hover:text-[#f4d98f]"
                  aria-label="WhatsApp 9842867838"
                >
                  WhatsApp: 9842867838
                </a>
                <p className="text-[9px] uppercase tracking-[.15em] text-white/25">© {new Date().getFullYear()} Kamalamani Oil Mills</p>
              </div>
            </div>
          </footer>


          <AnimatePresence>
            {selectedProduct && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#020805]/90 p-4 backdrop-blur-xl md:p-8">
                <motion.div initial={{ y: 70, scale: .94, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 40, scale: .97, opacity: 0 }} transition={{ type: 'spring', stiffness: 170, damping: 22 }} onClick={(event) => event.stopPropagation()} className="relative grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-[#e0b655]/20 bg-[#092219] shadow-[0_50px_160px_rgba(0,0,0,.65)] lg:grid-cols-2">
                  <button aria-label="Close product spotlight" onClick={() => setSelectedProduct(null)} className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/20 text-white/70 transition hover:bg-[#d7aa4f] hover:text-[#071a13]"><X className="h-5 w-5" /></button>
                  <div className="relative min-h-[480px] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(231,185,73,.28),transparent_55%)] md:min-h-[650px]">
                    <div className="absolute inset-x-[15%] bottom-14 h-12 rounded-[50%] bg-black/45 blur-xl" />
                    <motion.div initial={{ scale: .78, y: 60 }} animate={{ scale: 1, y: 0 }} transition={{ duration: .85, ease: [0.2, .8, .2, 1] }} className="absolute inset-10">
                      <Image src={selectedProduct.image} alt={selectedProduct.name} fill sizes="50vw" className="object-contain drop-shadow-[0_45px_35px_rgba(0,0,0,.5)]" priority />
                    </motion.div>
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-14">
                    <div className="text-[9px] uppercase tracking-[.3em] text-[#d7aa4f]">Kamalamani premium collection</div>
                    <h2 className="mt-5 font-display text-5xl leading-none text-[#f5e8c5] md:text-7xl">{selectedProduct.name}</h2>
                    <div className="mt-4 text-xs uppercase tracking-[.18em] text-white/38">{selectedProduct.pack} · {selectedProduct.size}</div>
                    <div className="mt-6 w-fit rounded-full border border-[#d7aa4f]/35 bg-[#d7aa4f]/10 px-6 py-3 font-display text-3xl text-[#f5d885]">{selectedProduct.price}</div>
                    <p className="mt-8 text-base leading-8 text-white/58">{selectedProduct.benefit}</p>
                    <div className="mt-8 space-y-4">
                      {selectedProduct.features.map((feature) => <div key={feature} className="flex items-center gap-3 text-sm text-white/70"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#d7aa4f]/15 text-[#e7c36b]"><Check className="h-3 w-3" /></span>{feature}</div>)}
                    </div>
                    <a href="mailto:kamalamanioilmills1@gmail.com" className="mt-10 flex h-14 items-center justify-between rounded-full bg-[#d7aa4f] px-7 text-[10px] font-bold uppercase tracking-[.2em] text-[#071a13]">Product inquiry <ArrowUpRight className="h-4 w-4" /></a>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {selectedTestimonial && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTestimonial(null)} className="fixed inset-0 z-[85] grid place-items-center overflow-y-auto bg-[#020805]/92 p-4 backdrop-blur-2xl md:p-8">
                <motion.div initial={{ y: 80, scale: .9, opacity: 0, filter: 'blur(14px)' }} animate={{ y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }} exit={{ y: 40, scale: .96, opacity: 0, filter: 'blur(10px)' }} transition={{ type: 'spring', stiffness: 160, damping: 22 }} onClick={(event) => event.stopPropagation()} className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#e0b655]/25 bg-[#071a13] shadow-[0_50px_160px_rgba(0,0,0,.72)]">
                  <button aria-label="Close testimonial spotlight" onClick={() => setSelectedTestimonial(null)} className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/25 text-white/70 transition hover:bg-[#d7aa4f] hover:text-[#071a13]"><X className="h-5 w-5" /></button>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,170,79,.28),transparent_38%),linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.02))]" />
                  <div className="relative grid gap-8 p-8 md:p-12 lg:grid-cols-[.65fr_1.35fr] lg:items-center">
                    <div className="flex flex-col items-center text-center">
                      <TestimonialFocusImage testimonial={selectedTestimonial} />
                      <div className="mt-6 text-[10px] uppercase tracking-[.3em] text-[#d7aa4f]">Verified customer voice</div>
                      <h2 className="mt-4 font-display text-4xl leading-none text-[#f5e8c5] md:text-5xl">{selectedTestimonial.name}</h2>
                      <p className="mt-3 text-xs uppercase tracking-[.18em] text-white/42">{selectedTestimonial.city}</p>
                      <div className="mt-5 text-2xl text-[#e5bd64]">★★★★★</div>
                    </div>
                    <div>
                      <Quote className="h-10 w-10 text-[#d7aa4f]" />
                      <p className="mt-7 font-display text-3xl leading-[1.35] text-[#fff4d2] md:text-5xl">"{selectedTestimonial.review}"</p>
                      <div className="mt-9 h-px w-full bg-gradient-to-r from-[#d7aa4f] via-white/20 to-transparent" />
                      <p className="mt-6 max-w-xl text-sm leading-7 text-white/52">This review reflects the trust Kamalamani Oil Mills aims to earn with every bottle: purity, consistency, and service that customers feel confident recommending.</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
