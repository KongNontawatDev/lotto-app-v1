import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageHeroBackground } from '@/components/layout/PageHeroBackground'

interface ScratchNumber {
  digit: string
  position: { x: number; y: number }
  revealProgress: number
  isRevealing: boolean
}

const NUMBER_MEANINGS: Record<string, string> = {
  '0': 'เลขศูนย์ หมายถึงความสมบูรณ์และความว่างเปล่า',
  '1': 'เลขหนึ่ง หมายถึงความเป็นหนึ่ง ความเป็นผู้นำ',
  '2': 'เลขสอง หมายถึงความสมดุล ความเป็นคู่',
  '3': 'เลขสาม หมายถึงความมั่นคง สามเส้า',
  '4': 'เลขสี่ หมายถึงความแข็งแกร่ง ความมั่นคง',
  '5': 'เลขห้า หมายถึงการเปลี่ยนแปลง ความหลากหลาย',
  '6': 'เลขหก หมายถึงความสมบูรณ์ ความราบรื่น',
  '7': 'เลขเจ็ด หมายถึงโชคลาภ ความเป็นมงคล',
  '8': 'เลขแปด หมายถึงความเจริญรุ่งเรือง ความอุดมสมบูรณ์',
  '9': 'เลขเก้า หมายถึงความสมบูรณ์แบบ ความสำเร็จ',
}

