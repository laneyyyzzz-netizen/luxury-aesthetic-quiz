import React, { useEffect, useMemo, useState } from "react";

const DIMENSIONS = ["classic", "avantGarde", "minimal", "opulent", "lowKey"] as const;
type DimensionKey = (typeof DIMENSIONS)[number];

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  classic: "经典显贵",
  avantGarde: "先锋个性",
  minimal: "极简冷淡",
  opulent: "高调华丽",
  lowKey: "老钱风",
};

type ScoreMap = Record<DimensionKey, number>;

type BrandKey =
  | "hermes"
  | "chanel"
  | "balenciaga"
  | "gucci"
  | "celine"
  | "versace"
  | "brunello"
  | "oldmoney";

type BrandMeta = {
  key: BrandKey;
  name: string;
  slogan: string;
  imageUrl: string; // must reference /public
  tags: string[];
  quote: string;
  weights: Record<DimensionKey, number>;
  primary: DimensionKey;
};

// 8 大品牌：图片路径严格引用 /public 下的本地文件
const BRANDS: Record<BrandKey, BrandMeta> = {
  hermes: {
    key: "hermes",
    name: "Hermes",
    slogan: "极致的秩序与顶级的手工灵魂。",
    imageUrl: "/hermes.jpg",
    tags: ["#极致工艺", "#经典显贵", "#不动声色"],
    quote: "你赢在耐心与细节：稳、贵、但从不喧哗。",
    primary: "classic",
    weights: { classic: 1.25, lowKey: 0.9, minimal: 0.45, opulent: 0.35, avantGarde: 0.1 },
  },
  chanel: {
    key: "chanel",
    name: "Chanel",
    slogan: "不被定义的优雅，是永恒的叛逆。",
    imageUrl: "/chanel.jpg",
    tags: ["#法式腔调", "#精致掌控", "#永远体面"],
    quote: "你的高级感不是用力，而是永远“刚刚好”的分寸。",
    primary: "opulent",
    weights: { opulent: 1.1, classic: 0.85, lowKey: 0.35, minimal: 0.2, avantGarde: 0.25 },
  },
  balenciaga: {
    key: "balenciaga",
    name: "Balenciaga",
    slogan: "打破陈规，定义未来的美学废墟。",
    imageUrl: "/balenciaga.jpg",
    tags: ["#先锋轮廓", "#态度优先", "#反套路"],
    quote: "你不靠共识取胜，你靠“风格”让人记住。",
    primary: "avantGarde",
    weights: { avantGarde: 1.25, opulent: 0.7, minimal: 0.35, classic: 0.15, lowKey: 0.1 },
  },
  gucci: {
    key: "gucci",
    name: "Gucci",
    slogan: "华丽的复古梦境，自我的狂欢宣言。",
    imageUrl: "/gucci.jpg",
    tags: ["#张扬但高级", "#复古叙事", "#氛围感"],
    quote: "你不是想低调，你只是想让懂的人先看到你。",
    primary: "opulent",
    weights: { opulent: 0.95, avantGarde: 0.75, classic: 0.45, minimal: 0.2, lowKey: 0.1 },
  },
  celine: {
    key: "celine",
    name: "Celine",
    slogan: "极简清冷，是拒绝被看透的保护色。",
    imageUrl: "/celine.jpg",
    tags: ["#克制冷淡", "#利落线条", "#高级不费力"],
    quote: "你不追热点，你只在意“干净到位”。",
    primary: "minimal",
    weights: { minimal: 1.15, classic: 0.7, lowKey: 0.65, avantGarde: 0.2, opulent: 0.1 },
  },
  versace: {
    key: "versace",
    name: "Versace",
    slogan: "极致的张扬，生命力肆意流淌的金。",
    imageUrl: "/versace.jpg",
    tags: ["#高调华丽", "#强势美学", "#主角光环"],
    quote: "你不是爱浮夸，你只是讨厌“没存在感”。",
    primary: "opulent",
    weights: { opulent: 1.35, avantGarde: 0.55, classic: 0.2, minimal: 0.05, lowKey: 0.05 },
  },
  brunello: {
    key: "brunello",
    name: "Brunello Cucinelli",
    slogan: "人文主义下的高尚奢华。",
    imageUrl: "/brunello.jpg",
    tags: ["#材质上瘾", "#贵在触感", "#松弛克制"],
    quote: "你的贵不在外显，而在“摸上去就知道不一样”。",
    primary: "lowKey",
    weights: { lowKey: 1.55, classic: 1.0, minimal: 0.95, opulent: 0.25, avantGarde: 0.15 },
  },
  oldmoney: {
    key: "oldmoney",
    name: "老钱风 (Loro Piana)",
    slogan: "在安静中，听见金钱最从容的呼吸。",
    imageUrl: "/oldmoney.jpg",
    tags: ["#老钱风", "#松弛感", "#顶级面料"],
    quote: "你的高贵不在于标签，而在于不经意间的松弛感。",
    primary: "lowKey",
    weights: { lowKey: 1.6, minimal: 1.0, classic: 0.9, opulent: 0.2, avantGarde: 0.15 },
  },
};

