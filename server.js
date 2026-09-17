const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const AGMARKNET = "https://api.agmarknet.gov.in/v1";

const headers = {
  "Accept": "application/json, text/plain, */*",
  "Origin": "https://agmarknet.gov.in",
  "Referer": "https://agmarknet.gov.in/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36"
};

app.use(express.static(__dirname));

async function upstream(url, options={}) {
  const r = await fetch(url, {...options, headers:{...headers,...(options.headers||{})}});
  const text = await r.text();
  if(!r.ok) throw new Error(`Agmarknet ${r.status}: ${text.slice(0,300)}`);
  try { return JSON.parse(text); } catch { return text; }
}

app.get("/api/agmarknet/filters", async (req,res)=>{
  try { res.json(await upstream(`${AGMARKNET}/daily-price-arrival/filters`)); }
  catch(e){ res.status(502).json({error:e.message}); }
});

app.get("/api/agmarknet/markets", async (req,res)=>{
  try {
    const state = req.query.state;
    if(!state) return res.status(400).json({error:"state is required"});
    const data = await upstream(`${AGMARKNET}/location/state`);
    // Different AGMARKNET builds can expose market metadata under different shapes.
    // Return the upstream response so the frontend can adapt without hard-coding a fake market list.
    res.json(data);
  } catch(e){ res.status(502).json({error:e.message}); }
});

app.get("/api/agmarknet/prices", async (req,res)=>{
  try {
    const {commodity,state,market} = req.query;
    if(!commodity || !state) return res.status(400).json({error:"commodity and state are required"});
    const date = new Date().toISOString().slice(0,10);
    const body = {
      date,
      marketIds: market ? [Number(market)] : [],
      stateIds: [Number(state)]
    };
    const data = await upstream(`${AGMARKNET}/prices-and-arrivals/market-report/daily`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });
    res.json(data);
  } catch(e){ res.status(502).json({error:e.message}); }
});

app.listen(PORT,()=>console.log(`Farm-Bandhu running at http://localhost:${PORT}`));
