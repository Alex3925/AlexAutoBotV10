module.exports.config = {
  name: "autoreact",
  type: "event",
  eventType: "message", // This must match your framework
  version: "1.1",
  credits: "Vern", // DO NOT CHANGE
};

module.exports.run = async function ({ api, event }) {
  const { body, messageID, reply_to } = event;

  if (!body) return;

  const messageText = body.toLowerCase();

  const reactionsMap = {
    "😂": [
      "haha", "lol", "funny", "hahah", "hahaha", "masaya", "happy", "🤣",
      "natomba", "tumomba", "tomomba", "tumumba", "tomumba",
      "side eye", "awooop jumpscare", "so masaya ka?", "sana all"
    ],
    "😭": [
      "cry", "sad", "crying", "bakit ka malungkot?", "bakit ka malongkot?",
      "hindi na", "sad ka", "walang ulam", "iyak", "naiyak"
    ],
    "🥰": [
      "love", "mahal", "crush", "kilig", "iloveyou", "ily"
    ],
    "🎮": [
      "laro", "laru", "game", "gaming", "mc", "minecraft", "ml", "mlbb",
      "mobile legends", "cod", "call of duty", "rank", "gg"
    ]
  };

  for (const [reaction, keywords] of Object.entries(reactionsMap)) {
    if (keywords.some(word => messageText.includes(word))) {
      try {
        await api.setMessageReaction(reaction, messageID, null, false);
      } catch (err) {
        console.error("[AutoReact Error]:", err.message);
      }
      break;
    }
  }
};