const LOADING_TEXTS = ["正在提取审美切片…", "对比 8 大奢牌基因库…", "生成您的美学画像…"];
const LOADING_DURATION_MS = 2500;

type Option = { label: string; scores: ScoreMap };
type Question = { id: number; title: string; options: Option[] };

const QUESTIONS: Question[] = [
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
  {
    id: 2,
    title: "出门约会，你第一反应？",
    options: [
      { label: "穿好外套包包", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "造型要有记忆点", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "要舒服好活动", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "气场先拉满", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 3,
    title: "如果你买房，第一件家居？",
    options: [
      { label: "稳重大木桌", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } },
      { label: "设计感单椅", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "简约沙发床", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 2 } },
      { label: "水晶灯/大吊灯", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 4,
    title: "路过奢侈品店，你会？",
    options: [
      { label: "看看经典款", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } },
      { label: "拍新系列陈列", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "摸摸面料做工", scores: { classic: 2, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "想象自己走进去", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 5,
    title: "给自己买礼物，你更像？",
    options: [
      { label: "慢慢存一个大件", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } },
      { label: "尝新奇特别单品", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "买每天都能用", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "买一眼很贵的", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 6,
    title: "别人夸你哪句最戳？",
    options: [
      { label: "很有派，很稳", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "你太有个性了", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "好干净好高级", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "你一看就不好惹", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 7,
    title: "衣服上 Logo，你更？",
    options: [
      { label: "小小一个刚好", scores: { classic: 3, avantGarde: 0, minimal: 0, opulent: 1, lowKey: 2 } },
      { label: "大 Logo 才过瘾", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 3, lowKey: 0 } },
      { label: "最好完全没有", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "看场合，看心情", scores: { classic: 2, avantGarde: 1, minimal: 1, opulent: 2, lowKey: 1 } },
    ],
  },
  {
    id: 8,
    title: "旅行选地，你先看？",
    options: [
      { label: "城市历史街区", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } },
      { label: "展览/音乐节", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "人少景色干净", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "豪华酒店度假村", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 9,
    title: "逛完商场，你最容易？",
    options: [
      { label: "被品质打动", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } },
      { label: "被设计惊到", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "被舒适感拿捏", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "被“看起来很贵”吸走", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 10,
    title: "如果你是一句形容词？",
    options: [
      { label: "稳，拎得清", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } },
      { label: "怪，有点厉害", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "冷，但很高级", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "亮，很有存在感", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 11,
    title: "私人晚宴，你会穿？",
    options: [
      { label: "剪裁精良的定制西装/小黑裙", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "设计感强的解构礼服", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "极简丝质长裙/羊绒套装", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "闪片/丝绒/夸张配饰", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 12,
    title: "艺术品收藏，你更偏好？",
    options: [
      { label: "经典大师版画、古董家具", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "当代先锋装置、实验影像", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "极简雕塑、单色调画作", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 2 } },
      { label: "巴洛克/洛可可风格、水晶雕塑", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 13,
    title: "选择度假目的地，你偏向？",
    options: [
      { label: "巴黎、佛罗伦萨等老牌城市", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "柏林、东京等先锋艺术区", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "北欧、新西兰等人少自然风光", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "摩纳哥、迪拜等奢华度假地", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 14,
    title: "收到一份神秘礼物，你希望是？",
    options: [
      { label: "Birkin/Kelly 级经典手袋", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "联名限量/设计师签名款", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "Cashmere 羊绒围巾/针织", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "钻石首饰/镶钻腕表", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 15,
    title: "在米其林餐厅点酒，你会？",
    options: [
      { label: "选经典产区、年份老酒", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "问侍酒师推荐小众款", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "点清爽、不抢戏的", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "香槟/贵腐/名庄拉满", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 16,
    title: "你的书房/办公空间更像？",
    options: [
      { label: "实木书架、皮质沙发、古董台灯", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "金属/玻璃/不对称线条", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "大量留白、原木桌、无杂物", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "大理石、水晶、丝绒软装", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 17,
    title: "参加品牌活动，你更在意？",
    options: [
      { label: "品牌历史与工艺展示", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "创意陈列、话题造型", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "安静试穿、材质触感", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "红毯、聚光灯、社交曝光", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 18,
    title: "你的座驾理想型？",
    options: [
      { label: "稳重低调的行政级轿车", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 3 } },
      { label: "设计前卫的电动/概念车", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "简约线条、科技感内饰", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 2 } },
      { label: "超跑/敞篷/大 Logo", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 19,
    title: "收到邀请函，你最期待？",
    options: [
      { label: "马术俱乐部/私人博物馆开幕", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 1, lowKey: 2 } },
      { label: "时装周/艺术展/潮牌联名", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "品鉴会/茶会/私密沙龙", scores: { classic: 2, avantGarde: 0, minimal: 2, opulent: 0, lowKey: 3 } },
      { label: "品牌晚宴/慈善舞会/红毯", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
  {
    id: 20,
    title: "如果拥有一件传家宝，你选？",
    options: [
      { label: "手工皮具/定制西装", scores: { classic: 3, avantGarde: 0, minimal: 1, opulent: 0, lowKey: 2 } },
      { label: "先锋设计师孤品", scores: { classic: 0, avantGarde: 3, minimal: 0, opulent: 2, lowKey: 0 } },
      { label: "羊绒大衣/无 Logo 首饰", scores: { classic: 1, avantGarde: 0, minimal: 3, opulent: 0, lowKey: 3 } },
      { label: "高级珠宝/镶钻腕表", scores: { classic: 0, avantGarde: 1, minimal: 0, opulent: 3, lowKey: 0 } },
    ],
  },
];

type Scores = Record<DimensionKey, number>;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickTopDimension(scores: Scores): DimensionKey {
  let maxKey: DimensionKey = DIMENSIONS[0];
  for (const key of DIMENSIONS) {
    if (scores[key] > scores[maxKey]) maxKey = key;
  }
  return maxKey;
}

function pseudoRandom(seed: number, key: string): number {
  let h = seed;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return (Math.sin(h) * 0.5 + 0.5) * 0.1 + 0.95;
}

function computeBrandScores(scores: Scores): Record<BrandKey, number> {
  const result = {} as Record<BrandKey, number>;
  const topDim = pickTopDimension(scores);
  const seed = DIMENSIONS.reduce((acc, d) => acc + scores[d] * 7, 0);

  (Object.keys(BRANDS) as BrandKey[]).forEach((brandKey) => {
    const brand = BRANDS[brandKey];
    let s = 0;
    for (const dim of DIMENSIONS) {
      s += scores[dim] * brand.weights[dim];
    }
    if (brand.primary === topDim) s += 2.5;
    const randomFactor = pseudoRandom(seed, brandKey);
    result[brandKey] = s * randomFactor;
  });

  return result;
}

function pickTopBrand(brandScores: Record<BrandKey, number>): BrandKey {
  const keys = Object.keys(brandScores) as BrandKey[];
  let best = keys[0];
  for (const k of keys) {
    if (brandScores[k] > brandScores[best]) best = k;
  }
  return best;
}

function brandFitPercent(brandKey: BrandKey, scores: Scores, perQuestionMax = 3) {
  const maxPerDimension = perQuestionMax * QUESTIONS.length;
  const brand = BRANDS[brandKey];
  let maxPossible = 0;
  for (const dim of DIMENSIONS) maxPossible += maxPerDimension * brand.weights[dim];
  const brandScores = computeBrandScores(scores);
  const raw = brandScores[brandKey] / Math.max(maxPossible, 1);
  return Math.round(clamp(raw * 100, 0, 100));
}

function fallbackDataUrl(title: string) {
  const safe = encodeURIComponent(title);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b0b"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="700" fill="url(#g)"/>
  <rect x="24" y="24" width="1152" height="652" rx="40" fill="none" stroke="#B89B72" stroke-width="2"/>
  <circle cx="140" cy="140" r="22" fill="#81D8D0" opacity="0.9"/>
  <text x="80" y="360" fill="#ffffff" opacity="0.9" font-family="Optima, Songti SC, serif" font-size="56">${safe}</text>
  <text x="80" y="430" fill="#ffffff" opacity="0.55" font-family="system-ui, -apple-system, sans-serif" font-size="26">请把图片放到 public/ 并按文件名对应</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function RadarChart({ scores }: { scores: Scores }) {
  const values = DIMENSIONS.map((key) => scores[key] || 0);
  const max = Math.max(...values, 1);
  const radius = 80;
  const center = { x: 100, y: 100 };

  const points = values
    .map((v, i) => {
      const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
      const r = (v / max) * radius;
      const x = center.x + r * Math.cos(angle);
      const y = center.y + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  const gridCircles = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {gridCircles.map((p) => (
        <circle
          key={p}
          cx={center.x}
          cy={center.y}
          r={radius * p}
          className="fill-none stroke-white/10"
        />
      ))}

      {DIMENSIONS.map((_, i) => {
        const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        return (
          <line
            key={i}
            x1={center.x}
            y1={center.y}
            x2={x}
            y2={y}
            className="stroke-white/40"
          />
        );
      })}

      <polygon
        points={points}
        className="stroke-white"
        fill="rgba(255,255,255,0.2)"
        strokeWidth={2}
      />

      {DIMENSIONS.map((key, i) => {
        const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
        const x = center.x + (radius + 16) * Math.cos(angle);
        const y = center.y + (radius + 16) * Math.sin(angle);
        return (
          <text
            key={key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/70 text-[10px]"
          >
            {DIMENSION_LABELS[key]}
          </text>
        );
      })}
    </svg>
  );
}

export const QuizApp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isModeling, setIsModeling] = useState(false);
  const [hasModeled, setHasModeled] = useState(false);

  useEffect(() => {
    if (!loading) return;
    setLoadingTextIndex(0);
    setLoadingProgress(0);

    const textInterval = setInterval(() => {
      setLoadingTextIndex((i) => (i + 1) % LOADING_TEXTS.length);
    }, 800);

    const start = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / LOADING_DURATION_MS) * 100);
      setLoadingProgress(p);
    }, 50);

    const done = setTimeout(() => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      setLoading(false);
      setFinished(true);
    }, LOADING_DURATION_MS);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      clearTimeout(done);
    };
  }, [loading]);

  const currentQuestion = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;

  const aggregatedScores = useMemo<Scores>(() => {
    const base = DIMENSIONS.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Scores);

    answers.forEach((answerIndex, qIndex) => {
      if (answerIndex == null) return;
      const option = QUESTIONS[qIndex].options[answerIndex];
      for (const key of DIMENSIONS) base[key] += option.scores[key] || 0;
    });

    return base;
  }, [answers]);

  const resultDimension = useMemo<DimensionKey | null>(() => {
    if (!finished) return null;
    return pickTopDimension(aggregatedScores);
  }, [aggregatedScores, finished]);

  const resultBrandKey = useMemo<BrandKey | null>(() => {
    if (!finished) return null;
    const brandScores = computeBrandScores(aggregatedScores);
    return pickTopBrand(brandScores);
  }, [aggregatedScores, finished]);

  const handleSelectOption = (optionIndex: number) => {
    if (isModeling) return;
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = optionIndex;
    setAnswers(nextAnswers);

    if (currentIndex === 3 && !hasModeled) {
      setIsModeling(true);
      setHasModeled(true);
      setTimeout(() => {
        setIsModeling(false);
        setCurrentIndex((prev) => Math.min(prev + 1, total - 1));
      }, 1500);
      return;
    }

    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoading(true);
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setFinished(false);
    setLoading(false);
    setIsModeling(false);
    setHasModeled(false);
  };

  const progress = (currentIndex / total) * 100;

  const resultBrand = resultBrandKey ? BRANDS[resultBrandKey] : null;
  const fitPercent =
    resultBrandKey != null ? brandFitPercent(resultBrandKey, aggregatedScores) : 0;

  if (loading) {
    return (
      <div
        style={{ backgroundColor: "#121212", minHeight: "100vh" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white px-6"
      >
        <p className="text-base md:text-lg mb-8 transition-opacity duration-300">
          {LOADING_TEXTS[loadingTextIndex]}
        </p>
        <div
          className="w-full max-w-xs h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${loadingProgress}%`, backgroundColor: "#81D8D0" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh" }} className="text-white flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 style={{ color: "#B89B72" }} className="mt-1 text-2xl md:text-4xl font-semibold tracking-[0.18em] font-serif">
            测测你的骨子里，最适配哪种奢侈品牌美学？
          </h1>
          <p className="mt-3 text-xs md:text-sm text-[#f5f5f5]/85">
            只有 1% 的人能解锁的顶级审美基因报告
          </p>
        </div>

        <div style={{ backgroundColor: "#1D1D1D" }} className="backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-luxury-card">
          {!finished ? (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.max(progress, 5)}%`, backgroundColor: "#81D8D0" }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-200/70">
                    第 {currentIndex + 1} / {total} 题
                  </p>
                </div>
                <button
                  onClick={handleRestart}
                  style={{ backgroundColor: "#81D8D0", color: "#000" }}
                  className="text-xs px-3 py-1.5 rounded-full transition-all active:scale-95 active:translate-y-[1px]"
                >
                  重新开始
                </button>
              </div>

              {isModeling ? (
                <div className="py-10 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-tiffany/40 border-t-tiffany animate-spin" />
                  <p className="text-sm md:text-base text-[#f5f5f5]/90">
                    正在进行多维度美学建模…
                  </p>
                  <p className="text-[11px] text-slate-300/70">
                    为你精准掉落到 8 大品牌之一
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-bronze/80">
                      Q{String(currentIndex + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-3 text-lg md:text-2xl font-medium leading-relaxed">
                      {currentQuestion.title}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = answers[currentIndex] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isModeling}
                          className={`group w-full text-left px-4 py-3 md:px-5 md:py-4 rounded-2xl border transition-all active:scale-95 active:translate-y-[1px]
                        ${
                          isSelected
                            ? "shadow-[0_0_24px_rgba(129,216,208,0.4)]"
                            : "border-white/10 bg-white/0"
                        }`}
                        style={isSelected ? { backgroundColor: "rgba(129,216,208,0.2)", borderColor: "rgba(129,216,208,0.8)" } : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-semibold
                            ${
                              isSelected
                                ? ""
                                : "border-white/40 text-white/70"
                            }`}
                            style={isSelected ? { backgroundColor: "#81D8D0", borderColor: "#81D8D0", color: "#000" } : undefined}
                            >
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <p className="text-sm md:text-base text-slate-50/90 leading-none">
                              {option.label}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-bronze/80">
                    Luxury Aesthetic Profile
                  </p>
                  <h2 style={{ color: "#B89B72" }} className="mt-2 text-xl md:text-2xl font-semibold font-serif">
                    你的奢侈品美学基因结果
                  </h2>
                </div>
                <button
                  onClick={handleRestart}
                  style={{ backgroundColor: "#81D8D0", color: "#000" }}
                  className="text-xs md:text-sm px-3 py-1.5 rounded-full transition-all active:scale-95 active:translate-y-[1px]"
                >
                  再测一次
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div className="bg-[#1D1D1D] border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col">
                  <p className="text-xs text-slate-200/70 mb-3">五维度雷达图</p>
                  <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 flex items-center justify-center">
                    <div className="w-[90%] h-[90%]">
                      <RadarChart scores={aggregatedScores} />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] md:text-xs text-slate-200/80">
                    {DIMENSIONS.map((key) => (
                      <div key={key} className="flex items-center justify-between gap-1">
                        <span className="text-slate-200/70">{DIMENSION_LABELS[key]}</span>
                        <span style={{ color: "#81D8D0" }} className="font-semibold">{aggregatedScores[key] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    {resultDimension && resultBrand && (
                      <>
                        <p className="text-sm text-slate-200/70">
                          你的主美学维度：{" "}
                          <span style={{ color: "#81D8D0" }} className="font-medium">
                            {DIMENSION_LABELS[resultDimension]}
                          </span>
                        </p>

                        <h3 style={{ color: "#B89B72" }} className="mt-3 text-2xl md:text-3xl font-semibold font-serif brand-title-float">
                          品牌掉落：{resultBrand.name}
                        </h3>
                        <p style={{ color: "#B89B72" }} className="mt-1 text-sm md:text-base font-serif opacity-90">
                          {resultBrand.slogan}
                        </p>

                        <div className="mt-4">
                          <div className="overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-[0.5px] border-bronze/80 aspect-[3/4] h-[500px] mx-auto bg-[#1D1D1D] flex items-center justify-center">
                            <img
                              key={resultBrand.imageUrl}
                              src={resultBrand.imageUrl}
                              alt={resultBrand.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.currentTarget.src = fallbackDataUrl(resultBrand.name);
                              }}
                            />
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#f5f5f5]/85">
                            {resultBrand.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{ backgroundColor: "rgba(129,216,208,0.2)", borderColor: "rgba(129,216,208,0.7)", color: "#81D8D0" }}
                                className="px-2 py-1 rounded-full border"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-bronze/80">
                            审美适配度
                          </p>
                          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${clamp(fitPercent, 0, 100)}%`, backgroundColor: "#81D8D0" }}
                            />
                          </div>
                          <p className="mt-1 text-sm text-[#f5f5f5]/90">
                            适配度约{" "}
                            <span style={{ color: "#81D8D0" }} className="font-semibold">{fitPercent}%</span>
                          </p>
                        </div>

                        <p className="mt-4 text-sm md:text-base text-slate-200/90 leading-relaxed">
                          {resultBrand.quote}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-3">
                    <p className="text-[10px] md:text-xs text-slate-300/60 leading-relaxed">
                      本测试为筛查评估工具，不能替代专业诊断。本页面结果仅用于个人风格与消费偏好参考，不构成任何投资、消费或医疗建议。
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

