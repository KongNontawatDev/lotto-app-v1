import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Star, Cloud, Sparkles, RefreshCw, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeroBackground } from "@/components/layout/PageHeroBackground";
import {
	DREAM_DICTIONARY,
	type DreamDictionaryItem,
} from "../data/dreamDictionary";

interface DreamData {
	id: string;
	dreamText: string;
	category: string;
	dreamDate?: string;
	numbers: {
		twoDigits: string[];
		threeDigits: string[];
	};
	prediction: string;
	foundKeywords: DreamDictionaryItem[];
	timestamp: number;
}

function predictNumbersFromDream(dreamText: string): {
	numbers: { twoDigits: string[]; threeDigits: string[] };
	prediction: string;
	foundKeywords: DreamDictionaryItem[];
} {
	const text = dreamText.toLowerCase();
	// Find all matching keywords, sorted by length (longest first) to match specific terms before general ones
	// e.g. "งูใหญ่" should match before "งู" if we had both, though here we just have "งู"
	const matchedItems = DREAM_DICTIONARY.filter((item) =>
		text.includes(item.keyword.toLowerCase())
	);

	// Remove duplicates if any (though filter shouldn't produce them unless dictionary has dupes)
	const uniqueMatches = Array.from(new Set(matchedItems));

	let numbers: string[] = [];
	let prediction = "";

	if (uniqueMatches.length > 0) {
		// Collect numbers from all matches
		const allNumbers = uniqueMatches.flatMap((item) => item.numbers);
		// Get unique numbers and shuffle/select top ones
		numbers = [...new Set(allNumbers)];

		// Construct prediction text
		const descriptions = uniqueMatches.map(
			(item) => `ฝันเห็น "${item.keyword}": ${item.description}`
		);
		prediction = descriptions.join("\n\n");
	} else {
		// Fallback logic
		const hash = dreamText.length % 10;
		numbers = [String(hash), String((hash + 3) % 10), String((hash + 7) % 10)];

		const dreamLength = dreamText.length;
		if (dreamLength > 100) {
			prediction =
				"ความฝันของคุณมีรายละเอียดมากและซับซ้อน บ่งบอกถึงจิตใต้สำนึกที่กำลังประมวลผลเรื่องราวสำคัญในชีวิต อาจมีการเปลี่ยนแปลงหรือข่าวดีที่คาดไม่ถึงรออยู่";
		} else if (dreamLength > 50) {
			prediction =
				"ความฝันนี้อาจเป็นลางบอกเหตุบางอย่าง แม้จะยังไม่ชัดเจนในตอนนี้ แต่ขอให้เตรียมพร้อมรับมือกับสิ่งใหม่ๆ ที่จะเข้ามา";
		} else {
			prediction =
				"ความฝันที่กระชับอาจมีความหมายตรงไปตรงมา ลองสังเกตสิ่งรอบตัวในช่วงนี้ อาจมีโชคลาภเล็กๆ น้อยๆ เข้ามา";
		}
	}

	// Generate 2 and 3 digit sets
	const twoDigits: string[] = [];
	const threeDigits: string[] = [];

	// Helper to get random digit
	const randomDigit = () => String(Math.floor(Math.random() * 10));

	// Generate 2-digit numbers
	// Prioritize numbers from keywords, then combine them
	if (numbers.length >= 2) {
		for (let i = 0; i < Math.min(5, numbers.length); i++) {
			const n1 = numbers[i];
			const n2 = numbers[(i + 1) % numbers.length];
			twoDigits.push(n1 + n2);
		}
	} else if (numbers.length === 1) {
		twoDigits.push(numbers[0] + randomDigit());
		twoDigits.push(randomDigit() + numbers[0]);
		twoDigits.push(numbers[0] + numbers[0]);
	} else {
		// Pure random if no numbers found (shouldn't happen often with fallback)
		for (let i = 0; i < 3; i++) twoDigits.push(randomDigit() + randomDigit());
	}

	// Generate 3-digit numbers
	if (numbers.length >= 3) {
		for (let i = 0; i < Math.min(3, numbers.length); i++) {
			const n1 = numbers[i];
			const n2 = numbers[(i + 1) % numbers.length];
			const n3 = numbers[(i + 2) % numbers.length];
			threeDigits.push(n1 + n2 + n3);
		}
	} else {
		// Fill with some combinations or randoms
		const base = numbers.length > 0 ? numbers : [randomDigit(), randomDigit()];
		for (let i = 0; i < 3; i++) {
			threeDigits.push(
				(base[i % base.length] || randomDigit()) +
					(base[(i + 1) % base.length] || randomDigit()) +
					(base[(i + 2) % base.length] || randomDigit())
			);
		}
	}

	return {
		numbers: {
			twoDigits: [...new Set(twoDigits)].slice(0, 5),
			threeDigits: [...new Set(threeDigits)].slice(0, 3),
		},
		prediction,
		foundKeywords: uniqueMatches,
	};
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
};

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
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const staggerItem = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
		},
	},
};

