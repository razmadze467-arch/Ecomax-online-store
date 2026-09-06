import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 10000;
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error("OPENAI_API_KEY is not configured.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: API_KEY });

app.use(cors({
  origin: "https://ecomax.com.ge",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "20kb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ECOMAX AI", status: "online" });
});

app.post("/api/chat", limiter, async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ error: "გთხოვ დაწერე შეკითხვა." });
    }

    if (message.length > 1200) {
      return res.status(400).json({ error: "შეკითხვა ძალიან გრძელია." });
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      store: false,
      instructions: `
შენ ხარ ECOMAX AI — ავტოქიმიის ჭკვიანი ასისტენტი.
ყოველთვის უპასუხე ქართულად, მოკლედ, მეგობრულად და პროფესიონალურად.

ECOMAX პროდუქტები:
1. ძრავის ქიმწმენდა
2. დისკების საწმენდი
3. ჟანგის მოსაშორებელი
4. რადიატორის სარეცხი
5. ტორპედოს საპრიალებელი
6. ტყავის ქიმწმენდა
7. ტყავის მკვებავი
8. საბურავის საპრიალებელი
9. პლასტმასების საშავებელი
10. წებოს/სკოჩის მოსაშორებელი
11. ძლიერი ჩამჯდარი ჭუჭყის მოსაშორებელი
12. მანქანის სუნამო

ფასები:
500 მლ — 5₾
1 ლიტრი — 10₾
5 ლიტრი — 40₾

მომხმარებლის პრობლემის მიხედვით ურჩიე შესაბამისი პროდუქტი.
თუ ინფორმაცია არ არის საკმარისი, დაუსვი ერთი მოკლე დამაზუსტებელი კითხვა.
არ მოიგონო სხვა პროდუქტი ან ფასი.
ქიმიური პროდუქტის გამოყენებისას შეახსენე ეტიკეტის ინსტრუქციის დაცვა და საჭიროების შემთხვევაში მცირე შეუმჩნეველ ადგილზე გამოცდა.
შეკვეთის შემთხვევაში უთხარი, რომ შემდეგ საჭიროა შეკვეთის მონაცემების დაზუსტება.
`,
      input: message
    });

    res.json({
      reply: response.output_text || "სამწუხაროდ, პასუხი ვერ მივიღე."
    });
  } catch (error) {
    console.error("ECOMAX AI ERROR:", error);
    res.status(500).json({
      error: "ECOMAX AI დროებით მიუწვდომელია. გთხოვ მოგვიანებით სცადო."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ECOMAX AI running on port ${PORT}`);
});
