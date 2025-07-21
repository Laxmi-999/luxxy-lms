import cron from 'node-cron';
import Borrow from '../models/borrow.js';
import Notification from '../models/Notification.js';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const VOICE_NOTES_DIR = path.join(__dirname, '../../public/voice_notes');

if (!fs.existsSync(VOICE_NOTES_DIR)) {
  fs.mkdirSync(VOICE_NOTES_DIR, { recursive: true });
  console.log(`[DEBUG] Created voice notes directory: ${VOICE_NOTES_DIR}`);
}

async function generateVoiceNote(text, userId) {
  console.log(`[DEBUG] generateVoiceNote called for user ${userId}. Text length: ${text.length}`);
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("[ERROR] ElevenLabs API Key is not set. Cannot generate voice note.");
    return null;
  }
  try {
    const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; 
    const modelId = 'eleven_multilingual_v2';

    console.log(`[DEBUG] Calling ElevenLabs API with voiceId: ${voiceId}, modelId: ${modelId}`);
    const audioStream = await elevenlabs.textToSpeech.convert(
      voiceId,
      {
        text: text,
        model_id: modelId,
        output_format: 'mp3_44100_128',
      }
    );
    console.log(`[DEBUG] Received audio stream from ElevenLabs.`);

    const filename = `overdue_${userId}_${Date.now()}.mp3`;
    const filepath = path.join(VOICE_NOTES_DIR, filename);

    const writeStream = fs.createWriteStream(filepath);
    const audioBuffer = await new Response(audioStream).arrayBuffer();
    writeStream.write(Buffer.from(audioBuffer));
    writeStream.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log(`[DEBUG] Voice note file saved successfully: ${filepath}`);
        resolve(`/voice_notes/${filename}`);
      });
      writeStream.on('error', (err) => {
        console.error(`[ERROR] Error writing voice note file ${filepath}:`, err);
        reject(err);
      });
    });

  } catch (error) {
    console.error('[ERROR] Error in generateVoiceNote:', error);
    if (error.response && error.response.data) {
        console.error('ElevenLabs API Error Details:', error.response.data);
    }
    return null;
  }
}

cron.schedule('0 2 1 * *', async () => { // TEMPORARY: Runs once in a month for  production, 
  // cron.schedule('0 2 1 * *', async () => { // TEMPORARY: Runs every minutes for testing, 

  console.log('--- Running overdue book check job ---');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(`[DEBUG] Current date (for dueDate comparison): ${today.toISOString()}`);

  try {
    console.log('[DEBUG] Attempting to find overdue borrows...');
    const overdueBorrows = await Borrow.find({
      status: 'approved',
      dueDate: { $lt: today }
    }).populate('user').populate('book');

    console.log(`[DEBUG] Found ${overdueBorrows.length} overdue borrows matching criteria.`);

    if (overdueBorrows.length === 0) {
      console.log('[INFO] No overdue books found. Job finished.');
      return;
    }

    for (const borrow of overdueBorrows) {
      console.log(`[DEBUG] Processing borrow for book: "${borrow.book?.title}" (ID: ${borrow.book?._id}) by user: "${borrow.user?.name}" (ID: ${borrow.user?._id})`);
      console.log(`[DEBUG] Borrow status: ${borrow.status}, Due Date: ${borrow.dueDate?.toISOString()}`);

      // TEMPORARILY COMMENT OUT OR MODIFY THIS BLOCK FOR TESTING
      // const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      // console.log(`[DEBUG] Checking for existing notifications since: ${twentyFourHoursAgo.toISOString()}`);

      // const existingNotification = await Notification.findOne({
      //   user: borrow.user._id,
      //   type: 'overdue-voice-note',
      //   message: { $regex: new RegExp(borrow.book.title, 'i') },
      //   createdAt: {
      //     $gte: twentyFourHoursAgo
      //   }
      // });

      // if (existingNotification) {
      //   console.log(`[INFO] Skipping notification for ${borrow.book?.title} to ${borrow.user?.email} (already notified recently). Notification ID: ${existingNotification._id}`);
      //   continue;
      // }
      // END TEMPORARY MODIFICATION

      console.log(`[DEBUG] No recent notification found for ${borrow.book?.title}. Proceeding to generate.`);
      const message = `Dear ${borrow.user?.name}, this is an important reminder from the Library Management System. Your borrowed book titled "${borrow.book?.title}" was due on ${new Date(borrow.dueDate).toLocaleDateString()}. Please return it as soon as possible to avoid further fines. Thank you.`;
      console.log(`[DEBUG] Generated message: "${message}"`);

      const audioUrl = await generateVoiceNote(message, borrow.user._id);

      if (audioUrl) {
        console.log('[DEBUG] Audio URL generated. Creating notification in DB...');
        await Notification.create({
          user: borrow.user._id,
          type: 'overdue-voice-note',
          message: message,
          audioUrl: audioUrl,
          isRead: false
        });
        console.log(`[SUCCESS] Overdue voice note notification created for ${borrow.user?.email} regarding "${borrow.book?.title}".`);
      } else {
        console.warn(`[WARNING] Failed to generate audio for ${borrow.user?.email} regarding "${borrow.book?.title}". Creating text notification only.`);
        await Notification.create({
          user: borrow.user._id,
          type: 'overdue-voice-note',
          message: message,
          isRead: false
        });
        console.log(`[SUCCESS] Text-only overdue notification created for ${borrow.user?.email} regarding "${borrow.book?.title}".`);
      }
    }
    console.log('--- Overdue book check job finished ---');
  } catch (error) {
    console.error('[CRITICAL ERROR] Error in overdue book check job:', error);
  }
});

console.log('Overdue book check job scheduled.');
