import React, { useEffect, useMemo, useState } from "react";

// --- 商业配置区 ---
const ACCESS_CODE = "202688"; 
const THEME = {
  bg: "#F9F9F7",        
  card: "#FFFFFF",      
  primary: "#81D8D0",   
  accent: "#B89B72",    
  text: "#1C1C1C",      
  subText: "#666666"    
};

const DIMENSIONS = ["classic", "avantGarde", "minimal", "opulent", "lowKey"] as const;
type DimensionKey = (typeof DIMENSIONS)[number];
const DIMENSION_LABELS: Record<DimensionKey, string> = {
  classic: "经典显贵", avantGarde: "先锋个性", minimal: "极简冷淡", opulent: "高调华丽", lowKey: "老钱风"
};

// 引入 20 道题目数据
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

  if (!isUnlocked) {
    return (
      <div style={{ backgroundColor: THEME.bg }} className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full p-10 bg-white rounded-3xl shadow-xl border border-stone-100">
          <h1 style={{ color: THEME.accent }} className="text-2xl font-serif tracking-widest mb-2">LUXURY LAB</h1>
          <p className="text-xs text-stone-400 uppercase tracking-tighter mb-10">美学基因实验室 专属入口</p>
          <input 
            type="text" 
            placeholder="输入邀请码" 
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full text-center text-2xl border-b-2 border-stone-100 py-3 mb-8 focus:outline-none focus:border-stone-400 text-black"
          />
          <button onClick={handleUnlock} style={{ backgroundColor: THEME.primary }} className="w-full py-4 rounded-full text-white font-medium tracking-widest text-sm shadow-lg active:scale-95 transition-transform">开启测试</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: THEME.bg }} className="fixed inset-0 z-50 flex flex-col items-center justify-center px-10">
        <p style={{ color: THEME.accent }} className="text-center mb-4 font-serif italic text-lg animate-pulse">正在解析你的审美基因...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: THEME.bg, color: THEME.text }} className="min-h-screen py-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        {!finished ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
             <div className="flex justify-between items-end mb-10">
                <span style={{ color: THEME.accent }} className="text-xs font-serif">AESTHETIC TEST</span>
                <span className="text-[10px] text-stone-300">Q{currentIndex + 1} / 20</span>
             </div>
             <h2 className="text-2xl font-medium mb-10 leading-tight">{QUESTIONS[currentIndex]?.title}</h2>
             <div className="space-y-4">
               {QUESTIONS[currentIndex]?.options.map((opt, idx) => (
                 <button key={idx} onClick={() => handleSelect(idx)} className="w-full text-left p-5 rounded-2xl border border-stone-100 hover:border-stone-300 transition-all active:scale-[0.98]">
                   <span className="text-stone-600">{opt.label}</span>
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100 text-center">
            <h2 style={{ color: THEME.accent }} className="text-3xl font-serif mb-6">测试完成</h2>
            <p className="text-stone-500 mb-8 text-sm">您的审美 DNA 已上传云端，正在为您匹配品牌画像...</p>
            <button onClick={() => window.location.reload()} className="text-xs text-stone-300 underline tracking-widest">重新测试</button>
          </div>
        )}
      </div>
    </div>
  );
};