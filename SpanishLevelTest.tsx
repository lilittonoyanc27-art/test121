import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  BookOpen, 
  Target,
  BarChart3,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

// --- Types ---

type Level = 'A1' | 'A2' | 'B1' | 'B2';

interface Question {
  id: number;
  level: Level;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  translation: string;
}

// --- Data: 15 Questions across levels ---

const QUESTIONS: Question[] = [
  // A1
  {
    id: 1,
    level: 'A1',
    question: "Yo ___ español en la escuela.",
    options: ["estudio", "estudias", "estudia"],
    answer: "estudio",
    translation: "Ես իսպաներեն եմ սովորում դպրոցում:",
    explanation: "Իսպաներենում 'Yo' (ես) դերանվան համար -ar խմբի բայերը ստանում են -o վերջավորությունը (estudiar -> estudio):"
  },
  {
    id: 2,
    level: 'A1',
    question: "¿Cómo ___ llamas?",
    options: ["te", "se", "me"],
    answer: "te",
    translation: "Ինչպե՞ս է քո անունը (Ինչպե՞ս ես քեզ կոչում):",
    explanation: "Անունը հարցնելիս օգտագործվում է Llamarse անդրադարձ բայը, որը 'tú' (դու) դեպքում դառնում է 'te llamas':"
  },
  {
    id: 3,
    level: 'A1',
    question: "Ella ___ una casa grande.",
    options: ["tienes", "tiene", "tienen"],
    answer: "tiene",
    translation: "Նա մեծ տուն ունի:",
    explanation: "Tener (ունենալ) բայը 'ella' (նա) դեպքում խոնարհվում է որպես 'tiene':"
  },
  {
    id: 4,
    level: 'A1',
    question: "Mis padres ___ de Madrid.",
    options: ["son", "es", "somos"],
    answer: "son",
    translation: "Իմ ծնողները Մադրիդից են:",
    explanation: "Ser (լինել) բայը հոգնակի երրորդ դեմքի համար (ellos/mis padres) դառնում է 'son':"
  },
  // A2
  {
    id: 5,
    level: 'A2',
    question: "Ayer ___ al cine con mis amigos.",
    options: ["fui", "iba", "voy"],
    answer: "fui",
    translation: "Երեկ ես ընկերներիս հետ կինո գնացի:",
    explanation: "Ayer (երեկ) բառը պահանջում է Pretérito Indefinido (ավարտված անցյալ): Ir բայի համար 1-ին դեմքը 'fui' է:"
  },
  {
    id: 6,
    level: 'A2',
    question: "No ___ hacer los deberes hoy.",
    options: ["pudo", "he podido", "podía"],
    answer: "he podido",
    translation: "Այսօր չեմ կարողացել անել տնայինները:",
    explanation: "Hoy (այսօր) բառը սովորաբար պահանջում է Pretérito Perfecto (he podido), քանի որ օրը դեռ չի ավարտվել:"
  },
  {
    id: 7,
    level: 'A2',
    question: "Cuando era niño, ___ mucha leche.",
    options: ["bebí", "bebía", "bebo"],
    answer: "bebía",
    translation: "Երբ երեխա էի, շատ կաթ էի խմում:",
    explanation: "Անցյալում կրկնվող գործողությունների կամ սովորությունների համար օգտագործվում է Pretérito Imperfecto (bebía):"
  },
  {
    id: 8,
    level: 'A2',
    question: "Este libro es ___ que el otro.",
    options: ["mejor", "bueno", "más bueno"],
    answer: "mejor",
    translation: "Այս գիրքը ավելի լավն է, քան մյուսը:",
    explanation: "Bueno բառի համեմատական աստիճանը անկանոն է՝ 'mejor' (ավելի լավ):"
  },
  // B1
  {
    id: 9,
    level: 'B1',
    question: "Espero que ___ buen tiempo mañana.",
    options: ["haga", "hace", "hizo"],
    answer: "haga",
    translation: "Հուսով եմ, որ վաղը լավ եղանակ կլինի:",
    explanation: "Espero que (հուսով եմ, որ) արտահայտությունից հետո օգտագործվում է Subjuntivo (haga):"
  },
  {
    id: 10,
    level: 'B1',
    question: "Si tuviera dinero, ___ un coche nuevo.",
    options: ["compraría", "compro", "compre"],
    answer: "compraría",
    translation: "Եթե փող ունենայի, նոր մեքենա կգնեի:",
    explanation: "Պայմանական նախադասության մեջ (si + subjuntivo imperfecto) օգտագործվում է Condicional (compraría):"
  },
  {
    id: 11,
    level: 'B1',
    question: "Busco a alguien que ___ hablar ruso.",
    options: ["sabe", "sepa", "saben"],
    answer: "sepa",
    translation: "Փնտրում եմ մեկին, ով գիտի ռուսերեն խոսել:",
    explanation: "Երբ փնտրում ենք անորոշ մեկին (busco a alguien que...), օգտագործվում է Subjuntivo (sepa):"
  },
  {
    id: 12,
    level: 'B1',
    question: "Me molesta que la gente ___ en el metro.",
    options: ["grita", "grite", "gritan"],
    answer: "grite",
    translation: "Ինձ նյարդայնացնում է, որ մարդիկ գոռում են մետրոյում:",
    explanation: "Զգացմունքներ արտահայտող 'Me molesta que' կառույցից հետո օգտագործվում է Subjuntivo (grite):"
  },
  // B2
  {
    id: 13,
    level: 'B2',
    question: "Aunque ___ mucho, no aprobó el examen.",
    options: ["estudió", "estudie", "estudiara"],
    answer: "estudió",
    translation: "Չնայած նա շատ սովորեց, չանցավ քննությունը:",
    explanation: "Եթե փաստը իրական է և ավարտված անցյալում, Aunque-ից հետո օգտագործվում է Indicativo (estudió):"
  },
  {
    id: 14,
    level: 'B2',
    question: "De haberlo sabido, no ___.",
    options: ["hubiera venido", "habría venido", "ambas son correctas"],
    answer: "ambas son correctas",
    translation: "Եթե իմանայի, չէի գա:",
    explanation: "Անցյալի անկատար պայմանի դեպքում թույլատրելի է և՛ Pluscuamperfecto de Subjuntivo, և՛ Condicional Compuesto:"
  },
  {
    id: 15,
    level: 'B2',
    question: "Dudo mucho que Juan ___ la verdad.",
    options: ["dice", "diga", "dijera"],
    answer: "diga",
    translation: "Շատ եմ կասկածում, որ Խուանը ճշմարտությունն է ասում:",
    explanation: "Կասկած արտահայտող 'Dudo que' կառույցից հետո պարտադիր է Subjuntivo (diga):"
  }
];

