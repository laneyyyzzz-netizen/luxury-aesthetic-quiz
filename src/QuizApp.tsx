import React, { useState, useMemo, useEffect } from "react";

const ACCESS_CODE = "202688"; 
const THEME = { 
  bg: "#F9F9F7", 
  card: "#FFFFFF", 
  primary: "#81D8D0", 
  accent: "#B89B72", 
  text: "#1C1C1C" 
};

// 预加载函数：在用户做题时偷偷下载结果图片
const preloadImages = (urls: string[]) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

const DIMENSIONS = ["classic", "avantGarde", "minimal", "opulent", "lowKey"] as const;
type DimensionKey = (typeof DIMENSIONS)[number];

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  classic: "先锋显贵", 
  avantGarde: "先锋个性", 
  minimal: "极简主义", 
  opulent: "华丽美学", 
  lowKey: "老钱风"
};

const QUESTIONS = [
  { id: 1, title: "玩手机时，你最常…", options: [{ label: "刷理财/新闻", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } }, { label: "看潮流/街拍", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "清理桌面/收纳", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 2 } }, { label: "刷派对/度假 vlog", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 2, title: "出门约会，你第一反应？", options: [{ label: "穿好外套包包", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "造型要有记忆点", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "要舒服好活动", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "气场先拉满", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 3, title: "如果你买房，第一件家居？", options: [{ label: "稳重大木桌", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } }, { label: "设计感单椅", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "简约沙发床", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 2 } }, { label: "水晶灯/大吊灯", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 4, title: "路过奢侈品店，你会？", options: [{ label: "看看经典款", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } }, { label: "拍新系列陈列", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "摸摸面料做工", scores: { classic: 2, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "想象自己走进去", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 5, title: "给自己买礼物，你更像？", options: [{ label: "慢慢存一个大件", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } }, { label: "尝新奇特别单品", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "买每天都能用", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "买一眼很贵的", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 6, title: "别人夸你哪句最戳？", options: [{ label: "很有派，很稳", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "你太有个性了", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "好干净好高级", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "你一看就不好惹", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 7, title: "衣服上 Logo，你更？", options: [{ label: "小小一个刚好", scores: { classic: 3, avantGarde: 0, minimal: 0, opulent: 1, lowKey: 2 } }, { label: "大 Logo 才过瘾", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 3, lowKey: 0 } }, { label: "最好完全没有", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "看场合，看心情", scores: { classic: 2, avantGarde: 1, minimal: 1, opulent: 2, lowKey: 1 } }] },
  { id: 8, title: "旅行选地，你先看？", options: [{ label: "城市历史街区", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } }, { label: "展览/音乐节", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "人少景色干净", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "豪华酒店度假村", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 9, title: "逛完商场，你最容易？", options: [{ label: "被品质打动", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } }, { label: "被设计惊到", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "被舒适感拿捏", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "被“看起来很贵”吸走", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 10, title: "如果你是一句形容词？", options: [{ label: "稳，拎得清", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } }, { label: "怪，有点厉害", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "冷，但很高级", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "亮，很有存在感", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 11, title: "私人晚宴，你会穿？", options: [{ label: "剪裁精良的定制西装/小黑裙", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "设计感强的解构礼服", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "极简丝质长裙/羊绒套装", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "闪片/丝绒/夸张配饰", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 12, title: "艺术品收藏，你更偏好？", options: [{ label: "经典大师版画、古董家具", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "当代先锋装置、实验影像", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "极简雕塑、单色调画作", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 2 } }, { label: "巴洛克/洛可可风格、水晶雕塑", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 13, title: "选择度假目的地，你偏向？", options: [{ label: "巴黎、佛罗伦萨等老牌城市", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "柏林、东京等先锋艺术区", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "北欧、新西兰等人少自然风光", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "摩纳哥、迪拜等奢华度假地", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 14, title: "收到一份神秘礼物，你希望是？", options: [{ label: "Birkin/Kelly 级经典手袋", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "联名限量/设计师签名款", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "Cashmere 羊绒围巾/针织", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "钻石首饰/镶钻腕表", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 15, title: "在米其林餐厅点酒，你会？", options: [{ label: "选经典产区、年份老酒", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "问侍酒师推荐小众款", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "点清爽、不抢戏的", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "香槟/贵腐/名庄拉满", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 16, title: "你的书房/办公空间更像？", options: [{ label: "实木书架、皮质沙发、古董台灯", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "金属/玻璃/不对称线条", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "大量留白、原木桌、无杂物", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "大理石、水晶、丝绒软装", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 17, title: "参加品牌活动，你更在意？", options: [{ label: "品牌历史与工艺展示", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "创意陈列、话题造型", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "安静试穿、材质触感", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "红毯、聚光灯、社交曝光", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 18, title: "你的座驾理想型？", options: [{ label: "稳重低调的行政级轿车", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 3 } }, { label: "设计前卫的电动/概念车", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "简约线条、科技感内饰", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 2 } }, { label: "超跑/敞篷/大 Logo", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 19, title: "收到邀请函，你最期待？", options: [{ label: "马术俱乐部/私人博物馆开幕", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } }, { label: "时装周/艺术展/潮牌联名", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "品鉴会/茶会/私密沙龙", scores: { classic: 2, avantGarde: 0, minimal: 2, opulent: 0, lowKey: 3 } }, { label: "品牌晚宴/慈善舞会/红毯", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
  { id: 20, title: "如果拥有一件传家宝，你选？", options: [{ label: "手工皮具/定制西装", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } }, { label: "先锋设计师孤品", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } }, { label: "羊绒大衣/无 Logo 首饰", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } }, { label: "高级珠宝/镶钻腕表", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } }] },
];

export const QuizApp: React.FC = () => {
  const [inputCode, setInputCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // 预加载逻辑：在解锁成功后立即下载所有结果图
  useEffect(() => {
    if (isUnlocked) {
      preloadImages(["/hermes.jpg", "/balenciaga.jpg", "/celine.jpg", "/versace.jpg", "/loropiano.jpg"]);
    }
  }, [isUnlocked]);

  const handleUnlock = () => {
    if (inputCode.trim() === ACCESS_CODE) setIsUnlocked(true);
    else alert("邀请码无效");
  };

  const handleSelect = (idx: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = idx;
    setAnswers(nextAnswers);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else { 
      setLoading(true); 
      setTimeout(() => { setLoading(false); setFinished(true); }, 1500); 
    }
  };

  const finalAnalysis = useMemo(() => {
    if (!finished) return null;
    const scores: Record<DimensionKey, number> = { classic: 0, avantGarde: 0, minimal: 0, opulent: 0, lowKey: 0 };
    answers.forEach((ansIdx, qIdx) => {
      const opt = QUESTIONS[qIdx]?.options[ansIdx];
      if (opt) (Object.keys(opt.scores) as DimensionKey[]).forEach(k => scores[k] += (opt.scores as any)[k]);
    });
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const top = (Object.keys(scores) as DimensionKey[]).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return { scores, top, percents: (Object.keys(scores) as DimensionKey[]).map(k => ({ key: k, val: Math.round((scores[k]/total)*100) })) };
  }, [finished, answers]);

  const BRAND_MAP: Record<DimensionKey, any> = {
    classic: { name: "CHANEL / HERMÈS", image: "/hermes.jpg", title: "时尚先锋｜自律的自由", desc: "测出这个结果的你，骨子里有一种‘不讨好’的清冷。在你眼中，美是一场残酷的精简。你钟情黑白与廓形，是因为你追求绝对的自我秩序。" },
    avantGarde: { name: "BALENCIAGA / GUCCI", image: "/balenciaga.jpg", title: "艺术先锋｜打破边界的灵魂", desc: "拒绝平庸是你的本能。你不需要奢侈品来贴金，你本身就是一场流动的实验。这种‘怪美’的背后，是你对世界最温柔的叛逆。" },
    minimal: { name: "CELINE", image: "/celine.jpg", title: "极简主义｜内敛的张力", desc: "测出 Celine 的你，内心其实最不简单。你的一生都在做减法，剥离那些虚伪的社交辞令，只留下最真实的触感。" },
    opulent: { name: "VERSACE", image: "/versace.jpg", title: "华丽美学｜生命就要肆意闪耀", desc: "生命就该肆意闪耀，你是华丽美学的极致信徒。你从不掩饰自己的野心和欲望，那种扑面而来的生命力，是你对平庸生活最强有力的反击。" },
    lowKey: { name: "LORO PIANA", image: "/loropiano.jpg", title: "老钱风｜无需言说的底气", desc: "真正的奢华无需喧哗，羊绒的触感是你社交的底气。你追求的是一种‘向下扎根’的稳重。你不屑于暴发户式的堆砌。" }
  };

  if (!isUnlocked) {
    return (
      <div style={{ backgroundColor: THEME.bg }} className="fixed inset-0 z-50 flex items-center justify-center p-6 text-stone-800">
        <div className="max-w-sm w-full p-10 bg-white rounded-[40px] shadow-xl text-center">
          <h1 style={{ color: THEME.accent }} className="text-2xl font-serif tracking-[0.2em] mb-8 uppercase">Aesthetic DNA</h1>
          <input type="password" placeholder="ENTER CODE" value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full text-center text-2xl border-b border-stone-100 py-3 mb-8 focus:outline-none placeholder:text-stone-200" />
          <button onClick={handleUnlock} style={{ backgroundColor: THEME.primary }} className="w-full py-4 rounded-full text-white font-medium tracking-widest text-sm active:scale-95 transition-transform">开启测试</button>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ backgroundColor: THEME.bg }} className="fixed inset-0 flex items-center justify-center italic text-stone-400 animate-pulse font-serif">正在生成你的审美画像...</div>;

  return (
    <div style={{ backgroundColor: THEME.bg, color: THEME.text }} className="min-h-screen py-4 px-4 font-sans leading-relaxed text-stone-800">
      <div className="max-w-2xl mx-auto">
        {!finished ? (
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm relative">
             <div className="flex justify-between items-center mb-10 uppercase">
                {currentIndex > 0 ? (
                   <button onClick={() => setCurrentIndex(prev => prev - 1)} className="flex items-center gap-2 text-sm tracking-widest text-stone-400 hover:text-stone-800 transition-colors py-2">
                    <span className="text-lg">←</span> <span className="font-medium text-[12px]">BACK / 上一题</span>
                  </button>
                ) : <span className="text-[10px] tracking-widest text-stone-300">DNA RESEARCH</span>}
                <span className="text-[10px] tracking-widest text-stone-300">{currentIndex + 1} / 20</span>
             </div>
             <h2 className="text-2xl font-light mb-8 leading-snug">{QUESTIONS[currentIndex]?.title}</h2>
             <div className="grid gap-3">
               {QUESTIONS[currentIndex]?.options.map((opt, idx) => (
                 <button key={idx} onClick={() => handleSelect(idx)} className="w-full text-left p-5 rounded-2xl border border-stone-50 hover:bg-stone-50 transition-all hover:border-stone-200 text-stone-500 active:scale-[0.98] text-sm">
                   {opt.label}
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-6 shadow-xl text-center">
            <div className="mb-4">
              <p className="text-[10px] tracking-[0.3em] text-stone-300 uppercase mb-1">My Aesthetic DNA</p>
              <h2 className="text-3xl font-serif mb-1">{DIMENSION_LABELS[finalAnalysis!.top]}</h2>
              <p style={{ color: THEME.accent }} className="text-xs tracking-widest">{BRAND_MAP[finalAnalysis!.top].title}</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-stone-50/50 p-4 rounded-3xl border border-stone-50">
               <div className="w-full md:w-2/5 aspect-[4/5] overflow-hidden rounded-2xl shadow-sm bg-stone-100">
                  <img src={BRAND_MAP[finalAnalysis!.top].image} className="w-full h-full object-cover" alt="Result" />
               </div>
               <div className="w-full md:w-3/5 text-left">
                  <h3 className="text-xl font-serif tracking-widest mb-2 text-black uppercase">{BRAND_MAP[finalAnalysis!.top].name}</h3>
                  <p className="text-stone-500 leading-5 text-[13px] italic line-clamp-6">
                    {BRAND_MAP[finalAnalysis!.top].desc}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-6 max-w-sm mx-auto">
               <p className="text-[9px] tracking-[0.2em] text-stone-400 uppercase text-center mb-1">Analysis Results</p>
               {finalAnalysis?.percents.map(p => (
                 <div key={p.key} className="flex justify-between items-center px-2">
                   <span className="text-stone-800 font-bold text-[11px] w-20 text-left tracking-wider uppercase">{DIMENSION_LABELS[p.key as DimensionKey]}</span>
                   <div className="flex-1 mx-3 h-1 bg-stone-100 rounded-full overflow-hidden">
                     <div className="h-full bg-black" style={{ width: `${p.val}%` }} />
                   </div>
                   <span className="text-stone-900 font-serif text-xs w-8 text-right font-bold">{p.val}%</span>
                 </div>
               ))}
            </div>

            <button onClick={() => window.location.reload()} className="px-10 py-3 rounded-full border border-stone-200 text-[11px] text-stone-600 hover:text-black hover:border-black transition-all uppercase tracking-[0.3em] font-bold">
              Restart / 再测一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
};