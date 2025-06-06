const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  name: "ba",
  description: "Get a random BA image.",
  author: "Your Name",
  nonPrefix: false, // Requires prefix (e.g., /ba)
  cooldown: 3,
  commandCategory: "image",

  async run({ api, event }) {
    const { threadID, messageID } = event;
    const tempImagePath = path.join(__dirname, "../temp/ba_image.jpg");

    try {
      // Step 1: Fetch JSON data from API
      const apiResponse = await axios.get("https://haji-mix-api.gleeze.com/api/ba", {
        responseType: "json"
      });

      let imageUrl = apiResponse.data?.url || apiResponse.data?.image || apiResponse.data?.result;

      // If no image URL in JSON, fallback to direct image stream
      let imageStream;
      if (imageUrl) {
        const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
        imageStream = imageResponse.data;
      } else {
        const fallbackImage = await axios.get("https://haji-mix-api.gleeze.com/api/ba", { responseType: "stream" });
        imageStream = fallbackImage.data;
      }

      // Step 2: Save to temp file
      const writer = fs.createWriteStream(tempImagePath);
      imageStream.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Step 3: Send the image
      const message = `════『 𝗕𝗔 』════\n\n✨ Here's your BA image! ✨\n\n> Thank you for using our Cid Kagenou bot`;

      await api.sendMessage({
        body: message,
        attachment: fs.createReadStream(tempImagePath)
      }, threadID, () => fs.unlinkSync(tempImagePath), messageID);

    } catch (err) {
      console.error("❌ Error in ba command:", err.message);

      const errorMsg = `════『 𝗕𝗔 』════\n\n` +
        `  ┏━━━━━━━┓\n` +
        `  ┃ 『 𝗜𝗡𝗙𝗢 』 An error occurred while fetching the image.\n` +
        `  ┃ ${err.message}\n` +
        `  ┗━━━━━━━┛\n\n` +
        `> Thank you for using our Cid Kagenou bot`;

      api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