export function TreeScratchPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchProgress, setScratchProgress] = useState(0)
  const [revealedNumbers, setRevealedNumbers] = useState<ScratchNumber[]>([])
  const [finalNumbers, setFinalNumbers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [treeImage, setTreeImage] = useState<HTMLImageElement | null>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; opacity: number; size: number; vy: number; vx: number }>>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const scratchCountRef = useRef(0)
  const lastScratchTimeRef = useRef(0)
  const revealingNumberRef = useRef(false)
  const revealedNumbersRef = useRef<ScratchNumber[]>([])
  const targetNumberCountRef = useRef(Math.random() < 0.5 ? 2 : 3)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = 'https://cdn.cizucu.com/images/photos/lj8GnjtlT9TSd8h74Er6.jpg?auto=format%2Ccompress&fit=max&w=1536&q=90'
    img.onload = () => {
      setTreeImage(img)
    }
    img.onerror = () => {
      console.error('Failed to load tree image')
    }
  }, [])

  useEffect(() => {
    revealedNumbersRef.current = revealedNumbers
  }, [revealedNumbers])

  useEffect(() => {
    let animationFrameId: number | undefined
    
    const animateNumbers = () => {
      const numbers = revealedNumbersRef.current
      if (numbers.length === 0) {
        animationFrameId = requestAnimationFrame(animateNumbers)
        return
      }
      
      let latestRevealingIndex = -1
      for (let i = numbers.length - 1; i >= 0; i--) {
        if (numbers[i].isRevealing && numbers[i].revealProgress < 1) {
          latestRevealingIndex = i
          break
        }
      }
      
      if (latestRevealingIndex >= 0) {
        revealedNumbersRef.current = revealedNumbersRef.current.map((num, index) => {
          if (index === latestRevealingIndex) {
            const newProgress = Math.min(1, num.revealProgress + 0.03)
            return {
              ...num,
              revealProgress: newProgress,
              isRevealing: newProgress < 1,
            }
          } else {
            return {
              ...num,
              revealProgress: 1,
              isRevealing: false,
            }
          }
        })
      } else {
        revealedNumbersRef.current = revealedNumbersRef.current.map((num) => ({
          ...num,
          revealProgress: 1,
          isRevealing: false,
        }))
      }
      
      animationFrameId = requestAnimationFrame(animateNumbers)
    }
    
    animationFrameId = requestAnimationFrame(animateNumbers)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !treeImage) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    drawTree(ctx, canvas.width, canvas.height)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawTree(ctx, canvas.width, canvas.height)
      updateAndDrawParticles(ctx)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    const timeoutId = setTimeout(() => {
      animate()
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [treeImage])

  const drawTree = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!treeImage) return

    const imgAspect = treeImage.width / treeImage.height
    const canvasAspect = width / height

    let drawWidth = width
    let drawHeight = height
    let drawX = 0
    let drawY = 0

    if (imgAspect > canvasAspect) {
      drawHeight = height
      drawWidth = height * imgAspect
      drawX = (width - drawWidth) / 2
    } else {
      drawWidth = width
      drawHeight = width / imgAspect
      drawY = (height - drawHeight) / 2
    }

    ctx.drawImage(treeImage, drawX, drawY, drawWidth, drawHeight)
  }

  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    particlesRef.current.forEach((particle) => {
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      )
      gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * 0.15})`)
      gradient.addColorStop(0.3, `rgba(255, 255, 255, ${particle.opacity * 0.08})`)
      gradient.addColorStop(0.6, `rgba(255, 255, 255, ${particle.opacity * 0.04})`)
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      ctx.fill()
    })

    revealedNumbersRef.current.forEach((num) => {
      const x = num.position.x
      const y = num.position.y
      const progress = Math.max(0.1, num.revealProgress)
      const scale = 0.5 + (progress * 0.5)
      const alpha = progress * 0.5

      ctx.save()
      
      ctx.translate(x, y)
      ctx.scale(scale, scale)
      ctx.translate(-x, -y)
      
      ctx.globalAlpha = alpha
      
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 0.2})`
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      
      ctx.fillStyle = 'rgba(139, 111, 71, 0.8)'
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(num.digit, x, y)
      
      ctx.restore()
    })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true)
    handleScratch(e)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      handleScratch(e)
    }
  }

  const handleMouseUp = () => {
    setIsScratching(false)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true)
    handleScratchTouch(e)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      handleScratchTouch(e)
    }
  }

  const handleTouchEnd = () => {
    setIsScratching(false)
  }

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    addParticle(x, y)
    updateScratchProgress()
  }

  const handleScratchTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    addParticle(x, y)
    updateScratchProgress()
  }

  const addParticle = (x: number, y: number) => {
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        opacity: Math.random() * 0.2 + 0.15,
        size: Math.random() * 10 + 5,
        vy: 0,
        vx: 0,
      })
    }

    if (particlesRef.current.length > 3000) {
      particlesRef.current = particlesRef.current.slice(-3000)
    }

    particlesRef.current.forEach((p) => {
      const distance = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2))
      if (distance < 120) {
        p.opacity = Math.min(0.4, p.opacity + 0.03)
      }
    })

    scratchCountRef.current += 1
    const currentTime = Date.now()
    lastScratchTimeRef.current = currentTime

    const targetCount = targetNumberCountRef.current
    if (!revealingNumberRef.current) {
      if (revealedNumbers.length === 0 && scratchCountRef.current >= 30) {
        revealingNumberRef.current = true
        revealNumber(x, y)
      } else if (revealedNumbers.length === 1 && scratchCountRef.current >= 90) {
        if (targetCount >= 2) {
          revealingNumberRef.current = true
          revealNumber(x, y)
        }
      } else if (revealedNumbers.length === 2 && scratchCountRef.current >= 150) {
        if (targetCount >= 3) {
          revealingNumberRef.current = true
          revealNumber(x, y)
        }
      }
    }
  }

  const revealNumber = (x: number, y: number) => {
    const digit = Math.floor(Math.random() * 10).toString()
    const newNumber: ScratchNumber = {
      digit,
      position: { x, y },
      revealProgress: 0,
      isRevealing: true,
    }
    
    setTimeout(() => {
      setRevealedNumbers((prev) => {
        revealingNumberRef.current = false
        const updated = [...prev, newNumber]
        revealedNumbersRef.current = updated
        return updated
      })
    }, 300)
  }

  const updateScratchProgress = () => {
    setScratchProgress((prev) => {
      const targetCount = targetNumberCountRef.current
      const maxScratches = targetCount === 2 ? 90 : 150
      const baseProgress = Math.min(100, (scratchCountRef.current / maxScratches) * 100)
      const newProgress = Math.max(prev, baseProgress)

      if (newProgress >= 100 && !isComplete && revealedNumbers.length === targetCount) {
        setIsComplete(true)
        const final = revealedNumbers.map(n => n.digit)
        setFinalNumbers(final)
        setTimeout(() => setShowResult(true), 1000)
      }

      return newProgress
    })
  }

  const handleReset = () => {
    setScratchProgress(0)
    setRevealedNumbers([])
    setFinalNumbers([])
    setShowResult(false)
    setIsComplete(false)
    scratchCountRef.current = 0
    lastScratchTimeRef.current = 0
    revealingNumberRef.current = false
    revealedNumbersRef.current = []
    targetNumberCountRef.current = Math.random() < 0.5 ? 2 : 3
    particlesRef.current = []
    
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTree(ctx, canvas.width, canvas.height)
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.17, 0.67, 0.83, 0.67] as const },
    },
  }

  return (
    <div className="flex flex-col">
      <PageHeroBackground 
        title="ถูต้นไม้ขอเลข" 
        subtitle="ถูต้นไม้ด้วยแป้งเพื่อเปิดเผยเลขมงคล"
      />
      
      <div className="mx-auto w-full max-w-[500px] px-4">
        <motion.div
          className="relative z-10 -mt-20 rounded-2xl  bg-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl  bg-card mb-4"
          >
            <div className="relative">
              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-900/50">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="w-full h-full cursor-crosshair touch-none"
                  style={{ backgroundColor: '#0f172a' }}
                />
                
                {!treeImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"
                      />
                      <p className="text-xs text-muted-foreground">กำลังโหลดภาพต้นไม้...</p>
                    </div>
                  </div>
                )}

                {treeImage && scratchProgress === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-2 left-0 right-0 text-center pointer-events-none"
                  >
                    <p className="text-xs text-primary bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block border border-primary/25 font-medium">
                      👆 ถูต้นไม้เพื่อเปิดเผยเลขมงคล
                    </p>
                  </motion.div>
                )}
              </div>

              {scratchProgress > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <div className="flex items-center justify-between text-xs text-foreground mb-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-primary" />
                      ความคืบหน้า
                    </span>
                    <span className="font-semibold text-primary">{Math.round(scratchProgress)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scratchProgress}%` }}
                      className="h-full bg-primary rounded-full"
                      style={{ 
                        backgroundSize: '200% 100%',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showResult && finalNumbers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl  bg-card mb-4"
              >
                <div className="text-center mb-4">
                  <div className="rounded-2xl bg-card mb-4">
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
                      {finalNumbers.join('')}
                    </motion.p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-semibold text-primary mb-2">ความหมายของเลข:</h3>
                  {finalNumbers.map((digit, index) => (
                    <div key={index} className="rounded-xl  bg-muted/50 p-3">
                      <p className="text-xs text-foreground">
                        <span className="font-bold text-primary">{digit}</span>: {NUMBER_MEANINGS[digit]}
                      </p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleReset}
                  className="w-full rounded-2xl"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  ถูใหม่
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div className="flex-1">
                  <p className="text-foreground text-xs font-medium mb-1">วิธีใช้งาน</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    ใช้เมาส์หรือนิ้วถูไปบนต้นไม้เพื่อเปิดเผยเลขมงคล แป้งจะลอยขึ้นและคงอยู่บนต้นไม้
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-muted-foreground text-xs leading-relaxed text-center">
                  ⚠️ เลขที่ได้จากการถูนี้สร้างขึ้นเพื่อความบันเทิงเท่านั้น กรุณาใช้วิจารณญาณ
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

