import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Star, Cloud, Sparkles, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageHeroBackground } from '@/components/layout/PageHeroBackground'

interface DreamData {
  id: string
  dreamText: string
  category: string
  dreamDate?: string
  numbers: {
    twoDigits: string[]
    threeDigits: string[]
  }
  prediction: string
  timestamp: number
}

interface DreamDictionaryItem {
  keyword: string
  emoji: string
  numbers: string[]
  description: string
}

const DREAM_DICTIONARY: DreamDictionaryItem[] = [
  { 
    keyword: 'งู', 
    emoji: '🐍', 
    numbers: ['1', '5', '15', '51'], 
    description: 'งูเป็นสัตว์มงคลในความเชื่อไทย หมายถึงการเปลี่ยนแปลง การเริ่มต้นใหม่ ความรอบรู้ และปัญญา ฝันเห็นงูสีทองหมายถึงโชคลาภ งูเขียวหมายถึงสุขภาพดี งูใหญ่หมายถึงอำนาจและความสำเร็จ' 
  },
  { 
    keyword: 'น้ำ', 
    emoji: '💧', 
    numbers: ['2', '7', '27', '72'], 
    description: 'น้ำหมายถึงความอุดมสมบูรณ์ ความบริสุทธิ์ การชำระล้าง และการไหลเวียนของโชคลาภ น้ำใสหมายถึงความโชคดี น้ำไหลหมายถึงเงินทองไหลมา น้ำท่วมหมายถึงโชคลาภมากมาย' 
  },
  { 
    keyword: 'คนตาย', 
    emoji: '👻', 
    numbers: ['4', '7', '47', '74'], 
    description: 'ฝันเห็นคนตายหรือผู้ล่วงลับมักเป็นลางดี หมายถึงการได้รับพรจากบรรพบุรุษ การแก้ไขปัญหา และการเริ่มต้นใหม่ คนตายยิ้มหมายถึงโชคดี คนตายให้ของหมายถึงทรัพย์สมบัติ' 
  },
  { 
    keyword: 'เด็ก', 
    emoji: '👶', 
    numbers: ['3', '9', '39', '93'], 
    description: 'เด็กหมายถึงความบริสุทธิ์ การเริ่มต้นใหม่ ความหวัง และความเจริญเติบโต เด็กยิ้มหมายถึงความสุข เด็กร้องไห้หมายถึงการเตือนภัย เด็กวิ่งหมายถึงความก้าวหน้า' 
  },
  { 
    keyword: 'เงินทอง', 
    emoji: '💰', 
    numbers: ['8', '9', '89', '98'], 
    description: 'เงินทองหมายถึงโชคลาภ ความร่ำรวย และความอุดมสมบูรณ์ เห็นเงินมากหมายถึงโชคลาภใหญ่ หยิบเงินได้หมายถึงได้รับทรัพย์ เงินทองเรืองแสงหมายถึงโชคดีมาก' 
  },
  { 
    keyword: 'สัตว์', 
    emoji: '🐾', 
    numbers: ['1', '6', '16', '61'], 
    description: 'สัตว์ต่างๆ นำโชคตามชนิด สัตว์เลี้ยงหมายถึงมิตรภาพ สัตว์ป่าหมายถึงอิสระ สัตว์บินหมายถึงความสูงส่ง สัตว์น้ำหมายถึงความอุดมสมบูรณ์' 
  },
  { 
    keyword: 'เจอพระ', 
    emoji: '🙏', 
    numbers: ['5', '8', '58', '85'], 
    description: 'เจอพระหรือพระสงฆ์เป็นมงคลยิ่ง หมายถึงการได้รับพร การคุ้มครอง และความสำเร็จในชีวิต พระให้พรหมายถึงโชคดีมาก พระเดินผ่านหมายถึงการแก้ไขปัญหา' 
  },
  { 
    keyword: 'ดอกไม้', 
    emoji: '🌸', 
    numbers: ['2', '6', '26', '62'], 
    description: 'ดอกไม้หมายถึงความสวยงาม ความรัก ความเจริญ และความสุข ดอกไม้บานหมายถึงความสำเร็จ ดอกไม้หอมหมายถึงความรัก ดอกไม้สีแดงหมายถึงโชคลาภ' 
  },
  { 
    keyword: 'ไฟ', 
    emoji: '🔥', 
    numbers: ['3', '7', '37', '73'], 
    description: 'ไฟหมายถึงพลัง ความร้อนแรง ความมุ่งมั่น และการเปลี่ยนแปลง ไฟลุกหมายถึงความกระตือรือร้น ไฟสว่างหมายถึงปัญญา ไฟดับหมายถึงการพักผ่อน' 
  },
  { 
    keyword: 'ต้นไม้', 
    emoji: '🌳', 
    numbers: ['4', '9', '49', '94'], 
    description: 'ต้นไม้หมายถึงการเจริญเติบโต ความแข็งแกร่ง ความมั่นคง และการพัฒนาอย่างยั่งยืน ต้นไม้ใหญ่หมายถึงความสำเร็จ ต้นไม้ผลิดอกหมายถึงโชคลาภ ต้นไม้เขียวหมายถึงสุขภาพดี' 
  },
]

