# Getting the Product Builder Fluency Model live and collaborative

This guide walks you through putting the fluency model on a live URL and setting it up so all UX leaders can collaborate on it — each from their own Claude setup.

---

## What you're setting up

- **GitHub** — stores the code, tracks who changed what, lets everyone work on their own copy
- **Vercel** — watches the GitHub repo and auto-publishes a live website every time someone pushes a change

The result: a URL like `product-builder-fluency.vercel.app` that always shows the latest version.

---

## Step 1: Create the GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name it something like `product-builder-fluency-model`
3. Set it to **Private** (you can change this later)
4. Do NOT check "Add a README" — we already have files
5. Click **Create repository**
6. You'll see a page with setup instructions — keep this tab open, you'll need the URL

## Step 2: Push the project to GitHub

Open **Terminal** on your Mac (search for it in Spotlight) and run these commands one at a time.

First, navigate to the project folder:
```
cd ~/Documents/Claude/Projects/AI\ Upskilling
```

Then set up git and push:
```
git init
git add .
git commit -m "Initial fluency model"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/product-builder-fluency-model.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username (or the org name if you created it under an org).

> **If git asks for credentials:** GitHub now requires a personal access token instead of a password. Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token. Give it `repo` scope. Use the token as your password when prompted.

## Step 3: Connect Vercel for auto-deploy

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **Add New → Project**
3. Find and select your `product-builder-fluency-model` repo
4. Vercel auto-detects it's a Vite project — the defaults are correct
5. Click **Deploy**
6. Wait ~30 seconds. You'll get a live URL like `product-builder-fluency-model.vercel.app`

That's it. Every time someone pushes to `main`, Vercel rebuilds and updates the live site automatically.

## Step 4: Invite the UX leaders

**On GitHub:**
- Go to the repo → Settings → Collaborators → Add people
- Add each UX leader by their GitHub username or email
- They'll get an invite they need to accept

**On Vercel:**
- No action needed — Vercel deploys from GitHub automatically, so anyone who can push to the repo will see their changes go live

---

## How to collaborate day-to-day

### Option A: Each person uses Claude (recommended)

Each UX leader can work on the model from their own Claude Cowork setup:

1. **Clone the repo** to get a local copy:
   ```
   cd ~/Documents/Claude/Projects
   git clone https://github.com/YOUR-USERNAME/product-builder-fluency-model.git
   cd product-builder-fluency-model
   ```

2. **Select the folder** in Claude Cowork (the folder picker)

3. **Ask Claude to make changes** — e.g. "update the Stage 3 UX behaviors for the Sense stream" or "add a new learning resource for accessibility"

4. **Push the changes** when you're happy:
   ```
   cd ~/Documents/Claude/Projects/product-builder-fluency-model
   git add .
   git commit -m "Updated Stage 3 Sense behaviors"
   git push
   ```

5. Vercel auto-deploys. The live site updates in ~30 seconds.

### Option B: Edit directly on GitHub

For quick text changes, anyone can edit directly in the browser:

1. Go to the repo on GitHub
2. Navigate to `src/ProductBuilderFluencyModel.jsx`
3. Click the pencil icon (Edit)
4. Make your changes
5. Click "Commit changes"
6. Vercel auto-deploys

### Avoiding conflicts

If two people edit the same file at the same time, git will flag a conflict. To stay safe:

- **Pull before you start**: `git pull` (gets the latest version)
- **Push when you're done**: `git add . && git commit -m "description" && git push`
- **Communicate**: a quick Slack message like "I'm editing the learning resources" goes a long way

---

## Running locally (optional)

If you want to see your changes before pushing:

```
cd ~/Documents/Claude/Projects/product-builder-fluency-model
npm install
npm run dev
```

This starts a local server at `http://localhost:5173`. Changes to the code show up instantly in the browser.

---

## Project structure

```
product-builder-fluency-model/
├── src/
│   ├── ProductBuilderFluencyModel.jsx   ← THE main file (all the content)
│   └── main.jsx                         ← App entry point (don't touch)
├── index.html                           ← HTML shell (don't touch)
├── package.json                         ← Dependencies
├── vite.config.js                       ← Build config (don't touch)
└── .gitignore                           ← Files git should ignore
```

99% of the work happens in `src/ProductBuilderFluencyModel.jsx`. That's where all the rubric content, tools, learning resources, stages, and UI components live.
