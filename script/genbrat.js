const axios = require('axios');

module.exports.config = {
  name: "genbrat",
  version: "1.0.0",
  role: 0,
  credits: "vern",
  description: "Generate a BRAT (stylized) image with your text using the Zetsu API.",
  usage: "/genbrat <your text>",
  prefix: true,
  cooldowns: 3,
  commandCategory: "Fun"
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const text = args.join(' ').trim();
  const prefix = "/"; // Change if your bot uses a dynamic prefix

  if (!text) {
    const usageMessage = `════『 𝗚𝗘𝗡 𝗕𝗥𝗔𝗧 』════\n\n` +
      `⚠️ Please provide text to generate a BRAT image.\n\n` +
      `📌 Usage: ${prefix}genbrat <your text>\n` +
      `💬 Example: ${prefix}genbrat hello world\n\n` +
      `> Powered by Zetsu BRAT Generator`;
    return api.sendMessage(usageMessage, threadID, messageID);
  }

  try {
    // Send loading message first
    const waitMsg = `════『 𝗚𝗘𝗡 𝗕𝗥𝗔𝗧 』════\n\n` +
      `🎨 Generating BRAT image for: "${text}"\nPlease wait a moment.`;
    await api.sendMessage(waitMsg, threadID, messageID);

    // Call the Zetsu Gen BRAT API
    const apiUrl = "https://api.zetsu.xyz/gen/brat";
    const response = await axios.get(apiUrl, {
      params: {
        text: text
      }
    });

    let imageUrl = "";
    if (response.data) {
      if (typeof response.data === "string" && response.data.startsWith("http")) {
        imageUrl = response.data;
      } else if (response.data.url) {
        imageUrl = response.data.url;
      } else if (response.data.result) {
        imageUrl = response.data.result;
      }
    }

    if (!imageUrl) {
      return api.sendMessage(
        `⚠️ Unable to generate BRAT image.`, threadID, messageID
      );
    }

    // Send the image as an attachment
    const imageRes = await axios.get(imageUrl, { responseType: "stream" });

    return api.sendMessage({
      body: `════『 𝗚𝗘𝗡 𝗕𝗥𝗔𝗧 』════\n\nHere's your stylized BRAT image!\n\n> Powered by Zetsu`,
      attachment: imageRes.data
    }, threadID, messageID);

  } catch (error) {
    console.error('❌ Error in genbrat command:', error.message || error);

    const errorMessage = `════『 𝗚𝗘𝗡 𝗕𝗥𝗔𝗧 𝗘𝗥𝗥𝗢𝗥 』════\n\n` +
      `🚫 Failed to generate BRAT image.\nReason: ${error.response?.data?.message || error.message || 'Unknown error'}\n\n` +
      `> Please try again later.`;

    return api.sendMessage(errorMessage, threadID, messageID);
  }
};