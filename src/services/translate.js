import 'dotenv/config';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { SarvamAIClient } from 'sarvamai';

console.log("Starting text-to-speech conversion...");

const client = new SarvamAIClient({
  apiSubscriptionKey: "sk_sgagbu1q_f0Kd2XloMUitDgvJVc2Icvj6",
});

try {
  const response = await client.textToSpeech.convertStream({
      text: `नमस्ते! Sarvam AI में आपका स्वागत है।

हम भारतीय भाषाओं के लिए अत्याधुनिक voice technology बनाते हैं। हमारे text-to-speech models प्राकृतिक और इंसान जैसी आवाज़ें produce करते हैं, जो बेहद realistic लगती हैं।

आप अपना text type कर सकते हैं या different voices को try करने के लिए किसी भी voice card पर play button पर click कर सकते हैं। तो चलिए, अपनी भाषा में AI की ताकत experience करें!`,
      target_language_code: "hi-IN",
      speaker: "shubh",
      model: "bulbul:v3",
      pace: 1,
      speech_sample_rate: 22050,
  });

  // Extract the Web stream from the SDK response
  const webStream = response.stream();

  // Convert the Web stream to a standard Node.js stream
  const nodeStream = Readable.fromWeb(webStream);

  // Set up the destination file
  const writeStream = createWriteStream('speech.mp3');
  
  // Use pipeline to safely transfer the data and handle closing
  await pipeline(nodeStream, writeStream);

  console.log("Success! Audio saved to speech.mp3");

} catch (error) {
  console.error("Failed to generate speech:", error);
}