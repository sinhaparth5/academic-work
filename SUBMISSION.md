# Hugo Theme Submission Checklist

Use this when you are ready to submit **Academic Work** to the Hugo Themes gallery.

## 1. Final Local Checks

Run these from the repository root:

```bash
npm run validate
```

Build the example site:

```bash
hugo --config exampleSite/hugo.toml --contentDir exampleSite/content --minify --destination /tmp/academic-work-example-public --cleanDestinationDir
node scripts/validate-output.mjs /tmp/academic-work-example-public
```

Preview the example site:

```bash
hugo server --config exampleSite/hugo.toml --contentDir exampleSite/content
```

Open the local URL and quickly check:

- Home page
- Research listing and single paper page
- Notes listing and single note page
- Library page
- Projects page
- Teaching page
- About page
- Mobile navigation
- Keyboard tab order and skip link
- Dark mode

## 2. Required Theme Images

These files are already generated:

```text
images/screenshot.png
images/tn.png
```

Expected sizes:

```text
images/screenshot.png  1500x1000
images/tn.png          900x600
```

If you want to regenerate them from the home screenshot:

```bash
convert "assets/images/pics/Screenshot 2026-04-23 165810.png" -resize 1500x1000^ -gravity north -extent 1500x1000 images/screenshot.png
convert "assets/images/pics/Screenshot 2026-04-23 165810.png" -resize 900x600^ -gravity north -extent 900x600 images/tn.png
```

## 3. Check `theme.toml`

Before submitting, confirm these fields are correct:

```toml
name        = "Academic Work"
license     = "MIT"
licenselink = "https://github.com/sinhaparth5/academic-work/blob/main/LICENSE"
description = "A clean, minimal Hugo theme for academics, researchers, and scholars. Ships with sections for research, notes, library, projects, and teaching."
homepage    = "https://github.com/sinhaparth5/academic-work"
demosite    = "https://academic-works.astrareconslabs.com/"
tags        = ["academic", "research", "minimal", "portfolio", "personal", "blog", "responsive"]
features    = ["scss", "responsive", "accessible", "minimal"]
min_version = "0.122.0"
```

Update `homepage`, `demosite`, or author links if the final URLs change.

## 4. Git Cleanup

Check the changed files:

```bash
git status
```

Review the diff:

```bash
git diff
```

Make sure you do not commit generated local output unless you intentionally want it:

```text
public/
resources/
```

Commit the theme changes:

```bash
git add .
git commit -m "Prepare Academic Work theme for submission"
git push origin master
```

## 5. Submit To Hugo Themes

Hugo themes are listed through the official `gohugoio/hugoThemes` repository.

Steps:

1. Fork the Hugo Themes repository:

   ```text
   https://github.com/gohugoio/hugoThemes
   ```

2. Add your theme as a Git submodule in the fork:

   ```bash
   git submodule add https://github.com/sinhaparth5/academic-work.git academic-work
   ```

3. Commit the submodule addition:

   ```bash
   git add .
   git commit -m "Add Academic Work theme"
   git push origin master
   ```

4. Open a pull request from your fork to:

   ```text
   gohugoio/hugoThemes
   ```

5. In the pull request description, include:

   ```markdown
   ## Theme
   Academic Work

   ## Repository
   https://github.com/sinhaparth5/academic-work

   ## Demo
   https://academic-works.astrareconslabs.com/

   ## Notes
   A minimal academic Hugo theme with research, notes, library, projects, teaching, accessibility-focused templates, KaTeX support, RSS, SEO metadata, and responsive layouts.
   ```

## 6. After Submitting

Watch the pull request checks and reviewer comments. Common requested fixes are:

- Missing or incorrect screenshots
- Broken demo URL
- Incorrect `theme.toml` metadata
- Example site build errors
- Missing license
- Missing `min_version`
- Broken links in README or example content

After any fix, rerun:

```bash
npm run validate
```