// --- Sub-components ---

const LevelBadge = ({ level }: { level: Level }) => {
  const colors = {
    A1: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    A2: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    B1: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    B2: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[level]}`}>
      Level {level}
    </span>
  );
};

// --- Main App ---

export default function SpanishLevelTest() {
  const [step, setStep] = useState<'welcome' | 'testing' | 'result'>('welcome');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ id: number; isCorrect: boolean }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentQuestion = QUESTIONS[currentIdx];

  const handleAnswer = (option: string) => {
    if (feedback) return;

    const isCorrect = option === currentQuestion.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setAnswers(prev => [...prev, { id: currentQuestion.id, isCorrect }]);
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setStep('result');
      if (score >= 12) confetti({ particleCount: 200, spread: 70 });
    }
  };

  const calculatedLevel = useMemo(() => {
    if (score <= 4) return 'A1';
    if (score <= 8) return 'A2';
    if (score <= 12) return 'B1';
    return 'B2';
  }, [score]);

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-sky-500/10 rounded-[2rem] border-2 border-sky-500/20 flex items-center justify-center shadow-2xl shadow-sky-500/20">
              <BookOpen size={48} className="text-sky-500" />
            </div>
          </div>
          <div className="space-y-4">
             <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                Spanish <span className="text-sky-500 text-glow">Level</span> Test
             </h1>
             <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Որոշեք ձեր իսպաներենի մակարդակը</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-sm text-slate-400 leading-relaxed text-left space-y-3">
            <p>• 15 հարց (A1-ից մինչև B2)</p>
            <p>• Ակնթարթային բացատրություն սխալների դեպքում</p>
            <p>• Վերջնական մակարդակի որոշում</p>
          </div>
          <button 
            onClick={() => setStep('testing')}
            className="w-full py-6 bg-sky-600 rounded-[2rem] font-black uppercase tracking-widest hover:bg-sky-500 hover:scale-[1.02] transition-all shadow-xl shadow-sky-600/20"
          >
            Սկսել Քննությունը
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full space-y-12"
        >
          <div className="space-y-4">
             <Trophy size={120} className="text-yellow-500 mx-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]" />
             <h2 className="text-6xl font-black italic uppercase tracking-tighter">Արդյունք</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border-2 border-slate-800 text-center space-y-2">
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Ձեր Մակարդակը</div>
                <div className="text-8xl font-black italic text-sky-500 tracking-tighter">{calculatedLevel}</div>
             </div>
             <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border-2 border-slate-800 text-center space-y-2">
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Ճիշտ Պատասխաններ</div>
                <div className="text-8xl font-black italic text-emerald-500 tracking-tighter">{score}/15</div>
             </div>
          </div>

          <button 
            onClick={() => {
              setStep('welcome');
              setCurrentIdx(0);
              setScore(0);
              setAnswers([]);
              setFeedback(null);
            }}
            className="px-12 py-6 bg-slate-900 border-2 border-slate-800 rounded-full font-black text-xl uppercase tracking-widest hover:border-sky-500 transition-all"
          >
            <RotateCcw className="inline mr-2 mb-1" /> Նորից Փորձել
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Progress Header */}
        <header className="flex justify-between items-center bg-slate-900/80 p-6 rounded-[2rem] border border-slate-800 backdrop-blur-xl">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                 <Target size={20} />
              </div>
              <div className="text-left">
                 <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">ՀԱՐՑ {currentIdx + 1}/15</div>
                 <div className="font-black italic uppercase italic">Քննություն</div>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-sky-500" />
              <LevelBadge level={currentQuestion.level} />
           </div>
        </header>

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/40 border-2 border-slate-800 rounded-[3rem] p-8 md:p-14 space-y-10 relative overflow-hidden"
          >
             <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight text-white italic">
                   {currentQuestion.question}
                </h2>
                <div className="flex items-center gap-2 text-slate-500 font-bold italic text-lg">
                   <Lightbulb size={20} className="text-amber-500" />
                   ({currentQuestion.translation})
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt) => {
                  let statusStyle = "bg-slate-950 border-slate-900 hover:border-sky-500";
                  if (feedback) {
                    if (opt === currentQuestion.answer) statusStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                    else if (opt !== currentQuestion.answer && feedback === 'wrong') statusStyle = "opacity-40 bg-slate-950 border-slate-900";
                    else statusStyle = "opacity-40 bg-slate-950 border-slate-900";
                  }

                  return (
                    <button
                      key={opt}
                      disabled={!!feedback}
                      onClick={() => handleAnswer(opt)}
                      className={`group w-full p-6 text-left rounded-2xl border-2 transition-all font-black text-2xl uppercase tracking-tighter flex justify-between items-center ${statusStyle}`}
                    >
                      {opt}
                      {feedback && opt === currentQuestion.answer && <CheckCircle2 className="text-emerald-500" />}
                    </button>
                  );
                })}
             </div>

             {/* Feedback Explanation */}
             <AnimatePresence>
               {feedback && (
                 <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl border-2 space-y-4 ${feedback === 'correct' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}
                 >
                    <div className="flex items-center gap-3">
                       {feedback === 'correct' ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
                       <span className={`text-xl font-black uppercase italic tracking-tighter ${feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {feedback === 'correct' ? 'Փայլուն է!' : 'Ուշադրություն:'}
                       </span>
                    </div>
                    <p className="text-slate-400 font-medium italic text-sm leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                    <button 
                      onClick={nextQuestion}
                      className="flex items-center gap-2 text-sky-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
                    >
                       Հաջորդ հարցը <ArrowRight size={14} />
                    </button>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Info Footer */}
        <div className="max-w-lg mx-auto text-center opacity-40">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Մակարդակը որոշվում է Եվրոպական լեզվական շրջանակի (CEFR) համաձայն
           </p>
        </div>

      </div>
    </div>
  );
}
