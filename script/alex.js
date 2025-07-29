const axios = require("axios");

let fontEnabled = true;

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };
  return [...text].map(c => (fontEnabled && fontMapping[c] ? fontMapping[c] : c)).join('');
}

module.exports.config = {
  name: "alex",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  aliases: ["ai"],
  description: "✨ Interact with Aesthetic AI for dreamy, stylish responses",
  usage: "aesthetic <ask>",
  credits: "Alex", // Original command by vern
  cooldown: 3
};

module.exports.run = async function ({ api, event, args }) {
  const senderID = event.senderID;
  const threadID = event.threadID;
  const messageID = event.messageID;

  const prompt = args.join(" ").trim();

  if (!prompt) {
    return api.sendMessage(formatFont("✨ 𝘱𝘭𝘦𝘢𝘴𝘦 𝘦𝘯𝘵𝘦𝘳 𝘢 𝘴𝘱𝘢𝘳𝘬𝘭𝘪𝘯𝘨 𝘲𝘶𝘦𝘴𝘵𝘪𝘰𝘯"), threadID, messageID);
  }

  const waitMsg = await api.sendMessage(formatFont("🌙  alex 𝘪𝘴 𝘥𝘳𝘦𝘢𝘮𝘪𝘯𝘨..."), threadID);

  try {
    const { data } = await axios.get("https://markdevs-last-api-p2y6.onrender.com/bossing", {
      params: {
        prompt,
        uid: "1"
      }
    });

    const reply = data?.response || "🌫️ No whispers from alex.";

    api.getUserInfo(senderID, async (err, infoUser) => {
      const userName = infoUser?.[senderID]?.name || "Mystic Wanderer";
      const timePH = new Date(Date.now() + 8 * 60 * 60 * 1000).toLocaleString('en-US', { hour12: false });

      const fullMessage = `
🌟 alex
━━━━━━━━━━━━━━━━━━━━━━━
${reply}
━━━━━━━━━━━━━━━━━━━━━━━
🌌 𝘴𝘶𝘮𝘮𝘰𝘯𝘦𝘥 𝘣𝘺: ${userName}
🕊️ 𝘵𝘪𝘮𝘦: ${timePH}
      `.trim();

      await api.editMessage(formatFont(fullMessage), waitMsg.messageID);
    });

  } catch (error) {
    console.error("Alex AI Error:", error);
    api.editMessage(formatFont("🌫️ Failed to capture 𝘢𝘦𝘴𝘵𝘩𝘦𝘵𝘪𝘤'𝘴 essence."), waitMsg.messageID);
  }
};
