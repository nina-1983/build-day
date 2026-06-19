# Nina Build Day Checklist

Client prep checklist for The Build Day. Clients fill in their details, tick off everything they have ready, and submit. Results go straight into Notion.

Built with Next.js, deployed on Vercel, connected to Notion.

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/nina-1983/nina-build-day-checklist.git
cd nina-build-day-checklist
npm install
```

### 2. Add environment variables

Create a `.env.local` file in the root:

```
NOTION_TOKEN=your_notion_integration_token
NOTION_DB_ID=56397420-945f-42a3-aca1-96855b0dcdd0
```

The `NOTION_DB_ID` is already set — that's the Build Day Submissions database.

For `NOTION_TOKEN`, use the same Notion integration token as the client onboarding form.

**Make sure the integration has access to the Build Day Submissions database:**
- Go to the database in Notion
- Click the `...` menu → Connections → Add your integration

### 3. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Deploy to Vercel

1. Push this repo to GitHub at `nina-1983/nina-build-day-checklist`
2. Go to [vercel.com](https://vercel.com) → Add New Project → import the repo
3. Add these environment variables in Vercel project settings:
   - `NOTION_TOKEN` — your Notion integration token
   - `NOTION_DB_ID` — `56397420-945f-42a3-aca1-96855b0dcdd0`
4. Deploy

The live URL will be `https://nina-build-day-checklist.vercel.app` (or add a custom domain).

---

## Connecting to the Build Day sales page

Once deployed, link to the checklist from the post-payment Stripe confirmation. Clients should:

1. Pay on Stripe
2. Land on a success page with the checklist link
3. Fill in and submit before their Build Day date

---

## Notion database

**Database:** Build Day Submissions  
**ID:** `56397420-945f-42a3-aca1-96855b0dcdd0`  
**Location:** ✨ Start Here — Nina's Calm Hub

Each submission comes in as **Incoming**. Move to:
- **Ready to Build** — everything is ticked and you're good to go
- **Complete** — Build Day done

---

## Tech stack

- Next.js 14 (App Router)
- Notion API (`@notionhq/client`)
- Deployed on Vercel
