import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageHeroBackground } from '@/components/layout/PageHeroBackground'

interface HistoryItem {
  numbers: string
  timestamp: string
}

// Interface สำหรับตำแหน่งควันที่ปรับปรุงแล้ว
interface SmokeParticle {
  // ตำแหน่งเริ่มต้น (emitter point) - คำนวณจากปลายธูป
  initialX: number // offset จากจุดกึ่งกลางธูป (px)
  initialY: number // offset จากด้านบนของ container (px)
  // การเคลื่อนไหว
  xRange: number // ช่วงการเคลื่อนไหวในแนวนอน (px)
  xDrift: number // ความเร็วการเคลื่อนไหวในแนวนอน
  // การหมุน
  rotateSpeed: number // ความเร็วการหมุน
  // Layering
  zIndex: number
  isFront: boolean
  // Lifetime & fade
  fadeStart: number // เริ่ม fade ที่ความสูงเท่าไหร่ (px)
  fadeDuration: number // ระยะเวลาในการ fade (ms)
}

export function LuckyIncensePage() {
  const [isBurning, setIsBurning] = useState(false)
  const [burnProgress, setBurnProgress] = useState(0) // 0-100
  const [result, setResult] = useState<string | null>(null)
  const [revealedDigits, setRevealedDigits] = useState<string[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isRevealing, setIsRevealing] = useState(false)
  const hasRevealedRef = useRef(false)
  const [currentNumbers, setCurrentNumbers] = useState<string | null>(null)
  const [smokeParticles, setSmokeParticles] = useState<SmokeParticle[]>([])
  
  // Refs สำหรับคำนวณตำแหน่ง emitter
  const containerRef = useRef<HTMLDivElement>(null)
  const incenseRef = useRef<HTMLDivElement>(null)

  const generateNumbers = (): string => {
    const digitCount = Math.random() < 0.5 ? 2 : 3
    let numbers = ''
    for (let i = 0; i < digitCount; i++) {
      numbers += Math.floor(Math.random() * 10).toString()
    }
    return numbers
  }

  /**
   * คำนวณตำแหน่ง emitter (จุดที่ควันเริ่มต้น) จากปลายธูป
   * 
   * วิธีคำนวณ:
   * 1. ใช้ getBoundingClientRect() เพื่อหาตำแหน่ง absolute ของ container และ incense
   * 2. คำนวณตำแหน่ง relative to container โดยลบ container position ออกจาก incense position
   * 3. คำนวณตำแหน่งปลายธูป (top ของธูป) - ควันเริ่มจากจุดนี้เสมอ
   * 4. คำนวณตำแหน่งแนวนอน (กึ่งกลางของธูป)
   * 
   * หมายเหตุ: ควันจะเริ่มจากปลายธูป (top) เสมอ ไม่ว่าจะ burnProgress เท่าไหร่
   * เพราะควันเกิดจากไฟที่ปลายธูป ไม่ใช่จากรอยไหม้
   * 
   * @returns { emitterX: number, emitterY: number } หรือ null ถ้ายังคำนวณไม่ได้
   */
  const calculateEmitterPosition = (): { emitterX: number; emitterY: number } | null => {
    if (!containerRef.current || !incenseRef.current) {
      return null
    }

    // ใช้ getBoundingClientRect() เพื่อหาตำแหน่ง absolute
    const containerRect = containerRef.current.getBoundingClientRect()
    const incenseRect = incenseRef.current.getBoundingClientRect()
    
    // คำนวณตำแหน่ง relative to container
    // โดยลบ container position ออกจาก incense position
    const incenseTopInContainer = incenseRect.top - containerRect.top
    const incenseLeftInContainer = incenseRect.left - containerRect.left
    const incenseWidth = incenseRect.width
    
    // ตำแหน่งปลายธูป (top ของธูป) - ควันเริ่มจากจุดนี้เสมอ
    // ควันเกิดจากไฟที่ปลายธูป ไม่ใช่จากรอยไหม้
    // เพิ่ม offset เล็กน้อย (ประมาณ 5px) เพื่อให้ควันเริ่มจากปลายธูปพอดี
    const emitterY = incenseTopInContainer - 5
    
    // ตำแหน่งแนวนอน - กึ่งกลางของธูป
    const emitterX = incenseLeftInContainer + incenseWidth / 2
    
    return { emitterX, emitterY }
  }

  /**
   * สร้างควัน particles ที่เริ่มจากปลายธูป
   * 
   * ควันแต่ละตัวจะ:
   * - เริ่มจากตำแหน่ง emitter (ปลายธูป) + random offset เล็กน้อย
   * - เคลื่อนไหวขึ้นด้านบนพร้อมกับ drift แนวนอน
   * - Fade out เมื่อลอยสูงขึ้น
   * 
   * @param count - จำนวนควัน particles
   */
  const generateSmokeParticles = (count: number): SmokeParticle[] => {
    return Array.from({ length: count }, (_, index) => {
      // ควันชุดแรก (ครึ่งแรก) ไปอยู่หลังธูป, ควันชุดหลัง (ครึ่งหลัง) ไปอยู่หน้าธูป
      // เพื่อให้ควันชุดแรกที่แสดงผลอยู่หลังธูป
      const isFront = index >= count / 2
      
      // จำกัดพื้นที่การเกิดควันให้อยู่ภายในหรือใกล้กับปลายธูป
      // สุ่มตำแหน่งเริ่มต้นในพื้นที่เล็กๆ รอบๆ emitter point
      // initialX และ initialY เป็น offset จาก emitter point (px)
      const spawnRadius = 8 // px - ควันจะเกิดในรัศมี 8px จากปลายธูป
      const initialX = (Math.random() - 0.5) * spawnRadius * 2 // offset แนวนอน
      const initialY = (Math.random() - 0.5) * spawnRadius * 2 // offset แนวตั้ง
      
      return {
        // ตำแหน่งเริ่มต้น (offset จาก emitter point ในหน่วย px)
        initialX: initialX,
        initialY: initialY,
        // การเคลื่อนไหว - ควันลอยขึ้นพร้อมกับ drift แนวนอนเล็กน้อย
        xRange: 15 + Math.random() * 25, // ช่วงการเคลื่อนไหว x (กว้างขึ้นเล็กน้อยเมื่อลอยสูง)
        xDrift: (Math.random() - 0.5) * 0.3, // ความเร็ว drift แนวนอน (ช้า)
        // การหมุน
        rotateSpeed: 0.5 + Math.random() * 1.5,
        // Layering
        zIndex: isFront ? 15 : Math.floor(Math.random() * 10) - 5,
        isFront: isFront,
        // Lifetime & fade - เริ่ม fade เมื่อลอยสูง 150px ขึ้นไป
        fadeStart: 150 + Math.random() * 100,
        fadeDuration: 2000 + Math.random() * 1000, // 2-3 วินาที
      }
    })
  }

  const handleLightIncense = () => {
    if (isBurning || isRevealing) return
    
    // สร้างตัวเลขใหม่และแสดงทันที
    const newNumbers = generateNumbers()
    const digits = newNumbers.split('')
    setCurrentNumbers(newNumbers)
    setRevealedDigits(digits)
    
    // สร้างควัน particles ที่เริ่มจากปลายธูป
    // ใช้ setTimeout เล็กน้อยเพื่อให้ DOM render เสร็จก่อนคำนวณตำแหน่ง
    setTimeout(() => {
      setSmokeParticles(generateSmokeParticles(60)) // เพิ่มจำนวนควันเป็น 60 ตัว
    }, 50)
    
    setIsBurning(true)
    setBurnProgress(0)
    setResult(null)
    hasRevealedRef.current = false
  }
  
  // แสดงตัวเลขทันทีเมื่อโหลดหน้า
  useEffect(() => {
    if (!currentNumbers && !isBurning) {
      const initialNumbers = generateNumbers()
      const digits = initialNumbers.split('')
      setCurrentNumbers(initialNumbers)
      setRevealedDigits(digits)
    }
  }, [])

  useEffect(() => {
    if (isBurning && !hasRevealedRef.current && currentNumbers) {
      hasRevealedRef.current = true
      setIsRevealing(true)

      const blessingAudio = new Audio('/sound/give-a-blessing1.mp3')
      blessingAudio.volume = 0.7
      blessingAudio.play().catch(() => {})

      const totalDuration = 15000 // 15 วินาทีสำหรับการเผาไหม้ (ช้าลงเพื่อให้ลุ้นและสมจริง)

      // เริ่ม animation การเผาไหม้
      const startTime = Date.now()
      const burnInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / totalDuration) * 100, 100)
        setBurnProgress(progress)

        if (progress >= 100) {
          clearInterval(burnInterval)
          setResult(currentNumbers)
          setIsRevealing(false)

          const newHistoryItem: HistoryItem = {
            numbers: currentNumbers,
            timestamp: new Date().toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          }
          setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10))
        }
      }, 16) // ~60fps

      return () => clearInterval(burnInterval)
    }
  }, [isBurning, currentNumbers])

  const handleReset = () => {
    setIsBurning(false)
    setBurnProgress(0)
    setResult(null)
    setCurrentNumbers(null)
    setRevealedDigits([])
    setIsRevealing(false)
    hasRevealedRef.current = false
    setSmokeParticles([])
    
    // สร้างตัวเลขใหม่ทันที
    const newNumbers = generateNumbers()
    const digits = newNumbers.split('')
    setCurrentNumbers(newNumbers)
    setRevealedDigits(digits)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] as const },
    },
  }

  const resultVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.17, 0.67, 0.83, 0.67] as const,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 },
    },
  }

  const historyItemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  }

  return (
    <div className="flex flex-col">
      <PageHeroBackground 
        title="จุดธูปขอพร" 
        subtitle="ตั้งจิตอธิษฐาน แล้วให้ดวงนำทางคุณ"
      />
      
      <div className="mx-auto w-full max-w-[500px] px-4">
        <motion.div
          className="relative z-10 -mt-20 rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl bg-card relative"
                style={{ 
                  overflow: 'hidden', // จำกัดไม่ให้ควันลอยออกนอกกรอบ
                }}
              >
              <div 
                ref={containerRef}
                className="relative min-h-[440px] flex flex-col items-center justify-center"
                style={{ 
                  position: 'relative', // กำหนด position: relative เพื่อให้ absolute children อยู่ภายใน container นี้
                  overflow: 'hidden', // จำกัดไม่ให้ควันลอยออกนอกกรอบ
                }}
              >
                {/* 
                  LAYERING SYSTEM - ระบบ layering ที่ชัดเจน
                  
                  Global stacking order (จากล่างไปบน):
                  1. Background (z-index: 0) - พื้นดินทราย
                  2. Smoke behind unlit incense (z-index: 1) - ควันชุดแรกๆ
                  3. Unlit incense (z-index: 10)
                  4. Smoke behind lit incense (z-index: 20)
                  5. Lit incense (z-index: 25)
                  6. Smoke front lit incense (z-index: 30)
                  
                  หมายเหตุ: ควันทุกชั้นจะอยู่เหนือ background เสมอ
                */}

                {/* Layer 1: Background - พื้นดินทราย (lowest layer) */}
                <div 
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    zIndex: 0, // Background อยู่ล่างสุด
                    backgroundImage: 'url(/image/bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />

                {/* Layer 2: Smoke behind unlit incense (z-index: 1) - ควันชุดแรกๆ ที่อยู่ด้านหลังธูป */}
                <AnimatePresence>
                  {isBurning && smokeParticles.length > 0 && (() => {
                    const emitterPos = calculateEmitterPosition()
                    const containerWidth = containerRef.current?.offsetWidth ?? 500
                    const defaultEmitterX = containerWidth / 2
                    const defaultEmitterY = 80
                    const emitterX = emitterPos?.emitterX ?? defaultEmitterX
                    const emitterY = emitterPos?.emitterY ?? defaultEmitterY
                    const smokeImages = ['/image/smoke.png', '/image/smoke2.png', '/image/smoke3.png', '/image/smoke4.png']
                    
                    // แยกควันชุดแรก (ครึ่งแรก) ให้ไปอยู่หลัง unlit incense
                    const firstHalfParticles = smokeParticles.slice(0, Math.floor(smokeParticles.length / 2))
                    
                    return firstHalfParticles.length > 0 ? (
                      <div 
                        className="absolute inset-0 pointer-events-none" 
                        style={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 5, // เพิ่ม z-index เพื่อให้แสดงผลเหนือ background แต่ต่ำกว่า unlit incense (z-index: 10)
                          overflow: 'visible' 
                        }}
                      >
                        {firstHalfParticles.map((particle, index) => {
                          const smokeImage = smokeImages[index % smokeImages.length]
                          // คำนวณตำแหน่งตรงกับปลายธูป (emitter position)
                          // ใช้ emitterX และ emitterY โดยตรงเพื่อให้ควันเริ่มจากปลายธูป
                          // ขยับมาทางซ้าย 170px และขึ้นมาด้านบน 110px
                          const startX = emitterX + particle.initialX - 170
                          const startY = emitterY + particle.initialY - 110
                          
                          const maxY = -400
                          // จำกัด maxX ให้ไม่เกินขอบกรอบ (ประมาณ 60px จากกึ่งกลาง เพื่อไม่ให้ลอยออกนอกกรอบ)
                          const maxX = Math.min(particle.xRange, 60)
                          
                          // ตรวจสอบว่า startX อยู่ในขอบกรอบหรือไม่ (container width - padding)
                          const containerWidth = containerRef.current?.offsetWidth ?? 500
                          const maxAllowedX = containerWidth - 20 // ลบ padding และ margin
                          const minAllowedX = 20
                          const clampedStartX = Math.max(minAllowedX, Math.min(maxAllowedX, startX))
                          
                          // ลด opacity สำหรับควันบางตัวเพื่อไม่ให้หนาเกินไป (ควันที่ index สูงจะจางกว่า)
                          const baseOpacity = index < firstHalfParticles.length * 0.5 ? 0.6 : 0.4
                          const imageOpacity = index < firstHalfParticles.length * 0.5 ? 0.85 : 0.7
                          
                          // คำนวณ opacity multiplier จาก burnProgress
                          // ช่วงแรก (burnProgress 0-50%): แสดงควันเยอะ (opacity สูง)
                          // ช่วงหลัง (burnProgress 50-100%): แสดงควันน้อยลง (opacity ลดลง)
                          // ควันที่ index ต่ำจะ fade out เร็วกว่า
                          const progressMultiplier = index < firstHalfParticles.length * 0.3 
                            ? Math.max(0, 1 - (burnProgress / 50)) // ควันชุดแรก fade out เมื่อ burnProgress > 50%
                            : Math.max(0, 1 - (burnProgress / 100)) // ควันชุดหลัง fade out ช้ากว่า
                          
                          // ตรวจสอบว่า progressMultiplier ไม่เป็น 0 ตอนเริ่มต้น
                          const effectiveMultiplier = progressMultiplier > 0 ? progressMultiplier : 1
                          // ใช้ opacity แบบคงที่เพื่อให้ควันแสดงผลแน่นอน
                          const smokeOpacity = baseOpacity * 0.6 * effectiveMultiplier
                          
                          return (
                            <motion.div
                              key={`smoke-behind-unlit-${index}`}
                              initial={{ opacity: smokeOpacity, scale: 0.2, x: 0, y: 0, rotate: 0 }}
                              animate={{
                                opacity: [
                                  smokeOpacity, 
                                  smokeOpacity * 1.2, 
                                  smokeOpacity, 
                                  smokeOpacity * 0.8, 
                                  smokeOpacity * 0.5, 
                                  smokeOpacity * 0.2, 
                                  0
                                ],
                                y: [0, -50, -100, -150, -220, -300, maxY],
                                x: [
                                  0,
                                  particle.xDrift * 3,
                                  particle.xDrift * 6,
                                  particle.xDrift * 9,
                                  particle.xDrift * 11,
                                  particle.xDrift * 13,
                                  particle.xDrift * maxX * 0.3,
                                ],
                                scale: [0.2, 0.35, 0.5, 0.7, 0.9, 1.1, 1.3],
                                rotate: [
                                  0,
                                  particle.rotateSpeed * 5,
                                  -particle.rotateSpeed * 7,
                                  particle.rotateSpeed * 10,
                                  -particle.rotateSpeed * 8,
                                  particle.rotateSpeed * 12,
                                  -particle.rotateSpeed * 10,
                                ],
                              }}
                              exit={{ 
                                opacity: 0,
                                transition: { 
                                  duration: 2,
                                  ease: [0.4, 0, 0.2, 1]
                                }
                              }}
                              transition={{
                                opacity: { 
                                  duration: 25 + Math.random() * 5, 
                                  repeat: Infinity, 
                                  ease: [0.4, 0, 0.2, 1],
                                  delay: index * 0.4 
                                },
                                y: { 
                                  duration: 28 + Math.random() * 6, 
                                  repeat: Infinity, 
                                  ease: [0.4, 0, 0.2, 1],
                                  delay: index * 0.4 
                                },
                                x: { 
                                  duration: 30 + Math.random() * 6, 
                                  repeat: Infinity, 
                                  ease: [0.4, 0, 0.2, 1],
                                  delay: index * 0.4 
                                },
                                scale: { 
                                  duration: 25 + Math.random() * 5, 
                                  repeat: Infinity, 
                                  ease: [0.4, 0, 0.2, 1],
                                  delay: index * 0.4 
                                },
                                rotate: { 
                                  duration: 35 + Math.random() * 8, 
                                  repeat: Infinity, 
                                  ease: [0.4, 0, 0.2, 1],
                                  delay: index * 0.4 
                                },
                              }}
                              className="absolute pointer-events-none"
                              style={{ 
                                position: 'absolute',
                                left: `${clampedStartX}px`,
                                top: `${startY}px`,
                                transform: 'translate(-50%, -50%)',
                                transformOrigin: 'center center',
                                willChange: 'transform, opacity',
                              }}
                            >
                              <img
                                src={smokeImage}
                                alt={`Smoke behind unlit ${index + 1}`}
                                style={{ 
                                  width: '300px',
                                  height: '600px',
                                  objectFit: 'contain',
                                  filter: 'blur(2px)',
                                  display: 'block',
                                  opacity: imageOpacity,
                                }}
                              />
                            </motion.div>
                          )
                        })}
                      </div>
                    ) : null
                  })()}
                </AnimatePresence>

                {/* Layer 4: Smoke behind lit incense (z-index: 20) - ควันชุดหลัง */}
                <AnimatePresence>
                  {isBurning && smokeParticles.length > 0 && (() => {
                    const emitterPos = calculateEmitterPosition()
                    const containerWidth = containerRef.current?.offsetWidth ?? 500
                    const defaultEmitterX = containerWidth / 2
                    const defaultEmitterY = 80
                    const emitterX = emitterPos?.emitterX ?? defaultEmitterX
                    const emitterY = emitterPos?.emitterY ?? defaultEmitterY
                    const smokeImages = ['/image/smoke.png', '/image/smoke2.png', '/image/smoke3.png', '/image/smoke4.png']
                    
                    // ควันชุดหลัง (ครึ่งหลัง) แยกเป็น behind และ front ตาม isFront property
                    const secondHalfParticles = smokeParticles.slice(Math.floor(smokeParticles.length / 2))
                    const behindParticles = secondHalfParticles.filter(p => !p.isFront)
                    
                    return behindParticles.length > 0 ? (
                          <div 
                            className="absolute inset-0 pointer-events-none" 
                            style={{ 
                              position: 'absolute', // กำหนด position: absolute relative to container
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 20, // อยู่หลัง lit incense (z-index: 25)
                              overflow: 'visible' 
                            }}
                          >
                            {behindParticles.map((particle, index) => {
                              const smokeImage = smokeImages[index % smokeImages.length]
                              // คำนวณตำแหน่งตรงกับปลายธูป (emitter position)
                              // ใช้ emitterX และ emitterY โดยตรงเพื่อให้ควันเริ่มจากปลายธูป
                              // ขยับมาทางซ้าย 20px และขึ้นมาด้านบน 10px
                              const startX = emitterX + particle.initialX - 20
                              const startY = emitterY + particle.initialY - 10
                              
                              const maxY = -400
                              // จำกัด maxX ให้ไม่เกินขอบกรอบ (ประมาณ 80px จากกึ่งกลาง เพื่อไม่ให้ลอยออกนอกกรอบ)
                              const maxX = Math.min(particle.xRange, 80)
                              
                              // ตรวจสอบว่า startX อยู่ในขอบกรอบหรือไม่ (container width - padding)
                              const containerWidth = containerRef.current?.offsetWidth ?? 500
                              const maxAllowedX = containerWidth - 20 // ลบ padding และ margin
                              const minAllowedX = 20
                              const clampedStartX = Math.max(minAllowedX, Math.min(maxAllowedX, startX))
                              
                              // ลด opacity สำหรับควันบางตัวเพื่อไม่ให้หนาเกินไป (ควันที่ index สูงจะจางกว่า)
                              const baseOpacity = index < behindParticles.length * 0.5 ? 0.6 : 0.4
                              const imageOpacity = index < behindParticles.length * 0.5 ? 0.85 : 0.7
                              
                              // คำนวณ opacity multiplier จาก burnProgress
                              // ช่วงแรก (burnProgress 0-50%): แสดงควันเยอะ (opacity สูง)
                              // ช่วงหลัง (burnProgress 50-100%): แสดงควันน้อยลง (opacity ลดลง)
                              // ควันที่ index ต่ำจะ fade out เร็วกว่า
                              const progressMultiplier = index < behindParticles.length * 0.3 
                                ? Math.max(0, 1 - (burnProgress / 50)) // ควันชุดแรก fade out เมื่อ burnProgress > 50%
                                : Math.max(0, 1 - (burnProgress / 100)) // ควันชุดหลัง fade out ช้ากว่า
                              
                              // ตรวจสอบว่า progressMultiplier ไม่เป็น 0 ตอนเริ่มต้น
                              const effectiveMultiplier = progressMultiplier > 0 ? progressMultiplier : 1
                              // ใช้ opacity แบบคงที่เพื่อให้ควันแสดงผลแน่นอน
                              const smokeOpacity = baseOpacity * 0.6 * effectiveMultiplier
                              
                              return (
                                <motion.div
                                  key={`smoke-behind-${index}`}
                                  initial={{ opacity: smokeOpacity, scale: 0.2, x: 0, y: 0, rotate: 0 }}
                                  animate={{
                                    opacity: [
                                      smokeOpacity, 
                                      smokeOpacity * 1.2, 
                                      smokeOpacity, 
                                      smokeOpacity * 0.8, 
                                      smokeOpacity * 0.5, 
                                      smokeOpacity * 0.2, 
                                      0
                                    ],
                                    y: [0, -50, -100, -150, -220, -300, maxY],
                                    x: [
                                      0,
                                      particle.xDrift * 8,
                                      particle.xDrift * 15,
                                      particle.xDrift * 22,
                                      particle.xDrift * 28,
                                      particle.xDrift * 35,
                                      particle.xDrift * maxX * 0.5,
                                    ],
                                    scale: [0.2, 0.35, 0.5, 0.7, 0.9, 1.1, 1.3],
                                    rotate: [
                                      0,
                                      particle.rotateSpeed * 5,
                                      -particle.rotateSpeed * 7,
                                      particle.rotateSpeed * 10,
                                      -particle.rotateSpeed * 8,
                                      particle.rotateSpeed * 12,
                                      -particle.rotateSpeed * 10,
                                    ],
                                  }}
                                  exit={{ 
                                    opacity: 0,
                                    transition: { 
                                      duration: 2,
                                      ease: [0.4, 0, 0.2, 1]
                                    }
                                  }}
                                  transition={{
                                    opacity: { 
                                      duration: 25 + Math.random() * 5, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.4 
                                    },
                                    y: { 
                                      duration: 28 + Math.random() * 6, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.4 
                                    },
                                    x: { 
                                      duration: 30 + Math.random() * 6, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.4 
                                    },
                                    scale: { 
                                      duration: 25 + Math.random() * 5, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.4 
                                    },
                                    rotate: { 
                                      duration: 35 + Math.random() * 8, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.4 
                                    },
                                  }}
                                  className="absolute pointer-events-none"
                                  style={{ 
                                    position: 'absolute', // กำหนด position: absolute relative to parent (smoke layer container)
                                    left: `${clampedStartX}px`,
                                    top: `${startY}px`,
                                    transform: 'translate(-50%, -50%)',
                                    transformOrigin: 'center center',
                                    willChange: 'transform, opacity', // เพิ่ม performance
                                  }}
                                >
                                  <img
                                    src={smokeImage}
                                    alt={`Smoke behind ${index + 1}`}
                                    style={{ 
                                      width: '300px', // เพิ่มขนาดจาก 180px เป็น 300px
                                      height: '600px', // เพิ่มขนาดจาก 360px เป็น 600px
                                      objectFit: 'contain',
                                      filter: 'blur(2px)', // เพิ่ม blur เพื่อให้ควันดูนุ่มนวลขึ้น
                                      display: 'block', // ป้องกัน inline spacing
                                      opacity: imageOpacity, // ลด opacity ของรูปภาพเองเพื่อให้ควันบางลง
                                    }}
                                  />
                                </motion.div>
                              )
                            })}
                          </div>
                    ) : null
                  })()}
                </AnimatePresence>

                {/* Layer 5: Lit incense (z-index: 25) - ธูปที่จุดแล้ว */}
                {/* Container สำหรับธูป */}
                <motion.div
                  ref={incenseRef}
                  className="relative cursor-pointer mt-20"
                  style={{ zIndex: 25 }} // Lit incense อยู่เหนือ smoke behind (z-index: 20)
                  whileHover={!isBurning ? { scale: 1.05 } : {}}
                  whileTap={!isBurning ? { scale: 0.95 } : {}}
                  onClick={handleLightIncense}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.3,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                >
                  {/* Container สำหรับ crop animation */}
                  <div className="relative w-24">
                    {/* ภาพธูปที่จุดแล้ว - อยู่ด้านหลัง (ไม่ต้อง crop) */}
                    <div className="relative w-24">
                      <img
                        src="/image/incense-has-been-lit.png"
                        alt="ธูปที่จุดแล้ว"
                        className="w-24 h-auto object-contain drop-shadow-lg"
                      />
                    </div>

                    {/* ตัวเลขแสดงแนวตั้ง - อยู่ด้านหน้าภาพที่จุดแล้ว แต่ด้านหลังภาพที่ยังไม่จุด */}
                    {revealedDigits.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-0 bottom-0 flex flex-col items-center justify-center gap-1 pointer-events-none"
                        style={{ 
                          zIndex: 5,
                          left: '40px',
                        }}
                      >
                        {revealedDigits.map((digit, index) => (
                          <motion.div
                            key={`${digit}-${index}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className="text-4xl font-bold text-black drop-shadow-lg"
                          >
                            {digit}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Layer 3: Unlit incense (z-index: 10) - ภาพธูปที่ยังไม่จุด */}
                    {/* ภาพธูปที่ยังไม่จุด - อยู่ด้านบน (crop จากบนลงล่าง) */}
                    {(() => {
                      // จำกัด burnProgress ให้ไม่เกิน 90% เพื่อไม่ให้รอยไหม้เกินภาพธูป
                      // (รอยไหม้สูงสุด 17% ดังนั้น 90% + 17% = 107% แต่จะถูกจำกัดด้วย container)
                      const maxBurnProgress = Math.min(burnProgress, 90)
                      // เพิ่มค่า maxBurnProgress สำหรับการ crop เพื่อให้อยู่ต่ำกว่ารอยไฟและรอยไหม้
                      // รอยไฟและรอยไหม้อยู่ที่ maxBurnProgress% + 15px ดังนั้นการ crop ควรอยู่ต่ำกว่า
                      // เพิ่มค่าให้มากขึ้นเพื่อให้ crop อยู่ต่ำกว่ารอยไฟและรอยไหม้
                      const cropProgress = Math.min(maxBurnProgress + 6, 96)
                      return (
                        <motion.div
                          className="absolute top-0 left-0 w-24 overflow-hidden"
                          animate={{
                            clipPath: `inset(${cropProgress}% 0 0 0)`,
                          }}
                          transition={{
                            duration: 0.016,
                            ease: 'linear',
                          }}
                          style={{
                            zIndex: 10, // Unlit incense อยู่เหนือ background (z-index: 0) แต่ต่ำกว่า lit incense (z-index: 25)
                          }}
                        >
                          <img
                            src="/image/incense-is-not-lit.png"
                            alt="จุดธูปขอพร"
                            className="w-24 h-auto object-contain drop-shadow-lg"
                          />
                        </motion.div>
                      )
                    })()}
                    
                    {/* เอฟเฟกต์รอยไหม้ - ขอบดำฟุ้งๆ ที่จุดที่กำลัง crop (อยู่นอก div ที่ถูก crop) */}
                    {isBurning && (() => {
                      // จำกัด burnProgress ให้ไม่เกิน 90% เพื่อไม่ให้รอยไหม้เกินภาพธูป
                      const maxBurnProgress = Math.min(burnProgress, 90)
                      const fireTopPosition = `calc(${maxBurnProgress}% + 11px)`
                      const burnTopPosition = `calc(${maxBurnProgress}% + 11px)`
                      const shouldFadeOut = burnProgress >= 100
                      
                      return (
                        <>
                          {/* ไฟชั้นในสุด */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.9, x: 0 }}
                            animate={{
                              top: fireTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.9, 1, 0.95, 1, 0.9, 0.98, 1, 0.92],
                              x: [0, 1, -1, 1.5, -1.5, 1, -1, 0],
                              scale: [1, 1.1, 0.95, 1.15, 1, 1.05, 1.1, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.3,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.25,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 24,
                              width: '60%',
                              height: '1%',
                              left: '21px',
                              background: `radial-gradient(ellipse at center, rgba(255, 0, 0, 0.8) 0%, rgba(255, 20, 0, 0.75) 15%, rgba(255, 40, 0, 0.6) 30%, rgba(255, 50, 0, 0.4) 50%, rgba(255, 50, 0, 0.15) 70%, transparent 100%)`,
                              filter: 'blur(2px)',
                              transform: 'translateY(0)',
                            }}
                          />
                          {/* ไฟชั้นกลาง */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.7, x: 0 }}
                            animate={{
                              top: fireTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.5, 0.65, 0.55, 0.7, 0.5, 0.6, 0.65, 0.52],
                              x: [0, -1, 1, -1.5, 1.5, -1, 1, 0],
                              scale: [1, 1.15, 0.9, 1.2, 1, 1.1, 1.15, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.35,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.22,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.28,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 23,
                              width: '64%',
                              height: '1.8%',
                              left: '19px',
                              background: `radial-gradient(ellipse at center, rgba(255, 30, 0, 0.7) 0%, rgba(255, 40, 0, 0.65) 20%, rgba(255, 50, 0, 0.5) 40%, rgba(255, 50, 0, 0.3) 60%, rgba(255, 50, 0, 0.1) 80%, transparent 100%)`,
                              filter: 'blur(3px)',
                              transform: 'translateY(0)',
                            }}
                          />
                          {/* ไฟชั้นนอก */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.5, x: 0 }}
                            animate={{
                              top: fireTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.35, 0.5, 0.4, 0.55, 0.35, 0.45, 0.5, 0.37],
                              x: [0, 1.5, -1.5, 2, -2, 1.5, -1.5, 0],
                              scale: [1, 1.2, 0.85, 1.25, 1, 1.15, 1.2, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.4,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.25,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 22,
                              width: '66%',
                              height: '2.2%',
                              left: '18px',
                              background: `radial-gradient(ellipse at center, rgba(255, 50, 0, 0.5) 0%, rgba(255, 50, 0, 0.45) 25%, rgba(255, 50, 0, 0.3) 50%, rgba(255, 50, 0, 0.15) 75%, transparent 100%)`,
                              filter: 'blur(4px)',
                              transform: 'translateY(0)',
                            }}
                          />
                          
                          {/* รอยไหม้ชั้นที่ 1 - ขอบดำฟุ้งๆ */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.9, x: 0 }}
                            animate={{
                              top: burnTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.9, 0.95, 0.92, 0.98, 0.9, 0.93, 0.95, 0.91],
                              x: [0, 0.5, -0.5, 1, -1, 0.5, -0.5, 0],
                              scale: [1, 1.05, 0.98, 1.08, 1, 1.03, 1.05, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.4,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.35,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 21,
                              width: '65%',
                              height: '2%',
                              left: '18.5px',
                              background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.98) 20%, rgba(0, 0, 0, 0.85) 40%, rgba(0, 0, 0, 0.55) 60%, transparent 100%)`,
                              filter: 'blur(1px)',
                              transform: 'translateY(0)',
                            }}
                          />
                          {/* รอยไหม้ชั้นที่ 2 */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.7, x: 0 }}
                            animate={{
                              top: burnTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.7, 0.8, 0.75, 0.85, 0.7, 0.78, 0.8, 0.72],
                              x: [0, -0.5, 0.5, -1, 1, -0.5, 0.5, 0],
                              scale: [1, 1.08, 0.95, 1.1, 1, 1.05, 1.08, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.45,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.32,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.38,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 20,
                              width: '70%',
                              height: '3%',
                              left: '16px',
                              background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 30%, rgba(0, 0, 0, 0.55) 60%, transparent 100%)`,
                              filter: 'blur(2px)',
                              transform: 'translateY(0)',
                            }}
                          />
                          {/* รอยไหม้ชั้นที่ 3 */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.5, x: 0 }}
                            animate={{
                              top: burnTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.5, 0.6, 0.55, 0.65, 0.5, 0.58, 0.6, 0.52],
                              x: [0, 1, -1, 1.5, -1.5, 1, -1, 0],
                              scale: [1, 1.1, 0.92, 1.15, 1, 1.08, 1.1, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.5,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.35,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 19,
                              width: '75%',
                              height: '4%',
                              left: '14px',
                              background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.75) 35%, rgba(0, 0, 0, 0.45) 65%, transparent 100%)`,
                              filter: 'blur(3px)',
                              transform: 'translateY(0)',
                            }}
                          />
                          {/* รอยไหม้ชั้นที่ 4 - เพิ่มเพื่อความสมจริง */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.4, x: 0 }}
                            animate={{
                              top: burnTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.4, 0.5, 0.45, 0.55, 0.4, 0.48, 0.5, 0.42],
                              x: [0, 0.8, -0.8, 1.2, -1.2, 0.8, -0.8, 0],
                              scale: [1, 1.12, 0.9, 1.18, 1, 1.1, 1.12, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.6,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.45,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 18,
                              width: '80%',
                              height: '5%',
                              left: '12px',
                              background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.65) 40%, rgba(0, 0, 0, 0.35) 70%, transparent 100%)`,
                              filter: 'blur(4px)',
                              transform: 'translateY(0)',
                            }}
                          />
                          {/* รอยไหม้ชั้นที่ 5 - เพิ่มเพื่อความสมจริง */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.35, x: 0 }}
                            animate={{
                              top: burnTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.35, 0.45, 0.4, 0.5, 0.35, 0.42, 0.45, 0.37],
                              x: [0, 1, -1, 1.5, -1.5, 1, -1, 0],
                              scale: [1, 1.15, 0.88, 1.2, 1, 1.12, 1.15, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.7,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.45,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 17,
                              width: '85%',
                              height: '6%',
                              left: '10px',
                              background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0.3) 75%, transparent 100%)`,
                              filter: 'blur(5px)',
                              transform: 'translateY(0)',
                            }}
                          />
                          {/* รอยไหม้ชั้นที่ 6 - เพิ่มเพื่อความสมจริง */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0.3, x: 0 }}
                            animate={{
                              top: burnTopPosition,
                              opacity: shouldFadeOut ? 0 : [0.3, 0.4, 0.35, 0.45, 0.3, 0.38, 0.4, 0.32],
                              x: [0, 1.2, -1.2, 1.8, -1.8, 1.2, -1.2, 0],
                              scale: [1, 1.18, 0.85, 1.22, 1, 1.15, 1.18, 1],
                            }}
                            transition={{
                              top: {
                                duration: 0.016,
                                ease: 'linear',
                              },
                              opacity: {
                                duration: shouldFadeOut ? 1.5 : 0.8,
                                repeat: shouldFadeOut ? 0 : Infinity,
                                ease: 'easeOut',
                              },
                              x: {
                                duration: 0.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              scale: {
                                duration: 0.55,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }}
                            className="absolute pointer-events-none"
                            style={{
                              zIndex: 16,
                              width: '90%',
                              height: '7%',
                              left: '8px',
                              background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.55) 50%, rgba(0, 0, 0, 0.3) 80%, transparent 100%)`,
                              filter: 'blur(6px)',
                              transform: 'translateY(0)',
                            }}
                          />
                        </>
                      )
                    })()}
                  </div>
                </motion.div>

                {/* Layer 7: Smoke front lit incense (z-index: 30) - ควันที่อยู่ด้านหน้าธูปที่จุดแล้ว */}
                <AnimatePresence>
                  {isBurning && smokeParticles.length > 0 && (() => {
                    const emitterPos = calculateEmitterPosition()
                    const containerWidth = containerRef.current?.offsetWidth ?? 500
                    const defaultEmitterX = containerWidth / 2
                    const defaultEmitterY = 80
                    const emitterX = emitterPos?.emitterX ?? defaultEmitterX
                    const emitterY = emitterPos?.emitterY ?? defaultEmitterY
                    const smokeImages = ['/image/smoke.png', '/image/smoke2.png', '/image/smoke3.png', '/image/smoke4.png']
                    
                    // ควันชุดหลัง (ครึ่งหลัง) ที่อยู่ด้านหน้า (isFront = true)
                    const secondHalfParticles = smokeParticles.slice(Math.floor(smokeParticles.length / 2))
                    const frontParticles = secondHalfParticles.filter(p => p.isFront)
                    
                    return (
                      <>
                        {/* Smoke front lit incense */}
                        {frontParticles.length > 0 && (
                          <div 
                            className="absolute inset-0 pointer-events-none" 
                            style={{ 
                              position: 'absolute', // กำหนด position: absolute relative to container
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 30, // อยู่เหนือ lit incense (z-index: 25)
                              overflow: 'visible' 
                            }}
                          >
                            {frontParticles.map((particle, index) => {
                              const smokeImage = smokeImages[index % smokeImages.length]
                              // คำนวณตำแหน่งตรงกับปลายธูป (emitter position)
                              // ใช้ emitterX และ emitterY โดยตรงเพื่อให้ควันเริ่มจากปลายธูป
                              // ขยับมาทางซ้าย 160px และขึ้นมาด้านบน 300px สำหรับควันด้านหน้า
                              // ถ้า xDrift เป็นค่าบวก (เคลื่อนไปทางขวา) ให้ขยับมาทางซ้ายน้อยลง
                              const additionalXOffset = particle.xDrift > 0 ? 10 : 0
                              const startX = emitterX + particle.initialX - 160 + additionalXOffset
                              const startY = emitterY + particle.initialY - 300
                              
                              const maxY = -400
                              // จำกัด maxX ให้ไม่เกินขอบกรอบ (ประมาณ 50px จากกึ่งกลาง เพื่อไม่ให้ลอยออกนอกกรอบ)
                              const maxX = Math.min(particle.xRange, 50)
                              
                              // ตรวจสอบว่า startX อยู่ในขอบกรอบหรือไม่ (container width - padding)
                              const containerWidth = containerRef.current?.offsetWidth ?? 500
                              const maxAllowedX = containerWidth - 20 // ลบ padding และ margin
                              const minAllowedX = 20
                              const clampedStartX = Math.max(minAllowedX, Math.min(maxAllowedX, startX))
                              
                              // ลด opacity สำหรับควันบางตัวเพื่อไม่ให้หนาเกินไป (ควันที่ index สูงจะจางกว่า)
                              // ทำให้ควันบางลงกว่านี้
                              const baseOpacity = index < frontParticles.length * 0.5 ? 0.4 : 0.25
                              const imageOpacity = index < frontParticles.length * 0.5 ? 0.6 : 0.45
                              
                              // คำนวณ opacity multiplier จาก burnProgress
                              // ช่วงแรก (burnProgress 0-50%): แสดงควันเยอะ (opacity สูง)
                              // ช่วงหลัง (burnProgress 50-100%): แสดงควันน้อยลง (opacity ลดลง)
                              // ควันที่ index ต่ำจะ fade out เร็วกว่า
                              const progressMultiplier = index < frontParticles.length * 0.3 
                                ? Math.max(0, 1 - (burnProgress / 50)) // ควันชุดแรก fade out เมื่อ burnProgress > 50%
                                : Math.max(0, 1 - (burnProgress / 100)) // ควันชุดหลัง fade out ช้ากว่า
                              
                              // ตรวจสอบว่า progressMultiplier ไม่เป็น 0 ตอนเริ่มต้น
                              const effectiveMultiplier = progressMultiplier > 0 ? progressMultiplier : 1
                              // ใช้ opacity แบบคงที่เพื่อให้ควันแสดงผลแน่นอน
                              const smokeOpacity = baseOpacity * 0.6 * effectiveMultiplier
                              
                              return (
                                <motion.div
                                  key={`smoke-front-${index}`}
                                  initial={{ opacity: smokeOpacity, scale: 0.2, x: 0, y: 0, rotate: 0 }}
                                  animate={{
                                    opacity: [
                                      smokeOpacity, 
                                      smokeOpacity * 1.2, 
                                      smokeOpacity, 
                                      smokeOpacity * 0.8, 
                                      smokeOpacity * 0.5, 
                                      smokeOpacity * 0.2, 
                                      0
                                    ],
                                    y: [0, -50, -100, -150, -220, -300, maxY],
                                    x: [
                                      0,
                                      particle.xDrift * 2,
                                      particle.xDrift * 4,
                                      particle.xDrift * 6,
                                      particle.xDrift * 7,
                                      particle.xDrift * 8,
                                      particle.xDrift * maxX * 0.3,
                                    ],
                                    scale: [0.2, 0.35, 0.5, 0.7, 0.9, 1.1, 1.3],
                                    rotate: [
                                      0,
                                      particle.rotateSpeed * 5,
                                      -particle.rotateSpeed * 7,
                                      particle.rotateSpeed * 10,
                                      -particle.rotateSpeed * 8,
                                      particle.rotateSpeed * 12,
                                      -particle.rotateSpeed * 10,
                                    ],
                                  }}
                                  exit={{ 
                                    opacity: 0,
                                    transition: { 
                                      duration: 2,
                                      ease: [0.4, 0, 0.2, 1]
                                    }
                                  }}
                                  transition={{
                                    opacity: { 
                                      duration: 25 + Math.random() * 5, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.7 
                                    },
                                    y: { 
                                      duration: 28 + Math.random() * 6, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.7 
                                    },
                                    x: { 
                                      duration: 30 + Math.random() * 6, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.7 
                                    },
                                    scale: { 
                                      duration: 25 + Math.random() * 5, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.7 
                                    },
                                    rotate: { 
                                      duration: 35 + Math.random() * 8, 
                                      repeat: Infinity, 
                                      ease: [0.4, 0, 0.2, 1],
                                      delay: index * 0.7 
                                    },
                                  }}
                                  className="absolute pointer-events-none"
                                  style={{ 
                                    position: 'absolute', // กำหนด position: absolute relative to parent (smoke layer container)
                                    left: `${clampedStartX}px`,
                                    top: `${startY}px`,
                                    transform: 'translate(-50%, -50%)',
                                    transformOrigin: 'center center',
                                    willChange: 'transform, opacity', // เพิ่ม performance
                                  }}
                                >
                                  <img
                                    src={smokeImage}
                                    alt={`Smoke front ${index + 1}`}
                                    style={{ 
                                      width: '300px', // เพิ่มขนาดจาก 180px เป็น 300px
                                      height: '600px', // เพิ่มขนาดจาก 360px เป็น 600px
                                      objectFit: 'contain',
                                      filter: 'blur(2px)', // เพิ่ม blur เพื่อให้ควันดูนุ่มนวลขึ้น
                                      display: 'block', // ป้องกัน inline spacing
                                      opacity: imageOpacity, // ลด opacity ของรูปภาพเองเพื่อให้ควันบางลง
                                    }}
                                  />
                                </motion.div>
                              )
                            })}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-3 pt-3"
                  >
                    <div className="text-center rounded-2xl bg-card p-6">
                      <p className="text-primary text-sm mb-2 font-medium">ตัวเลขที่ได้</p>
                      <motion.p 
                        className="text-5xl font-bold mb-2 drop-shadow-sm text-primary"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        style={{ 
                          textShadow: '0 2px 8px rgba(48, 36, 174, 0.25), 0 0 12px rgba(200, 108, 215, 0.15)'
                        }}
                      >
                        {result}
                      </motion.p>
                      <p className="text-muted-foreground text-xs mb-6">
                        ให้ใช้เลขนี้อย่างมีสติ และอย่าลืมใช้วิจารณญาณ
                      </p>
                      <Button
                        onClick={handleReset}
                        className="w-full rounded-2xl"
                        size="lg"
                      >
                        <RotateCcw className="w-4 h-4" />
                        สุ่มใหม่อีกครั้ง
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

            <div className="space-y-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl bg-card"
              >
                <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  ประวัติเลขที่เคยจุด
                </h2>
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">
                    ยังไม่มีประวัติการจุดธูป
                  </p>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {history.map((item, index) => (
                        <motion.div
                          key={`${item.numbers}-${item.timestamp}`}
                          custom={index}
                          variants={historyItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, y: -5 }}
                          className="rounded-xl bg-muted/50 px-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary">
                              {item.numbers}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.timestamp}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-card"
              >
                <p className="text-muted-foreground text-xs leading-relaxed text-center">
                  ⚠️ เลขที่ได้จากการจุดธูปนี้สร้างขึ้นเพื่อความบันเทิงเท่านั้น ไม่รับประกันผลลอตเตอรี่ทุกกรณี กรุณาเล่นอย่างมีสติ
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
