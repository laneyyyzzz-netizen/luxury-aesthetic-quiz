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

// 引入你之前完整的 20 道题目 (此处为简略示意，请确保粘贴时保留你那 20 题完整数组)
const QUESTIONS = [
    {
        id: 1,
        title: "玩手机时，你最常…",
        options: [
          { label: "刷理财/新闻", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } },
          { label: "看潮流/街拍", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
          { label: "清理桌面/收纳", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 2 } },
          { label: "刷派对/度假 vlog", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
        ],
    },
    // ... 这里请确保包含你之前发给我的全部 20 道题目数据 ...
];

export const QuizApp: React.FC = () => {
  const [inputCode, setInputCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. 验证逻辑
  const handleUnlock = () => {
    if (inputCode.trim() === ACCESS_CODE) {
      setIsUnlocked(true);
    } else {
      alert("邀请码无效");
    }
  };

  // 2. 选择答案逻辑 (修复卡顿)
  const handleSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = idx;
    setAnswers(newAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setLoading(true); // 最后一题进入加载
      setTimeout(() => {
        setLoading(false);
        setFinished(true);
      }, 2000);
    }
  };

  // 锁屏界面 (修复文字看不见)
  if (!isUnlocked) {
    return (
      <div style={{ backgroundColor: THEME.bg }} className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full p-10 bg-white rounded-3xl shadow-xl border border-stone-100 text-center">
          <h1 style={{ color: THEME.accent }} className="text-2xl font-serif tracking-widest mb-6">LUXURY LAB</h1>
          <input 
            type="text" 
            placeholder="ENTER CODE" 
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            // 关键修复：添加了 text-black 确保输入可见
            className="w-full text-center text-2xl border-b-2 border-stone-100 py-3 mb-8 focus:outline-none focus:border-stone-400 text-black"
          />
          <button 
            onClick={handleUnlock}
            style={{ backgroundColor: THEME.primary }}
            className="w-full py-4 rounded-full text-white font-medium tracking-widest text-sm shadow-lg active:scale-95 transition-transform"
          >
            开启测试
          </button>
        </div>
      </div>
    );
  }

  // ... 加载和结果页保持不变 ...
  return (
    <div style={{ backgroundColor: THEME.bg }} className="min-h-screen py-10 px-4">
       {/* 这里放置你之前的测试题渲染逻辑，确保 handleSelect(idx) 被正确调用 */}
       {/* 提示：检查你的题目数组长度是否正确，如果数组只有3个元素，到第3题就会报错 */}
    </div>
  );
};