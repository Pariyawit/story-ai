# Linting and Formatting Setup

## Overview

This repository is configured with comprehensive linting and formatting tools to ensure code consistency across all collaborators.

## Tools Installed

### 1. Prettier (Code Formatter)

- **Version**: ^3.7.4
- **Config**: [.prettierrc](.prettierrc)
- **Key Settings**:
  - Max line length: 120 characters
  - Tab width: 2 spaces
  - Semicolons: Required
  - Quotes: Double quotes
  - Line endings: LF (Unix)

### 2. ESLint (Code Linter)

- **Version**: ^9
- **Config**: [eslint.config.mjs](eslint.config.mjs)
- **Includes**:
  - Next.js recommended rules
  - TypeScript support
  - React best practices
  - Import ordering
  - Prettier integration

### 3. EditorConfig

- **Config**: [.editorconfig](.editorconfig)
- **Purpose**: Ensures consistent editor settings across different IDEs

### 4. Husky + lint-staged (Pre-commit Hooks)

- **Husky**: Manages Git hooks
- **lint-staged**: Runs linters on staged files only
- **Behavior**: Automatically formats and lints code before each commit

### 5. Commitlint (Commit Message Linter)

- **Version**: ^18.x
- **Config**: [commitlint.config.js](commitlint.config.js)
- **Purpose**: Enforces conventional commit message format
- **Behavior**: Validates commit messages using commit-msg hook

## Quick Start for Collaborators

### First Time Setup

After cloning the repository:

```bash
npm install
```

This will automatically set up Husky hooks via the `prepare` script.

### Daily Usage

Just code normally! The pre-commit hook will handle formatting automatically when you commit.

### Manual Commands

```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check

# Lint all files
npm run lint

# Fix auto-fixable lint issues
npm run lint:fix

# Type check
npm run typecheck

# Run all checks (before PR)
npm run check
```

## What Happens on Commit

1. You run `git commit -m "feat: your message"`
2. **Pre-commit hook** runs first:
   - Husky triggers the pre-commit hook
   - lint-staged runs on your staged files:
     - ESLint auto-fixes issues
     - Prettier formats code
   - If issues remain, commit is blocked
3. **Commit-msg hook** runs next:
   - commitlint validates your commit message
   - Checks conventional commit format
   - Ensures header is ≤120 characters
   - If invalid, commit is blocked with error message
4. If both hooks pass, commit succeeds

## Editor Integration

### VS Code

Recommended extensions (auto-suggested on first open):

- Prettier - Code formatter
- ESLint
- EditorConfig for VS Code

Settings are pre-configured in [.vscode/settings.json](.vscode/settings.json):

- Format on save: ✅
- ESLint auto-fix on save: ✅
- 120-character ruler: ✅

### Other Editors

Install equivalent plugins for:

- EditorConfig
- Prettier
- ESLint

## Bypassing Hooks (Emergency Only)

If you absolutely need to commit without running hooks:

```bash
git commit --no-verify
```

**Note**: Use sparingly. CI/CD should still enforce these checks.

## Common Scenarios

### Scenario 1: Formatting All Files After Setup

After setting up linting for the first time, format all existing files:

```bash
npm run format
```

Then commit the formatted files:

```bash
git add .
git commit -m "chore: format all files with Prettier"
```

### Scenario 2: Resolving Merge Conflicts with Formatting

1. Resolve conflicts manually
2. Run `npm run format` to ensure consistent formatting
3. Commit the resolution

### Scenario 3: CI/CD Integration

Add this to your CI pipeline:

```yaml
- name: Check code quality
  run: npm run check
```

This runs:

- TypeScript type checking
- ESLint
- Prettier format check

## Troubleshooting

### Hook Not Running

```bash
# Reinstall hooks
npm run prepare
```

### Conflicting Editor Formatting

1. Ensure editor is using the Prettier extension
2. Check that `.prettierrc` is being read
3. Restart editor
4. Run `npm run format` to align

### ESLint Errors on Existing Code

Known warnings (documented in CLAUDE.md):

- Anonymous default export in systemPrompt.ts
- Unused imports in some files
- React hooks dependency warnings

These are pre-existing and don't block commits.

## Configuration Files Reference

| File                           | Purpose                        |
| ------------------------------ | ------------------------------ |
| `.prettierrc`                  | Prettier formatting rules      |
| `.prettierignore`              | Files to exclude from Prettier |
| `eslint.config.mjs`            | ESLint rules and plugins       |
| `.editorconfig`                | Cross-editor consistency       |
| `commitlint.config.js`         | Commit message linting rules   |
| `.husky/pre-commit`            | Pre-commit hook script         |
| `.husky/commit-msg`            | Commit message validation hook |
| `package.json` (`lint-staged`) | What to run on staged files    |
| `.vscode/settings.json`        | VS Code specific settings      |
| `.vscode/extensions.json`      | Recommended VS Code extensions |

## Rules Summary

### Code Style Rules (Enforced by Prettier)

- ✅ Max line length: 100
- ✅ Indentation: 2 spaces
- ✅ Semicolons: Always
- ✅ Quotes: Double
- ✅ Trailing commas: ES5 style
- ✅ Line endings: LF
- ✅ Arrow function parens: Always

### Code Quality Rules (Enforced by ESLint)

- ⚠️ `no-console`: Warn (except console.warn/error)
- ⚠️ Unused variables starting with `_`: Ignored
- ⚠️ Unused imports: Warning
- ⚠️ `any` type: Warning
- ✅ Import ordering: Enforced (alphabetical, grouped)
- ✅ React hooks dependencies: Warning

## Migration Notes

If migrating existing code:

1. Run `npm run format` to format all files
2. Run `npm run lint:fix` to auto-fix linting issues
3. Manually fix remaining warnings
4. Commit with message: `chore: apply linting and formatting standards`

## Commit Message Format

We enforce conventional commits. Format: `<type>: <subject>`

**Allowed types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`, `build`

**Examples**:

```bash
✅ feat: add user authentication
✅ fix: resolve memory leak in image loader
✅ docs: update API documentation
✅ chore: update dependencies

❌ Add user authentication (missing type)
❌ Feat: add auth (uppercase type)
❌ feat: (empty subject)
❌ feat: add user authentication. (ends with period)
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed commit message guidelines.

## Future Enhancements

Potential additions:

- [x] Commitlint (enforce commit message format) ✅ **COMPLETED**
- [ ] Stylelint (CSS/Tailwind linting)
- [ ] GitHub Actions workflow for PR checks
- [ ] Dangerjs for PR automation

## Questions?

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details or open an issue.