function DreamForm({
	onSubmit,
	isLoading,
}: {
	onSubmit: (dreamText: string) => void;
	isLoading: boolean;
}) {
	const [dreamText, setDreamText] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (dreamText.trim()) {
			onSubmit(dreamText);
		}
	};

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
						placeholder="เล่าความฝันของคุณที่นี่... เช่น ฝันเห็นงูสีทองว่ายน้ำมาหา"
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
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
	);
}

function DreamResult({
	result,
	onReset,
}: {
	result: DreamData | null;
	onReset: () => void;
}) {
	if (!result) return null;

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
						transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
						className="inline-block mb-4"
					>
						<Moon className="w-12 h-12 text-primary" />
					</motion.div>

					<div className="space-y-4 mb-6">
						{result.foundKeywords.length > 0 ? (
							<div className="text-left space-y-4">
								<h3 className="text-center text-lg font-semibold text-primary mb-4">
									พบคำทำนายจากความฝันของคุณ
								</h3>
								{result.foundKeywords.map((item, idx) => (
									<motion.div
										key={idx}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.3 + idx * 0.1 }}
										className="bg-muted/30 p-4 rounded-xl border border-primary/10"
									>
										<div className="flex items-center gap-2 mb-2">
											<span className="text-2xl">{item.emoji}</span>
											<span className="font-bold text-primary text-lg">
												{item.keyword}
											</span>
										</div>
										<p className="text-foreground/90 text-sm leading-relaxed">
											{item.description}
										</p>
										<div className="mt-2 flex gap-2 flex-wrap">
											<span className="text-xs text-muted-foreground">
												เลขมงคล:
											</span>
											{item.numbers.map((n, i) => (
												<span
													key={i}
													className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded"
												>
													{n}
												</span>
											))}
										</div>
									</motion.div>
								))}
							</div>
						) : (
							<div className="text-center">
								<p className="text-lg text-primary leading-relaxed italic relative px-6">
									<Quote className="w-4 h-4 absolute top-0 left-0 text-primary/40 -scale-x-100" />
									{result.prediction}
									<Quote className="w-4 h-4 absolute bottom-0 right-0 text-primary/40" />
								</p>
							</div>
						)}

						<div className="bg-primary/5 rounded-xl mt-6 p-3">
							<h4 className="font-semibold text-primary mb-2 text-sm flex items-center gap-2 justify-center">
								<Sparkles className="w-4 h-4 text-primary" />
								สรุปเลขนำโชค
							</h4>
							<p className="text-foreground text-xs leading-relaxed text-center">
								พิจารณาจาก
								{result.foundKeywords.length > 0
									? "สัญลักษณ์ในฝัน"
									: "ลางสังหรณ์"}
								ของคุณ
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h3 className="text-primary font-semibold mb-3 text-sm text-center">
							เลขท้าย 2 ตัว
						</h3>
						<div className="flex flex-wrap justify-center gap-3">
							{(Array.isArray(result.numbers?.twoDigits)
								? result.numbers.twoDigits
								: []
							).map((num, idx) => (
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
						<h3 className="text-primary font-semibold mb-3 text-sm text-center">
							เลขท้าย 3 ตัว
						</h3>
						<div className="flex flex-wrap justify-center gap-3">
							{(Array.isArray(result.numbers?.threeDigits)
								? result.numbers.threeDigits
								: []
							).map((num, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.4 + idx * 0.1 }}
									className="px-6 py-3 bg-card border border-border/50 rounded-2xl text-primary font-bold text-xl shadow-sm"
								>
									{num}
								</motion.div>
							))}
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3 pt-4">
					<Button onClick={onReset} className="w-full rounded-2xl" size="lg">
						<RefreshCw className="w-5 h-5" />
						<span>ทำนายใหม่</span>
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

function DreamDictionary() {
	// Show only a random subset or first few items to avoid clutter, or maybe a categorized view?
	// For now, let's show a random selection of 5 items to keep it fresh
	const [displayItems] = useState(() => {
		const shuffled = [...DREAM_DICTIONARY].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, 5);
	});

	return (
		<motion.div
			variants={sectionVariants}
			initial="hidden"
			animate="visible"
			className="rounded-2xl  bg-card mt-3"
		>
			<h2 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
				<Star className="w-6 h-6 text-primary" />
				ตัวอย่างทำนายฝัน
			</h2>
			<motion.div
				variants={staggerContainer}
				initial="hidden"
				animate="visible"
				className="grid grid-cols-1 gap-3"
			>
				{displayItems.map((item) => (
					<motion.div
						key={item.keyword}
						variants={staggerItem}
						whileHover={{ scale: 1.02 }}
						className="rounded-xl border border-border/40 bg-muted/50 p-4 hover:border-primary/50 transition-all shadow-sm"
					>
						<div className="flex items-start gap-3">
							<span className="text-2xl">{item.emoji}</span>
							<div className="flex-1">
								<h3 className="text-primary font-semibold mb-1">
									{item.keyword}
								</h3>
								<p className="text-foreground text-sm mb-2">
									{item.description}
								</p>
								<div className="flex gap-2 flex-wrap">
									{item.numbers.slice(0, 4).map((num) => (
										<span
											key={num}
											className="px-2 py-0.5 bg-primary/10 border border-primary/25 rounded text-primary font-bold text-xs shadow-sm"
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
	);
}

function RecentDreams({ dreams }: { dreams: DreamData[] }) {
	if (dreams.length === 0) return null;

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
									{(Array.isArray(dream.numbers?.twoDigits)
										? dream.numbers.twoDigits
										: []
									)
										.slice(0, 2)
										.map((num, numIdx) => (
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
	);
}

export function DreamToNumbersPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [currentResult, setCurrentResult] = useState<DreamData | null>(null);
	const [recentDreams, setRecentDreams] = useState<DreamData[]>([]);

	const handleSubmit = async (dreamText: string) => {
		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 1500));

		const prediction = predictNumbersFromDream(dreamText);
		const newDream: DreamData = {
			id: Date.now().toString(),
			dreamText,
			category: prediction.foundKeywords.length > 0 ? "ทำนายฝัน" : "ทั่วไป",
			numbers: prediction.numbers,
			prediction: prediction.prediction,
			foundKeywords: prediction.foundKeywords,
			timestamp: Date.now(),
		};

		setCurrentResult(newDream);
		setRecentDreams((prev) => {
			const safePrev = Array.isArray(prev) ? prev : [];
			return [newDream, ...safePrev].slice(0, 5);
		});

		setIsLoading(false);
	};

	const handleReset = () => {
		setCurrentResult(null);
	};

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
								<DreamResult result={currentResult} onReset={handleReset} />
							)}
						</div>

						<div className="space-y-4">
							{!currentResult && <DreamDictionary />}
							{recentDreams.length > 0 && (
								<RecentDreams dreams={recentDreams} />
							)}
						</div>
					</div>

					<motion.div variants={sectionVariants} className="text-center mt-6">
						<div className="rounded-2xl  bg-card ">
							<p className="text-xs text-muted-foreground leading-relaxed text-center">
								⚠️ การทำนายฝันและเลขที่แนะนำเป็นการตีความตามความเชื่อส่วนบุคคล
								โปรดใช้วิจารณญาณ
							</p>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
