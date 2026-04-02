import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    id: 1,
    category: "psych",
    text: "大切な人があなたに冷たくなったとき、最初に頭をよぎるのは？",
    options: [
      { label: "私が何かしたせいだ", schema: "self_sacrifice" },
      { label: "どうせいつかこうなると思ってた", schema: "abandonment" },
      { label: "なぜ私だけこんな目に遭うのか", schema: "mistrust" },
      { label: "気づかないふりをしよう", schema: "suppression" },
    ],
  },
  {
    id: 2,
    category: "psych",
    text: "人に何かを頼むとき、どんな気持ちになる？",
    options: [
      { label: "申し訳なくて、できるだけ頼りたくない", schema: "self_sacrifice" },
      { label: "断られる気がして、最初から諦める", schema: "abandonment" },
      { label: "頼んでも結局自分でやることになる気がする", schema: "mistrust" },
      { label: "特に何も感じない、でも実際はほとんど頼まない", schema: "suppression" },
    ],
  },
  {
    id: 3,
    category: "psych",
    text: "誰かにひどいことをされたとき、あなたはどうする？",
    options: [
      { label: "相手より自分を責める気持ちが勝る", schema: "self_sacrifice" },
      { label: "関係を静かに終わらせる", schema: "abandonment" },
      { label: "怒りを感じるが、絶対に表に出さない", schema: "suppression" },
      { label: "なかったことにして、また同じように接する", schema: "submission" },
    ],
  },
  {
    id: 4,
    category: "psych",
    text: "「愛されている」と感じるのはどんなとき？",
    options: [
      { label: "相手のために何かができたとき", schema: "self_sacrifice" },
      { label: "相手が自分から連絡してきたとき", schema: "abandonment" },
      { label: "相手が怒っていないとき", schema: "submission" },
      { label: "正直よくわからない、感じた記憶があまりない", schema: "deprivation" },
    ],
  },
  {
    id: 5,
    category: "psych",
    text: "今の、あるいは過去の一番近い関係を思い浮かべたとき、一番近い感覚は？",
    options: [
      { label: "常に気を張っていた", schema: "mistrust" },
      { label: "自分だけが頑張っていた", schema: "self_sacrifice" },
      { label: "本当の自分を出せなかった", schema: "submission" },
      { label: "なぜこうなったのかいまだにわからない", schema: "deprivation", spiritual: true },
    ],
  },
  {
    id: 6,
    category: "psych",
    text: "「もうやめたい」と思いながらも続けていた関係が、あなたにはありますか？",
    options: [
      { label: "ある、そして今もそれが続いている", schema: "submission" },
      { label: "あった、でも自分から終わらせることができなかった", schema: "self_sacrifice" },
      { label: "ある、理由はわからないけど抜け出せない", schema: "deprivation", spiritual: true },
      { label: "ない、でもいつも似たような状況になる", schema: "abandonment" },
    ],
  },
  {
    id: 7,
    category: "body",
    text: "誰かといるとき、体にどんな感覚がある？",
    options: [
      { label: "肩や首が無意識に緊張している", body: "sympathetic" },
      { label: "胃やお腹が重くなる", body: "sympathetic" },
      { label: "息が浅くなる、または止めてしまっている", body: "freeze" },
      { label: "感覚が薄い、よくわからない", body: "shutdown" },
    ],
  },
  {
    id: 8,
    category: "body",
    text: "一人になったとき、体はどうなる？",
    options: [
      { label: "やっと息ができる感じがする", body: "sympathetic" },
      { label: "どっと疲れが出る", body: "sympathetic" },
      { label: "何もしたくなくなる", body: "shutdown" },
      { label: "逆に落ち着かなくなる", body: "freeze" },
    ],
  },
  {
    id: 9,
    category: "body",
    text: "誰かに責められたとき、体はどこに反応する？",
    options: [
      { label: "心臓がどきどきして頭が真っ白になる", body: "sympathetic" },
      { label: "体が固まって動けなくなる", body: "freeze" },
      { label: "喉が詰まって言葉が出なくなる", body: "freeze" },
      { label: "体が小さく縮んでいく感じがする", body: "shutdown" },
    ],
  },
  {
    id: 10,
    category: "body",
    text: "「安心」を体で感じることがありますか？",
    options: [
      { label: "ある、特定の場所や状況で", body: "safe" },
      { label: "一人のときだけ", body: "sympathetic" },
      { label: "あまり記憶にない", body: "shutdown" },
      { label: "安心が何かよくわからない", body: "shutdown", spiritual: true },
    ],
  },
];