const _DREAM_CATEGORIES = [
  'เงินทอง',
  'คนตาย',
  'สัตว์',
  'น้ำ',
  'งู',
  'เด็ก',
  'เจอพระ',
  'ดอกไม้',
  'ไฟ',
  'ต้นไม้',
  'อื่นๆ',
]

function predictNumbersFromDream(dreamText: string): { numbers: { twoDigits: string[], threeDigits: string[] }, prediction: string } {
  const text = dreamText.toLowerCase()
  const foundKeywords: string[] = []
  
  DREAM_DICTIONARY.forEach(item => {
    if (text.includes(item.keyword.toLowerCase())) {
      foundKeywords.push(...item.numbers)
    }
  })
  
  let numbers: string[] = []
  if (foundKeywords.length > 0) {
    numbers = [...new Set(foundKeywords)]
  } else {
    const hash = dreamText.length % 10
    numbers = [String(hash), String((hash + 3) % 10)]
  }
  
  const twoDigits: string[] = []
  const threeDigits: string[] = []
  
  for (let i = 0; i < Math.min(3, numbers.length); i++) {
    const num1 = numbers[i] || String(Math.floor(Math.random() * 10))
    const num2 = numbers[(i + 1) % numbers.length] || String(Math.floor(Math.random() * 10))
    twoDigits.push(num1 + num2)
  }
  
  for (let i = 0; i < Math.min(2, numbers.length); i++) {
    const num1 = numbers[i] || String(Math.floor(Math.random() * 10))
    const num2 = numbers[(i + 1) % numbers.length] || String(Math.floor(Math.random() * 10))
    const num3 = numbers[(i + 2) % numbers.length] || String(Math.floor(Math.random() * 10))
    threeDigits.push(num1 + num2 + num3)
  }
  
  const foundCategoryItem = DREAM_DICTIONARY.find(item => text.includes(item.keyword.toLowerCase()))
  let prediction = ''
  
  if (foundCategoryItem) {
    const dreamLength = dreamText.length
    const hasPositiveWords = /ดี|สำเร็จ|โชค|รวย|สุข|เจริญ/.test(text)
    const hasNegativeWords = /ไม่|เสีย|หาย|แย่|ร้าย/.test(text)
    
    let analysis = `ฝันเกี่ยวกับ${foundCategoryItem.keyword} ${foundCategoryItem.description}`
    
    if (hasPositiveWords) {
      analysis += ' ความฝันนี้มีสัญญาณบวกชัดเจน บ่งบอกถึงโชคลาภและความสำเร็จที่กำลังจะมาถึง'
    } else if (hasNegativeWords) {
      analysis += ' แม้ความฝันจะมีบางส่วนที่ดูไม่ดี แต่ก็เป็นสัญญาณเตือนให้ระวังและเตรียมพร้อม'
    }
    
    if (dreamLength > 50) {
      analysis += ' ความฝันที่ละเอียดเช่นนี้มักมีความหมายที่ลึกซึ้งและควรให้ความสำคัญ'
    }
    
    analysis += ` มักตีเป็นเลขเด่น ${numbers.join(', ')} และเลขที่เกี่ยวข้อง ${twoDigits.slice(0, 2).join(', ')}`
    
    prediction = analysis
  } else {
    const dreamLength = dreamText.length
    const wordCount = dreamText.split(/\s+/).length
    
    let analysis = `ความฝันของคุณมีความยาว ${wordCount} คำ บ่งบอกถึง`
    if (dreamLength > 100) {
      analysis += 'ความฝันที่ละเอียดและมีความหมายลึกซึ้ง'
    } else if (dreamLength > 50) {
      analysis += 'ความฝันที่มีรายละเอียดพอสมควร'
    } else {
      analysis += 'ความฝันที่กระชับแต่มีความหมาย'
    }
    
    analysis += ` เลขเด่นที่ควรพิจารณาคือ ${numbers.join(', ')} และเลขเสริม ${twoDigits.slice(0, 2).join(', ')}`
    
    prediction = analysis
  }
  
  return { numbers: { twoDigits, threeDigits }, prediction }
}

