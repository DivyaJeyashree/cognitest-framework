import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

// Health API
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

// Branches API
app.get("/branches", (req: Request, res: Response) => {
  res.json({
    branches: [
      { id: 1, name: "Kuwait City" },
      { id: 2, name: "Salmiya" }
    ]
  });
});

// Rate API
app.post("/rate", (req: Request, res: Response) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Invalid input" });
  }

  res.json({
    amount,
    currency,
    rate: 0.30,
    convertedAmount: amount * 0.30
  });
});

// Support API
app.get("/support", (req: Request, res: Response) => {
  res.json({
    email: "support@almuzaini.com",
    phone: "+965-12345678"
  });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});