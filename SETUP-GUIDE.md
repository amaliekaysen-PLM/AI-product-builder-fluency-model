# Getting the Product Builder Fluency Model live and collaborative

This guide walks you through putting the fluency model on a live URL and setting it up so all UX leaders can collaborate on it — each from their own Claude setup.

---

## What you're setting up

- **GitHub** — stores the code, tracks who changed what, lets everyone work on their own copy
- **GitHub Pages** — auto-publishes a live website every time someone pushes a change (free, built into GitHub)

The result: a URL like `amaliekaysen-plm.github.io/AI-product-builder-fluency-model/` that always shows the latest version.

---

## Step 1: Enable GitHub Pages

1. Go to your repo: [github.com/amaliekaysen-PLM/AI-product-builder-fluency-model](https://github.com/amaliekaysen-PLM/AI-product-builder-fluency-model)
2. Click **Settings** (top menu bar)
3. In the left sidebar, click **Pages**
4. Under "Build and deployment" → Source, select **GitHub Actions**
5. That's it — the deploy workflow is already in the code

## Step 2: Push the latest code

Open **Terminal** on your Mac and run:
```
cd ~/Documents/Claude/Projects/AI\ Upskilling
git add .
git commit -m "Add GitHub Pages deploy"
git push
```

This pushes the deploy workflow. GitHub will automatically build and publish the site. Give it 1–2 minutes, then visit:

**https://amaliekaysen-plm.github.io/AI-product-builder-fluency-model/**

## Step 3: Invite the UX leaders

1. Go to the repo → **Settings** → **Collaborators** → **Add people**
2. Add each UX leader by their GitHub username or email
3. They'll get an invite they need to accept

---

## How to collaborate day-to-day

### Option A: Each person uses Claude (recommended)

Each UX leader can work on the model from their own Claude Cowork setup:

1. **Clone the repo** to get a local copy:
   ```
   cd ~/Documents/Claude/Projects
   git clone https://github.com/amaliekaysen-PLM/AI-product-builder-fluency-model.git
   cd AI-product-builder-fluency-model
   ```

2. **Select the folder** in Claude Cowork (the folder picker)

3. **Ask Claude to make changes** — e.g. "update the Stage 3 UX behaviors for the Sense stream" or "add a new learning resource for accessibility"

4. **Push the changes** when you're happy:
   ```
   cd ~/Documents/Claude/Projects/AI-product-builder-fluency-model
   git add .
   git commit -m "Updated Stage 3 Sense behaviors"
   git push
   ```

5. GitHub Pages auto-deploys. The live site updates in ~1–2 minutes.

### Option B: Edit directly on GitHub

For quick text changes, anyone can edit directly in the browser:

1. Go to the repo on GitHub
2. Navigate to `src/ProductBuilderFluencyModel.jsx`
3. Click the pencil icon (Edit)
4. Make your changes
5. Click "Commit changes"
6. GitHub Pages auto-deploys

### Avoiding conflicts

If two people edit the same file at the same time, git will flag a conflict. To stay safe:

- **Pull before you start**: `git pull` (gets the latest version)
- **Push when you're done**: `git add . && git commit -m "description" && git push`
- **Communicate**: a quick Slack message like "I'm editing the learning resources" goes a long way

---

## Running locally (optional)

If you want to see your changes before pushing:

```
cd ~/Documents/Claude/Projects/AI-product-builder-fluency-model
npm install
npm run dev
```

This starts a local server at `http://localhost:5173`. Changes to the code show up instantly in the browser.

---

## Project structure

```
AI-product-builder-fluency-model/
├── .github/workflows/deploy.yml         ← Auto-deploy config (don't touch)
├── src/
│   ├── ProductBuilderFluencyModel.jsx   ← THE main file (all the content)
│   └── main.jsx                         ← App entry point (don't touch)
├── index.html                           ← HTML shell (don't touch)
├── package.json                         ← Dependencies
├── vite.config.js                       ← Build config (don't touch)
└── .gitignore                           ← Files git should ignore
```

99% of the work happens in `src/ProductBuilderFluencyModel.jsx`. That's where all the rubric content, tools, learning resources, stages, and UI components live.
