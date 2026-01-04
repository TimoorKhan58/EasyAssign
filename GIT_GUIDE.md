# Git Push Guide - EasyAssign

This guide will help you push your code to GitHub.

## Current Status
- **Repository**: `https://github.com/TimoorKhan58/EasyAssign.git`
- **Branch**: `main`
- **Status**: You have 1 commit ahead of origin/main that needs to be pushed
- **Uncommitted changes**: Some modified files need to be staged and committed

---

## Step-by-Step Guide

### Step 1: Check Current Status
```bash
git status
```
This shows you what files have been modified, added, or deleted.

### Step 2: Review Your Changes
```bash
# See what changed in modified files
git diff

# Or for a specific file
git diff server/prisma/schema.prisma
```

### Step 3: Stage Your Changes
You have two options:

**Option A: Stage all changes**
```bash
git add .
```

**Option B: Stage specific files**
```bash
git add server/prisma/schema.prisma
git add client/src/services/api.js
git add server/package.json
```

**Note**: The `.env` file and database files are already in `.gitignore`, so they won't be committed.

### Step 4: Commit Your Changes
```bash
git commit -m "Your descriptive commit message here"
```

**Good commit message examples:**
- `"Update Prisma schema to use SQLite for development"`
- `"Fix API endpoint configuration"`
- `"Add environment variable support"`

### Step 5: Push to GitHub
```bash
# Push to the main branch
git push origin main
```

If this is your first push or if you need to set upstream:
```bash
git push -u origin main
```

---

## Quick Push (All-in-One)

If you want to push all changes quickly:

```bash
# Stage all changes
git add .

# Commit with a message
git commit -m "Update project configuration"

# Push to GitHub
git push origin main
```

---

## Common Scenarios

### Scenario 1: Push Existing Commits
If you already have commits that haven't been pushed:
```bash
git push origin main
```

### Scenario 2: Push New Changes
If you have uncommitted changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Scenario 3: Force Push (Use with Caution!)
Only use if you need to overwrite remote history:
```bash
git push --force origin main
```
⚠️ **Warning**: Force push can overwrite other people's work. Only use if you're sure!

### Scenario 4: Push to a Different Branch
```bash
# Create and switch to a new branch
git checkout -b feature-branch

# Make changes, then push
git push -u origin feature-branch
```

---

## Authentication

### If you get authentication errors:

**Option 1: Use Personal Access Token (Recommended)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` permissions
3. Use the token as your password when pushing

**Option 2: Use SSH (More Secure)**
```bash
# Check if you have SSH keys
ls ~/.ssh

# If not, generate one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then change remote URL
git remote set-url origin git@github.com:TimoorKhan58/EasyAssign.git
```

**Option 3: Use GitHub CLI**
```bash
# Install GitHub CLI, then authenticate
gh auth login
```

---

## Best Practices

1. **Commit Often**: Make small, frequent commits with clear messages
2. **Review Before Pushing**: Use `git status` and `git diff` to review changes
3. **Don't Commit Secrets**: `.env` files are already in `.gitignore`
4. **Write Good Commit Messages**: Be descriptive about what changed and why
5. **Pull Before Push**: If working with others, pull first:
   ```bash
   git pull origin main
   git push origin main
   ```

---

## Troubleshooting

### Error: "Updates were rejected"
```bash
# Pull the latest changes first
git pull origin main
# Resolve any conflicts, then push again
git push origin main
```

### Error: "Authentication failed"
- Check your GitHub credentials
- Use a Personal Access Token instead of password
- Consider setting up SSH keys

### Undo Last Commit (Before Pushing)
```bash
git reset --soft HEAD~1  # Keeps changes staged
git reset HEAD~1          # Unstages changes but keeps files
```

---

## Current Project Status

Based on your current state:
1. You have 1 commit ready to push: `"Update database connection in schema.prisma..."`
2. You have uncommitted changes in:
   - `client/src/services/api.js`
   - `server/package.json`
   - `server/prisma/prisma/` (untracked)

**Recommended Next Steps:**
```bash
# 1. Review the uncommitted changes
git diff

# 2. Stage and commit them (if you want to include them)
git add .
git commit -m "Update API configuration and package dependencies"

# 3. Push all commits
git push origin main
```

---

## Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Help**: https://docs.github.com
- **Common Git Commands**: https://education.github.com/git-cheat-sheet-education.pdf

