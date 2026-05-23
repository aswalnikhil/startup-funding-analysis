# 🇮🇳 Indian Startup Funding Analysis (2015–2020)

An interactive data journalism piece analyzing 3,000+ startup funding deals in India — uncovering where the money really went, who got it, and what the ecosystem looked like before the boom.

🔗 **[Live Website](https://startup-funding-analysis.vercel.app/)**

---

## Key Findings

**1. Peak deals ≠ peak money**
2016 had the most deals (993) but 2017 had the most funding ($10.4B). Average cheque size grew from $6.5M to $22.8M as the market consolidated around winners.

**2. Volume and value are not the same thing**
E-Commerce raised $8.24B with only 296 deals vs Consumer Internet's $6.25B with 941 deals. The most active sector was not the most funded sector.

**3. Almost no one survives seed**
98.4% of seed-funded startups never raised a Series A. Of 1,500 seed deals, only 24 progressed to the next stage.

**4. Late stage takes almost everything**
Late stage deals attracted $28.3B vs early stage's $889M — across a similar number of deals.

**5. India's startup map is three cities**
Bangalore (840), Mumbai (567), and Delhi (455) accounted for over 60% of all deals. Hyderabad had just 99.

**6. Big money has no seasonality**
Deal counts were stable year-round but August ($5.8B) and November ($4.35B) saw massive spikes driven by mega-rounds.

---

## Tech Stack

| Layer | Tools |
|---|---|
| Data Collection | Kaggle — Indian Startup Funding Dataset |
| Data Cleaning | Python, Pandas |
| Analysis | Pandas, NumPy |
| Visualizations | Matplotlib, Seaborn |
| Website | Next.js, Tailwind CSS, Recharts |
| Deployment | Vercel |

---

## Project Structure


---

## Data Notes

- Dataset sourced from Kaggle (Indian Startup Funding, 2015–2020)
- 3,043 entries after cleaning
- One outlier removed (Rapido $3.9B — likely data entry error)
- City variants standardised (Bengaluru → Bangalore, Gurugram → Gurgaon)
- Industry categories unified (eCommerce, ECommerce → E-Commerce)
- Undisclosed amounts excluded from monetary totals but included in deal counts

---

## Local Setup

```bash
git clone https://github.com/aswalnikhil/startup-funding-analysis.git
cd startup-funding-analysis
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Author

**Nikhil Aswal** — Data Analyst  
[LinkedIn](https://www.linkedin.com/in/nikhil-aswal/) · [GitHub](https://github.com/aswalnikhil)

---

*Built as part of a data analysis portfolio project. Analysis notebook available in the `/analysis` folder.*
