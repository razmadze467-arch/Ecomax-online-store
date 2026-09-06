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

const allowedOrigins = new Set([
  "https://ecomax.com.ge",
  "https://www.ecomax.com.ge"
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin not allowed"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 86400
}));

app.use(express.json({ limit: "20kb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "ძალიან ბევრი მოთხოვნაა. გთხოვ ცოტა ხანში სცადო."
  }
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

უპასუხე ყოველთვის ქართულად, მოკლედ, მეგობრულად და პროფესიონალურად.
მომხმარებელს დაეხმარე პროდუქტის შერჩევაში და გამოყენების ზოგად წესებში.

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

წესები:
- მომხმარებლის პრობლემის მიხედვით ურჩიე მხოლოდ ზემოთ ჩამოთვლილი შესაბამისი პროდუქტი.
- არ მოიგონო სხვა პროდუქტი, ფასი, მარაგი ან მიწოდების პირობა.
- თუ პრობლემა ან ზედაპირი გაურკვეველია, დაუსვი ერთი მოკლე დამაზუსტებელი კითხვა.
- ქიმიური პროდუქტის გამოყენებისას შეახსენე ეტიკეტის ინსტრუქციის დაცვა და საჭიროების შემთხვევაში მცირე შეუმჩნეველ ადგილზე გამოცდა.
- შეკვეთის სურვილის შემთხვევაში უთხარი, რომ შეკვეთის გასაფორმებლად საჭიროა მომხმარებლის საკონტაქტო და მიწოდების მონაცემების დაზუსტება.
- თუ მომხმარებელი სხვა თემაზე გკითხავს, მოკლედ აუხსენი, რომ შენი მთავარი ფუნქცია ECOMAX ავტოქიმიის კონსულტაციაა.
`,
      input: message
    });

    return res.json({
      reply: response.output_text || "სამწუხაროდ, პასუხი ვერ მივიღე."
    });
  } catch (error) {
    console.error("ECOMAX AI ERROR:", error);
    return res.status(500).json({
      error: "ECOMAX AI დროებით მიუწვდომელია. გთხოვ მოგვიანებით სცადო."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ECOMAX AI running on port ${PORT}`);
});
