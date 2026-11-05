import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse port and host. In this environment, Nginx binds to 8080 and proxies to 3000.
// Express must always bind to port 3000 (never 8080).
const parsePort = (): number => {
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    return parseInt(process.argv[portArgIdx + 1], 10);
  }
  if (process.env.PORT && process.env.PORT !== '8080') {
    return parseInt(process.env.PORT, 10);
  }
  return 3000;
};

const port = parsePort();
const host = '0.0.0.0';

app.use(express.json());

// Initialize Gemini Client via @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ------------------ AI TUTOR CHAT API ROUTE ------------------
app.post('/api/tutor', async (req, res) => {
  try {
    const { message, history, studentContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If GEMINI_API_KEY is not configured yet, provide immediate friendly educational response
    if (!process.env.GEMINI_API_KEY) {
      const lower = message.toLowerCase();
      let reply = 'สวัสดีครับน้องๆ! ครูพี่โค้ดดิ้งพร้อมช่วยตอบคำถามเสมอนะครับ 🤖✨\n\n';
      if (lower.includes('pdpa') || lower.includes('ความปลอดภัย') || lower.includes('รหัสผ่าน') || lower.includes('ส่วนตัว')) {
        reply += '🛡️ **คำแนะนำเรื่องความปลอดภัยไซเบอร์ & PDPA:**\n- ข้อมูลส่วนบุคคลทั่วไป เช่น ชื่อเล่น กิจกรรมที่ชอบ สามารถแลกเปลี่ยนเรียนรู้ได้\n- ข้อมูลอ่อนไหวที่ห้ามแชร์สู่สาธารณะเด็ดขาด: เลขบัตรประชาชน 13 หลัก, วันเดือนปีเกิด, รหัสผ่าน, และรหัส OTP\n- การตั้งรหัสผ่านที่ดีควรใช้หลัก Passphrase ผสมตัวเลขและสัญลักษณ์ เช่น `CoderKid@2026!`';
      } else if (lower.includes('scratch') || lower.includes('บล็อก') || lower.includes('เด้ง') || lower.includes('ชน')) {
        reply += '🐱 **เทคนิคการเขียนบล็อกคำสั่ง Scratch:**\n1. ใช้บล็อก `when green flag clicked` เพื่อเริ่มต้นการทำงาน\n2. ลากบล็อก `forever` วนซ้ำตลอดเวลา แล้วใส่ `move (10) steps`\n3. เพิ่มบล็อก `if on edge, bounce` เพื่อให้ตัวละครเด้งกลับเมื่อชนขอบจอแคนวาส\n4. ตรวจจับการชน: ใช้บล็อก `if <touching [obstacle v]?> then` เพื่อลดพลังหรือเริ่มใหม่!';
      } else if (lower.includes('micro:bit') || lower.includes('microbit') || lower.includes('อุณหภูมิ') || lower.includes('บอร์ด')) {
        reply += '📟 **การเขียนโค้ดกับบอร์ด Micro:bit V2 เสมือน:**\n1. ตรวจจับอุณหภูมิ: ดึงบล็อก `temperature (°C)` จากหมวด Input\n2. ตรวจสอบเงื่อนไข: ใช้บล็อก `if <temperature > 30> then`\n3. แสดงผลหน้าจอ LED Matrix 5x5: ใช้บล็อก `show icon [Surprised v]` หรือ `show string "HOT"`\n4. สามารถเปิดทดลองจริงใน **โมดูล 3: ปฏิบัติการ Scratch & Micro:bit** ได้เลยครับ!';
      } else if (lower.includes('โครงงาน') || lower.includes('ไอเดีย') || lower.includes('สิ่งประดิษฐ์') || lower.includes('แนะนำ')) {
        reply += '💡 **3 ไอเดียโครงงานวิทยาการคำนวณยอดนิยมสำหรับน้องๆ ป.4 - ป.6:**\n1. **ระบบแจ้งเตือนน้ำท่วมในชุมชน (Flood Alert IoT):** ใช้ Micro:bit ตรวจวัดระดับน้ำและส่งเสียงเตือนผ่าน Buzzer\n2. **เกมเขาวงกตแยกขยะรักษ์โลก:** เขียนด้วย Scratch ให้ตัวละครเก็บขยะแยกประเภทลงถังขยะถูกต้อง\n3. **เครื่องวัดอุณหภูมิห้องเรียนประหยัดพลังงาน:** ถ้าอุณหภูมิสูงกว่า 27 องศาให้แสดงเตือนเปิดพัดลมระบายอากาศ!';
      } else {
        reply += 'น้องๆ สามารถถามคำถามได้ทั้งเรื่องกฎหมาย PDPA, 4 เสาหลักการคิดเชิงคำนวณ, ผังงาน Flowchart, บล็อกคำสั่ง Scratch และบอร์ดทดลอง Micro:bit เลยครับ! ลองเลือกหัวข้อคำถามแนะนำด้านล่างได้เลยนะครับ 💡🚀';
      }
      return res.json({ reply });
    }

    const systemInstruction = `คุณคือ "ครูพี่โค้ดดิ้ง (Coder Kids AI Tutor)" ผู้ช่วยสอนและที่ปรึกษาโครงงานวิชาวิทยาการคำนวณและเทคโนโลยี (มาตรฐานหลักสูตรแกนกลาง สพฐ. และ สสวท.) สำหรับนักเรียนชั้นประถมศึกษา (ป.4 - ป.6) และมัธยมศึกษาตอนต้น

บทบาทและลักษณะการตอบ:
1. บุคลิกภาพ: อบอุ่น ใจดี เป็นมิตร สนุกสนาน ให้กำลังใจ อธิบายเข้าใจง่าย ใช้ภาษาเหมาะกับเด็กๆ แทนตัวเองว่า "ครูพี่โค้ดดิ้ง" หรือ "ครูพี่โค้ด" และเรียกผู้เรียนอย่างน่ารัก เช่น "น้องๆ", "น้องคนเก่ง" หรือชื่อเล่นผู้เรียน
2. ความรู้ใน 4 โมดูลหลักสูตร Coder Kids:
   - โมดูล 1: ความปลอดภัยดิจิทัล & กฎหมาย PDPA (ข้อมูลส่วนบุคคลทั่วไป vs ข้อมูลอ่อนไหว, การสร้างรหัสผ่าน Passphrase แข็งแกร่ง, มารยาทไซเบอร์ Netiquette, การรู้เท่าทัน Phishing)
   - โมดูล 2: การคิดเชิงคำนวณ & อัลกอริทึม (4 เสาหลัก CT: Decomposition, Pattern Recognition, Abstraction, Algorithm Design, ผังงาน Flowchart, โครงสร้างควบคุมลำดับ เงื่อนไข If-Else และการวนซ้ำ Loops)
   - โมดูล 3: ปฏิบัติการ Scratch & Micro:bit (บล็อกคำสั่ง Motion, Looks, Events, Control, Variables, บอร์ด Micro:bit V2 LED Matrix 5x5, เซ็นเซอร์แสง, อุณหภูมิ, เข็มทิศ, ปุ่ม A/B)
   - โมดูล 4: แสดงผลงานและสะท้อนคิด (การนำเสนอโครงงาน, แนบลิงก์, รีวิวเพื่อน 2 Stars & A Wish, บันทึกการเรียนรู้ประจำวัน Daily Journal, เกียรติบัตร)
3. สไตล์การสอน (Scaffolding & Socratic Method):
   - หากนักเรียนถามวิธีทำโครงงานหรือโค้ด ให้ชวนคิดและแนะนำแนวทางเป็นขั้นๆ (Step-by-step) ไม่เขียนคำตอบยาวรวดเดียวจนเด็กไม่อ่าน
   - ยกตัวอย่างบล็อกคำสั่ง Scratch หรือคำสั่ง Micro:bit MakeCode ที่เกี่ยวข้องอย่างชัดเจน
   - ถ้าถามเรื่องความปลอดภัย ให้ชี้แนะข้อควรระวังตามหลัก PDPA
4. ใช้อิโมจิน่ารัก เช่น 🐱 💻 🛡️ 🧩 🚀 💡 ✨ 🤖 เพื่อสร้างบรรยากาศสนุกสนาน
5. ตอบภาษาไทยเป็นหลัก พร้อมคำศัพท์คอมพิวเตอร์ภาษาอังกฤษควบคู่
${studentContext ? `\nข้อมูลบริบทผู้เรียนปัจจุบัน: ชื่อ: ${studentContext.name || 'ผู้เรียน'}, ระดับชั้น: ${studentContext.grade || 'ป.4-ป.6'}, แต้มสะสม: ${studentContext.points || 0} แต้ม, โมดูลที่กำลังเรียน: ${studentContext.activeModule || 'Dashboard'}` : ''}`;

    // Format chat history for Gemini API
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-10)) {
        if (item && (item.role === 'user' || item.role === 'model') && item.text) {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 8000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const reply = response.text || 'ขออภัยครับ ครูพี่โค้ดดิ้งกำลังประมวลผล ลองถามใหม่อีกครั้งนะครับ! 🤖';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini Tutor Error:', error);
    const msg = (req.body?.message || '').toLowerCase();
    let fallback = 'สวัสดีครับน้องๆ! ครูพี่โค้ดดิ้งยินดีให้คำแนะนำนะครับ 🤖✨\n\n';

    if (msg.includes('pdpa') || msg.includes('ความปลอดภัย') || msg.includes('รหัสผ่าน') || msg.includes('ส่วนตัว')) {
      fallback += '🛡️ **คำแนะนำเรื่องความปลอดภัยไซเบอร์ & PDPA:**\n- ข้อมูลที่ห้ามแชร์เด็ดขาด: เลขบัตรประชาชน 13 หลัก, วันเดือนปีเกิด, รหัสผ่าน, และรหัส OTP\n- ข้อมูลที่เปิดเผยได้ทั่วไป: ชื่อเล่น, ความสนใจในวิชาโค้ดดิ้ง, ผลงานที่สร้างขึ้นเอง\n- การตั้งรหัสผ่านที่รัดกุม: ใช้คำยาวอย่างน้อย 8-12 ตัวอักษร ผสมตัวพิมพ์ใหญ่ ตัวเลข และสัญลักษณ์พิเศษครับ';
    } else if (msg.includes('scratch') || msg.includes('บล็อก') || msg.includes('เดิน') || msg.includes('เด้ง')) {
      fallback += '🐱 **เทคนิคการเขียนบล็อกคำสั่ง Scratch:**\n1. เริ่มด้วยบล็อก `when green flag clicked`\n2. ใช้บล็อก `forever` แล้วใส่ `move (10) steps`\n3. เพิ่มบล็อก `if on edge, bounce` ให้ตัวละครเด้งกลับเมื่อถึงขอบจอ\n4. ตรวจจับการชน: `if <touching [obstacle v]?> then` เพื่อลดพลังชีวิตหรือส่งเสียงเตือน!';
    } else if (msg.includes('micro:bit') || msg.includes('microbit') || msg.includes('อุณหภูมิ') || msg.includes('บอร์ด')) {
      fallback += '📟 **การทดลองกับบอร์ด Micro:bit V2 เสมือน:**\n1. เซ็นเซอร์อุณหภูมิ: ดึงบล็อก `temperature (°C)` ในหมวด Input\n2. โครงสร้างเงื่อนไข: ใช้บล็อก `if <temperature > 30> then`\n3. แสดงผลหน้าจอ LED Matrix: บล็อก `show icon [Surprised v]` หรือ `show string "HOT"`\n4. สามารถทดลองใน **โมดูล 3: ปฏิบัติการ Scratch & Micro:bit** บนเว็บแอปได้ทันทีครับ!';
    } else if (msg.includes('โครงงาน') || msg.includes('ไอเดีย') || msg.includes('สิ่งประดิษฐ์') || msg.includes('แนะนำ')) {
      fallback += '💡 **3 ไอเดียโครงงานวิทยาการคำนวณยอดนิยมสำหรับส่งประกวด:**\n1. **ระบบเตือนน้ำท่วมในชุมชน (Flood Alert IoT):** ใช้ Micro:bit ตรวจวัดระดับน้ำและส่งเสียงเตือนผ่าน Buzzer\n2. **เกมเขาวงกตผจญภัยรักษ์โลก:** เขียนด้วย Scratch ให้ตัวละครเก็บขยะแยกประเภทลงถังขยะถูกต้อง\n3. **เครื่องตรวจจับแสงประหยัดพลังงาน:** ถ้าห้องมืดให้เปิดไฟ LED จำลองอัตโนมัติ!';
    } else {
      fallback += 'น้องๆ สามารถปรึกษาครูพี่โค้ดดิ้งได้ทั้งเรื่อง:\n- กฎหมาย PDPA และการตั้งรหัสผ่าน 🛡️\n- 4 เสาหลักการคิดเชิงคำนวณและ Flowchart 🧩\n- บล็อกคำสั่ง Scratch และบอร์ด Micro:bit 💻\n- ไอเดียโครงงานเทคโนโลยี 💡\nลองเลือกคำถามแนะนำด้านล่างหรือพิมพ์ถามเจาะจงได้เลยครับ!';
    }

    return res.json({ reply: fallback });
  }
});

// ------------------ STATIC / VITE MIDDLEWARE ------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(port, host, () => {
    console.log(`Coder Kids Server running on http://${host}:${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