const CURSE_TYPES = {
  "self_sacrifice+sympathetic": {
    name: "与え続けて燃え尽きる呪い",
    psych: "あなたは誰かのために全力を尽くすことで、自分の存在意義を確認してきました。与えることが「愛の証明」になっていた。しかし、与えるほどに見返りのなさが積み重なり、あなたの中で静かに何かが燃え尽きていきます。",
    body: "その疲れは心だけではなく、体にも刻まれています。常に張り詰めた肩、浅い呼吸——それは戦い続けてきた体の記憶です。",
    route: "session",
  },
  "abandonment+sympathetic": {
    name: "近づくほど怖くなる呪い",
    psych: "誰かが近くにいるとき、あなたの中にはいつも「いつか離れていく」という予感があります。だから先に距離を置く。だから本当のことを言えない。これは予知能力ではなく、過去の経験があなたの中に刻んだ防衛反応です。",
    body: "体はそれを正直に表現しています。誰かといるときの緊張、一人になったときにやっと息ができる感覚——これはあなたの体が、まだその頃を生きているサインです。",
    route: "session",
  },
  "mistrust+freeze": {
    name: "心を閉じることで生き延びた呪い",
    psych: "かつて、心を開いたことで傷ついた経験があります。だから今、あなたは無意識に心の扉を閉めることを覚えました。これは弱さではありません。それがあなたを守る唯一の方法だった時期があったのです。",
    body: "体が固まる感覚、言葉が出てこない感覚——これは体が今も「危険」を感じているサインです。頭ではわかっていても、体が先に反応してしまう。その理由があります。",
    route: "session",
  },
  "submission+shutdown": {
    name: "自分を消すことを覚えた呪い",
    psych: "あなたはいつの頃からか、自分の気持ちや意見を後回しにすることを覚えました。それは衝突を避けるため、誰かを守るため、あるいは自分が安全でいるため。自分を消すことが、あなたの生存戦略になっていた。",
    body: "体の感覚が薄い、何もしたくなくなる——これはシャットダウンの状態です。体が感じることをやめることで、あなたを守ってきたのです。",
    route: "session",
  },
  "deprivation+shutdown": {
    name: "愛の感触を知らずに育った呪い",
    psych: "「愛されている」という感覚が、あなたにはよくわかりません。それは愛を受け取る感度が壊れているのではなく、そもそもその感触を十分に知る機会がなかったから。あなたの心は、愛の形を探し続けています。",
    body: "安心が何かわからない——この感覚は、体が「安全」を一度も完全には学べなかったことを示しています。これはエネルギー的な影響も絡んでいることがあります。",
    route: "spiritual",
  },
  "deprivation+freeze": {
    name: "なぜかわからない重さを抱えた呪い",
    psych: "自分でも説明できない重さがあります。理由がわからないから余計につらい。過去の出来事だけでは説明がつかないこの感覚には、心理的な原因以外の何かが絡んでいることがあります。",
    body: "体が固まる、凍りつく感覚——これは単なるストレス反応では説明しきれない場合があります。エネルギー的な影響が体に現れていることがあります。",
    route: "spiritual",
  },
};

function determineCurseType(answers) {
  const schemaCounts = {};
  const bodyCounts = {};
  let spiritualFlag = false;

  answers.forEach((ans) => {
    if (!ans) return;
    if (ans.schema) schemaCounts[ans.schema] = (schemaCounts[ans.schema] || 0) + 1;
    if (ans.body) bodyCounts[ans.body] = (bodyCounts[ans.body] || 0) + 1;
    if (ans.spiritual) spiritualFlag = true;
  });

  const topSchema = Object.entries(schemaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "self_sacrifice";
  const topBody = Object.entries(bodyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "sympathetic";

  const key = `${topSchema}+${topBody}`;
  const curse = CURSE_TYPES[key] || CURSE_TYPES["self_sacrifice+sympathetic"];

  if (spiritualFlag && (topBody === "shutdown" || topBody === "freeze")) {
    return { ...CURSE_TYPES["deprivation+shutdown"], spiritualFlag: true };
  }

  return { ...curse, spiritualFlag };
}

async function generatePersonalMessage(freeText, curseName) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), 15000)
  );

  const fetchPromise = fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ freeText, curseName }),
  }).then(async (res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (!data.message) throw new Error("no message");
    return data.message;
  });

  try {
    return await Promise.race([fetchPromise, timeout]);
  } catch (e) {
    return "今夜あなたが書いた言葉は、ここに届きました。満月はすべてを受け取っています。";
  }
}

const MoonIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="28" stroke="#C8A96E" strokeWidth="1" opacity="0.4" />
    <circle cx="30" cy="30" r="22" fill="#0a0a12" />
    <path d="M30 8 C18 8 8 18 8 30 C8 42 18 52 30 52 C20 48 14 40 14 30 C14 20 20 12 30 8Z" fill="#C8A96E" opacity="0.9" />
    <circle cx="30" cy="30" r="28" stroke="#C8A96E" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
  </svg>
);

const StarField = () => {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 3,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#C8A96E",
            opacity: 0.4,
            animation: `twinkle 3s ${s.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle { from { opacity: 0.1; } to { opacity: 0.6; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { from { opacity: 0.5; transform: scale(1); } to { opacity: 1; transform: scale(1.03); } }
        @keyframes moonrise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { from { opacity: 0.3; } to { opacity: 0.8; } }
      `}</style>
    </div>
  );
};

export default function App() {
  const [phase, setPhase] = useState("intro"); // intro | questions | loading | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [freeText, setFreeText] = useState("");
  const [curse, setCurse] = useState(null);
  const [personalMessage, setPersonalMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [animating, setAnimating] = useState(false);

  const baseStyle = {
    fontFamily: "'Georgia', 'Noto Serif JP', serif",
    background: "linear-gradient(135deg, #05050f 0%, #0a0a1a 50%, #07071a 100%)",
    minHeight: "100vh",
    color: "#e8e0d0",
    position: "relative",
    overflow: "hidden",
  };

  const containerStyle = {
    maxWidth: 520,
    margin: "0 auto",
    padding: "40px 24px",
    position: "relative",
    zIndex: 1,
    animation: "fadeIn 0.8s ease forwards",
  };

  const goldColor = "#C8A96E";
  const dimGold = "#8a6e42";

  const handleStart = () => {
    setAnimating(true);
    setTimeout(() => { setPhase("questions"); setAnimating(false); }, 400);
  };

  const handleAnswer = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQ] = option;
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      }
    }, 600);
  };

  const handleSubmit = async () => {
    if (!freeText.trim()) return;
    setPhase("loading");
    const curseResult = determineCurseType(answers);
    setCurse(curseResult);
    let msg = "今夜あなたが書いた言葉は、ここに届きました。満月はすべてを受け取っています。";
    try {
      const result = await generatePersonalMessage(freeText, curseResult.name);
      if (result) msg = result;
    } catch (e) {
      console.error(e);
    } finally {
      setPersonalMessage(msg);
      setPhase("result");
    }
  };

  const question = QUESTIONS[currentQ];
  const isLastQuestion = currentQ === QUESTIONS.length - 1;
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  return (
    <div style={baseStyle}>
      <StarField />

      {/* Glow */}
      <div style={{
        position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={containerStyle}>

        {/* INTRO */}
        {phase === "intro" && (
          <div style={{ textAlign: "center", animation: "moonrise 1.2s ease forwards" }}>
            <div style={{ marginBottom: 32 }}>
              <MoonIcon />
            </div>

            <p style={{ color: dimGold, fontSize: 11, letterSpacing: "0.3em", marginBottom: 16, textTransform: "uppercase" }}>
              天秤座満月の夜
            </p>

            <h1 style={{
              fontSize: 26, fontWeight: "normal", lineHeight: 1.6,
              color: "#e8e0d0", marginBottom: 8, letterSpacing: "0.05em",
            }}>
              あなたの人間関係に<br />
              <span style={{ color: goldColor }}>宿った呪い</span>を<br />
              あぶり出す
            </h1>

            <div style={{ width: 40, height: 1, background: goldColor, margin: "24px auto", opacity: 0.5 }} />

            <p style={{ fontSize: 14, lineHeight: 2, color: "#a09888", marginBottom: 12 }}>
              天秤座は、関係性とバランスを司る星座。<br />
              満月の夜、隠れていたものが光の中に浮かび上がります。
            </p>
            <p style={{ fontSize: 13, lineHeight: 2, color: "#7a7268", marginBottom: 40 }}>
              10の問いに、正直に答えてください。<br />
              所要時間は約3分です。
            </p>

            <button
              onClick={handleStart}
              style={{
                background: "transparent",
                border: `1px solid ${goldColor}`,
                color: goldColor,
                padding: "14px 48px",
                fontSize: 14,
                letterSpacing: "0.15em",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => { e.target.style.background = "rgba(200,169,110,0.1)"; }}
              onMouseOut={(e) => { e.target.style.background = "transparent"; }}
            >
              はじめる
            </button>
          </div>
        )}

        {/* QUESTIONS */}
        {phase === "questions" && question && (
          <div style={{ animation: "fadeIn 0.5s ease forwards" }}>
            {/* Progress */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: dimGold, letterSpacing: "0.2em" }}>
                  {question.category === "psych" ? "心理の層" : "身体の層"}
                </span>
                <span style={{ fontSize: 11, color: dimGold }}>
                  {currentQ + 1} / {QUESTIONS.length}
                </span>
              </div>
              <div style={{ height: 1, background: "rgba(200,169,110,0.15)", borderRadius: 1 }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: `linear-gradient(90deg, ${dimGold}, ${goldColor})`,
                  borderRadius: 1, transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            {/* Question */}
            <p style={{
              fontSize: 17, lineHeight: 1.9, marginBottom: 36,
              color: "#e8e0d0", letterSpacing: "0.03em",
            }}>
              {question.text}
            </p>

            {/* Last question: free text */}
            {isLastQuestion ? (
              <div>
                <p style={{ fontSize: 12, color: dimGold, marginBottom: 16, letterSpacing: "0.1em" }}>
                  今夜だけ、誰にも言えない本音を一言だけ書いてください
                </p>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="ここに書いてください..."
                  style={{
                    width: "100%", minHeight: 100, background: "rgba(200,169,110,0.05)",
                    border: `1px solid rgba(200,169,110,0.25)`, color: "#e8e0d0",
                    padding: "16px", fontSize: 14, lineHeight: 1.8,
                    fontFamily: "inherit", resize: "vertical", outline: "none",
                    borderRadius: 2, boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!freeText.trim()}
                  style={{
                    marginTop: 24, width: "100%",
                    background: freeText.trim() ? "rgba(200,169,110,0.12)" : "transparent",
                    border: `1px solid ${freeText.trim() ? goldColor : "rgba(200,169,110,0.2)"}`,
                    color: freeText.trim() ? goldColor : "rgba(200,169,110,0.3)",
                    padding: "14px", fontSize: 14, letterSpacing: "0.15em",
                    cursor: freeText.trim() ? "pointer" : "not-allowed",
                    fontFamily: "inherit", transition: "all 0.3s",
                  }}
                >
                  結果を見る
                </button>
              </div>
            ) : (
              /* Options */
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {question.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      style={{
                        textAlign: "left", padding: "16px 20px",
                        background: isSelected ? "rgba(200,169,110,0.12)" : "rgba(200,169,110,0.04)",
                        border: `1px solid ${isSelected ? goldColor : "rgba(200,169,110,0.2)"}`,
                        color: isSelected ? goldColor : "#c0b8a8",
                        fontSize: 14, lineHeight: 1.7, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.25s", borderRadius: 2,
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = "rgba(200,169,110,0.5)";
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = "rgba(200,169,110,0.2)";
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* LOADING */}
        {phase === "loading" && (
          <div style={{ textAlign: "center", paddingTop: 80, animation: "fadeIn 0.8s ease forwards" }}>
            <MoonIcon />
            <p style={{ color: dimGold, fontSize: 13, letterSpacing: "0.2em", marginTop: 32, animation: "pulse 2s infinite alternate" }}>
              満月があなたの答えを読んでいます
            </p>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && curse && (
          <div style={{ animation: "fadeIn 0.8s ease forwards" }}>

            {/* Layer 1: Curse name */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ marginBottom: 20 }}>
                <MoonIcon />
              </div>
              <p style={{ color: dimGold, fontSize: 11, letterSpacing: "0.3em", marginBottom: 16 }}>
                あなたに宿った呪い
              </p>
              <h2 style={{
                fontSize: 22, fontWeight: "normal", color: goldColor,
                lineHeight: 1.6, letterSpacing: "0.06em",
              }}>
                「{curse.name}」
              </h2>
              <div style={{ width: 40, height: 1, background: goldColor, margin: "24px auto", opacity: 0.4 }} />
            </div>

            {/* Layer 2: Origin */}
            <div style={{ marginBottom: 36, padding: "24px", border: "1px solid rgba(200,169,110,0.15)", borderRadius: 2 }}>
              <p style={{ fontSize: 11, color: dimGold, letterSpacing: "0.2em", marginBottom: 16 }}>
                呪いの起源
              </p>
              <p style={{ fontSize: 14, lineHeight: 2, color: "#c0b8a8" }}>
                {curse.psych}
              </p>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(200,169,110,0.1)" }}>
                <p style={{ fontSize: 13, lineHeight: 1.9, color: "#a09080", fontStyle: "italic" }}>
                  これはあなたが弱いから生まれたのではありません。かつてその環境の中で、それが唯一の安全な生き方だったのです。あなたの心は、あなたを守るために、その選択をしました。
                </p>
              </div>
            </div>

            {/* Layer 3: Body */}
            <div style={{ marginBottom: 36, padding: "24px", border: "1px solid rgba(200,169,110,0.1)", borderRadius: 2 }}>
              <p style={{ fontSize: 11, color: dimGold, letterSpacing: "0.2em", marginBottom: 16 }}>
                体が今も覚えていること
              </p>
              <p style={{ fontSize: 14, lineHeight: 2, color: "#c0b8a8" }}>
                {curse.body}
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.9, color: "#a09080", marginTop: 16, fontStyle: "italic" }}>
                体が感じる重さや緊張は、弱さではありません。体が今もあなたを守ろうとしているサインです。
              </p>
            </div>

            {/* Layer 4: Personal message */}
            <div style={{
              marginBottom: 48, padding: "28px",
              background: "linear-gradient(135deg, rgba(200,169,110,0.06), rgba(200,169,110,0.02))",
              border: `1px solid rgba(200,169,110,0.25)`, borderRadius: 2,
            }}>
              <p style={{ fontSize: 11, color: goldColor, letterSpacing: "0.2em", marginBottom: 20 }}>
                今夜のあなたへ
              </p>
              <p style={{ fontSize: 15, lineHeight: 2.2, color: "#e8e0d0", fontStyle: "italic" }}>
                {personalMessage}
              </p>
            </div>

            {/* Backend route */}
            <div style={{ borderTop: "1px solid rgba(200,169,110,0.15)", paddingTop: 36 }}>
              {curse.route === "session" ? (
                <div>
                  <p style={{ fontSize: 13, lineHeight: 2.2, color: "#a09080", marginBottom: 24 }}>
                    この呪いは、一人で考え続けても解けないことがあります。<br />
                    言葉にできる場所があると、少し楽になることがあります。<br />
                    気が向いたら、こちらをのぞいてみてください。
                  </p>
                  <a
                    href="#"
                    style={{
                      display: "block", textAlign: "center",
                      padding: "14px", border: `1px solid ${goldColor}`,
                      color: goldColor, fontSize: 13, letterSpacing: "0.15em",
                      textDecoration: "none", transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.1)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    個別セッションについて
                  </a>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, lineHeight: 2.2, color: "#a09080", marginBottom: 24 }}>
                    人間関係の苦しさの中には、心理的な原因だけでは<br />
                    説明しきれないものがあります。<br />
                    エネルギーや霊的な影響が絡んでいることも、実際にあります。<br />
                    ピンときた方だけ、見てみてください。
                  </p>
                  <a
                    href="#"
                    style={{
                      display: "block", textAlign: "center",
                      padding: "14px", border: `1px solid ${goldColor}`,
                      color: goldColor, fontSize: 13, letterSpacing: "0.15em",
                      textDecoration: "none", transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.1)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    スピリチュアル講座について
                  </a>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
