import React, { useState, useMemo } from "react";

// --- 配置与数据 ---
const ACCESS_CODE = "202688"; 
const THEME = {
  bg: "#F9F9F7", card: "#FFFFFF", primary: "#81D8D0", accent: "#B89B72", text: "#1C1C1C"
};

const DIMENSIONS = ["classic", "avantGarde", "minimal", "opulent", "lowKey"] as const;
type DimensionKey = (typeof DIMENSIONS)[number];
const DIMENSION_LABELS: Record<DimensionKey, string> = {
  classic: "经典显贵", avantGarde: "先锋个性", minimal: "极简冷淡", opulent: "高调华丽", lowKey: "老钱风"
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

  const handleUnlock = () => {
    if (inputCode.trim() === ACCESS_CODE) setIsUnlocked(true);
    else alert("邀请码无效");
  };

  const handleSelect = (idx: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = idx;
    setAnswers(nextAnswers);
    if (currentIndex < QUESTIONS.length - 1) setCurrentIndex(prev => prev + 1);
    else { setLoading(true); setTimeout(() => { setLoading(false); setFinished(true); }, 2000); }
  };

  const finalAnalysis = useMemo(() => {
    if (!finished) return null;
    const scores: Record<DimensionKey, number> = { classic: 0, avantGarde: 0, minimal: 0, opulent: 0, lowKey: 0 };
    answers.forEach((ansIdx, qIdx) => {
      const opt = QUESTIONS[qIdx]?.options[ansIdx];
      if (opt) (Object.keys(opt.scores) as DimensionKey[]).forEach(k => scores[k] += opt.scores[k]);
    });
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const top = (Object.keys(scores) as DimensionKey[]).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return { scores, top, percents: (Object.keys(scores) as DimensionKey[]).map(k => ({ key: k, val: Math.round((scores[k]/total)*100) })) };
  }, [finished, answers]);

  const BRAND_MAP: Record<DimensionKey, any> = {
    classic: { name: "Hermès / Patek Philippe", desc: "秩序与经典的极致守护者。", tags: ["恒久", "工艺", "身份"] },
    avantGarde: { name: "Maison Margiela / Rick Owens", desc: "审美是先锋艺术的实验场。", tags: ["解构", "先锋", "表达"] },
    minimal: { name: "The Row / Lemaire", desc: "极致的减法是最高级的加法。", tags: ["纯粹", "质感", "内敛"] },
    opulent: { name: "Versace / Dolce & Gabbana", desc: "生命就该肆意闪耀，极度张扬。", tags: ["极致", "张扬", "浪漫"] },
    lowKey: { name: "Brunello Cucinelli / Loro Piana", desc: "真正的奢华无需喧哗，在于触感。", tags: ["老钱", "舒适", "隐奢"] }
  };

  if (!isUnlocked) {
    return (
      <div style={{ backgroundColor: THEME.bg }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="max-w-sm w-full p-10 bg-white rounded-[40px] shadow-xl text-center">
          <h1 style={{ color: THEME.accent }} className="text-2xl font-serif tracking-[0.2em] mb-8">LUXURY DNA</h1>
          <input type="text" placeholder="ENTER CODE" value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full text-center text-2xl border-b border-stone-100 py-3 mb-8 focus:outline-none text-black" />
          <button onClick={handleUnlock} style={{ backgroundColor: THEME.primary }} className="w-full py-4 rounded-full text-white font-medium tracking-widest text-sm shadow-lg">开启测试</button>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ backgroundColor: THEME.bg }} className="fixed inset-0 flex items-center justify-center italic text-stone-400 animate-pulse">解析中美学基因...</div>;

  return (
    <div style={{ backgroundColor: THEME.bg, color: THEME.text }} className="min-h-screen py-10 px-4 font-sans leading-relaxed">
      <div className="max-w-2xl mx-auto">
        {!finished ? (
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm">
             <div className="flex justify-between items-center mb-12 text-[10px] tracking-widest text-stone-300 uppercase">
                <span>Aesthetic Research</span>
                <span>{currentIndex + 1} / 20</span>
             </div>
             <h2 className="text-2xl font-light mb-12">{QUESTIONS[currentIndex]?.title}</h2>
             <div className="grid gap-4">
               {QUESTIONS[currentIndex]?.options.map((opt, idx) => (
                 <button key={idx} onClick={() => handleSelect(idx)} className="w-full text-left p-6 rounded-2xl border border-stone-50 hover:bg-stone-50 transition-colors text-stone-500 hover:text-stone-900">
                   {opt.label}
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-10 shadow-xl text-center animate-in fade-in duration-1000">
            <span style={{ color: THEME.accent }} className="text-xs tracking-[0.4em] uppercase">Result</span>
            <h2 className="text-4xl font-serif mt-6 mb-10">{DIMENSION_LABELS[finalAnalysis!.top]}</h2>
            
            {/* 简易雷达图（进度条形式） */}
            <div className="space-y-4 mb-12 max-w-xs mx-auto text-left">
               {finalAnalysis?.percents.map(p => (
                 <div key={p.key}>
                    <div className="flex justify-between text-[10px] mb-1 text-stone-400 uppercase tracking-tighter">
                      <span>{DIMENSION_LABELS[p.key as DimensionKey]}</span>
                      <span>{p.val}%</span>
                    </div>
                    <div className="h-[2px] w-full bg-stone-50 overflow-hidden">
                      <div className="h-full bg-stone-300 transition-all duration-1000" style={{ width: `${p.val}%` }} />
                    </div>
                 </div>
               ))}
            </div>

            <div className="py-8 border-y border-stone-50 italic text-stone-500 font-serif mb-10 text-sm">
              "{BRAND_MAP[finalAnalysis!.top].desc}"
            </div>

            <div className="mb-12">
              <p className="text-[10px] text-stone-300 uppercase tracking-widest mb-2">灵魂匹配品牌</p>
              <p className="text-xl font-light tracking-tight" style={{ color: THEME.accent }}>{BRAND_MAP[finalAnalysis!.top].name}</p>
            </div>

            <button onClick={() => window.location.reload()} className="text-[10px] text-stone-300 underline tracking-[0.2em] uppercase">Restart Analysis</button>
          </div>
        )}
      </div>
    </div>
  );
};