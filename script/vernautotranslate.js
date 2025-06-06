module.exports.config = {
  name: "vernautotranslate",
  version: "1.0.0",
  credits: "vern",
  description: "Toggle auto-translation of messages ON or OFF in this thread.",
  commandCategory: "Automation",
  usages: "<on/off>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  if (!args.length) return api.sendMessage("Please specify `on` or `off`.", event.threadID);
  const mode = args[0].toLowerCase();
  if (mode !== "on" && mode !== "off") return api.sendMessage("Invalid option. Use `on` or `off`.", event.threadID);

  const threadID = event.threadID;
  const data = global.data.threadData.get(threadID) || {};
  data.autoTranslate = (mode === "on");
  global.data.threadData.set(threadID, data);

  return api.sendMessage(`✅ Auto-translate is now ${mode.toUpperCase()}!`, threadID);
};