const _pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

const resultVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

function DreamForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (dreamText: string) => void
  isLoading: boolean
}) {
  const [dreamText, setDreamText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (dreamText.trim()) {
      onSubmit(dreamText)
    }
  }

  return (
    <motion.form
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="rounded-2xl  bg-card "
    >
      <div className="space-y-5">
        <div>
          <label className="block text-primary font-medium mb-2 text-sm">
            คุณฝันว่าอะไร? 🌙
          </label>
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="เล่าความฝันของคุณที่นี่..."
            className="w-full h-32 px-4 py-3 bg-card/90 backdrop-blur-sm border border-border/40 rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none shadow-sm"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={!dreamText.trim() || isLoading}
          className="w-full rounded-2xl"
          size="lg"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <span>กำลังวิเคราะห์...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>ทำนายเลขจากความฝัน</span>
            </>
          )}
        </Button>
      </div>
    </motion.form>
  )
}

function DreamResult({
  result,
  onReset,
}: {
  result: DreamData | null
  onReset: () => void
}) {
  if (!result) return null

  return (
    <motion.div
      variants={resultVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-card "
    >
      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Moon className="w-12 h-12 text-primary" />
          </motion.div>
          <div className="space-y-4 mb-6">
            <p className="text-lg text-primary leading-relaxed">{result.prediction}</p>
            
            <div className="bg-primary/5 rounded-xl mt-4 p-3">
              <h4 className="font-semibold text-primary mb-2 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                หมายเหตุเพิ่มเติม
              </h4>
              <p className="text-foreground text-sm leading-relaxed">
                ความฝันของคุณมีความหมายที่ลึกซึ้ง ควรพิจารณาเลขที่ได้อย่างรอบคอบ และใช้วิจารณญาณในการตัดสินใจ เลขเหล่านี้เป็นเพียงแนวทางจากความฝัน ไม่ใช่การรับประกันผลลอตเตอรี่
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-primary font-semibold mb-3 text-sm">เลข 2 ตัว</h3>
            <div className="flex flex-wrap gap-3">
              {result.numbers.twoDigits.map((num, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="px-6 py-3 bg-primary/10 border border-primary/25 rounded-2xl text-primary font-bold text-xl shadow-sm"
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-3 text-sm">เลข 3 ตัว</h3>
            <div className="flex flex-wrap gap-3">
              {result.numbers.threeDigits.map((num, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="px-6 py-3  rounded-2xl text-primary font-bold text-xl "
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={onReset}
            className="w-full rounded-2xl"
            size="lg"
          >
            <RefreshCw className="w-5 h-5" />
            <span>ทำนายใหม่</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function DreamDictionary() {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl  bg-card mt-3"
    >
      <h2 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
        <Star className="w-6 h-6 text-primary" />
        พจนานุกรมทำนายฝัน
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3"
      >
        {DREAM_DICTIONARY.map((item) => (
          <motion.div
            key={item.keyword}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border/40 bg-muted/50 p-4 hover:border-primary/50 transition-all shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <h3 className="text-primary font-semibold mb-1">{item.keyword}</h3>
                <p className="text-foreground text-sm mb-2">{item.description}</p>
                <div className="flex gap-2">
                  {item.numbers.map((num) => (
                    <span
                      key={num}
                      className="px-3 py-1 bg-primary/10 border border-primary/25 rounded-lg text-primary font-bold text-sm shadow-sm"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function RecentDreams({ dreams }: { dreams: DreamData[] }) {
  if (dreams.length === 0) return null

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl  bg-card "
    >
      <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
        <Cloud className="w-6 h-6 text-primary" />
        ความฝันล่าสุด
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {dreams.map((dream) => (
          <motion.div
            key={dream.id}
            variants={staggerItem}
            className="rounded-xl  bg-muted/50 p-4 hover:border-primary/50 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-primary font-medium mb-2 line-clamp-2">
                  {dream.dreamText.length > 50
                    ? `${dream.dreamText.substring(0, 50)}...`
                    : dream.dreamText}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dream.numbers.twoDigits.slice(0, 2).map((num, numIdx) => (
                    <span
                      key={numIdx}
                      className="px-2 py-1 bg-primary/10 border border-primary/25 rounded text-primary font-semibold text-xs shadow-sm"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {dream.category}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export function DreamToNumbersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentResult, setCurrentResult] = useState<DreamData | null>(null)
  const [recentDreams, setRecentDreams] = useState<DreamData[]>([])

  const handleSubmit = async (dreamText: string) => {
    setIsLoading(true)
    
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const prediction = predictNumbersFromDream(dreamText)
    const newDream: DreamData = {
      id: Date.now().toString(),
      dreamText,
      category: 'อื่นๆ',
      numbers: prediction.numbers,
      prediction: prediction.prediction,
      timestamp: Date.now(),
    }
    
    setCurrentResult(newDream)
    setRecentDreams((prev) => [newDream, ...prev].slice(0, 5))
    
    setIsLoading(false)
  }

  const handleReset = () => {
    setCurrentResult(null)
  }

  const _moonVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  }

  const _starVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  }

  return (
    <div className="flex flex-col">
      <PageHeroBackground 
        title="ทำนายฝันเป็นเลข" 
        subtitle="เล่าความฝันของคุณ แล้วให้เราแปลงเป็นชุดตัวเลข"
      />
      
      <div className="mx-auto w-full max-w-[500px] px-4">
        <motion.div
          className="relative z-10 -mt-20 rounded-2xl  bg-card p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col gap-4 mb-4">
            <div className="space-y-6">
              {!currentResult ? (
                <DreamForm onSubmit={handleSubmit} isLoading={isLoading} />
              ) : (
                <DreamResult
                  result={currentResult}
                  onReset={handleReset}
                />
              )}
            </div>

            <div className="space-y-4">
              {!currentResult && <DreamDictionary />}
              {recentDreams.length > 0 && <RecentDreams dreams={recentDreams} />}
            </div>
          </div>

          <motion.div
            variants={sectionVariants}
            className="text-center mt-6"
          >
            <div className="rounded-2xl  bg-card ">
              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                ⚠️ การทำนายฝันและเลขที่แนะนำเป็นการตีความตามความเชื่อส่วนบุคคล โปรดใช้วิจารณญาณ
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

