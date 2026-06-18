import config from "config";
import OpenAI from "openai";

const apiKey = config.get<string>("openai.apiKey");

if (!apiKey) {
  console.log("openai api key is missing. Set BETTERX_OPENAI_API_KEY env var");
}

const openai = new OpenAI({
  apiKey,
});

export default openai
