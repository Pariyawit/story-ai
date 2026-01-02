# Contributing to Story AI

Thank you for contributing to Story AI! This guide will help you set up your development environment and follow our code standards.

## Development Setup

### Prerequisites

- Node.js 20.x or later
- pnpm 9.x or later
- Git

### Initial Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd story-ai
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory:

   ```bash
   OPENAI_API_KEY=sk-your-api-key-here
   ENABLE_IMAGE_GENERATION=true
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

## Code Standards

### Formatting and Linting

We use **Prettier** for code formatting and **ESLint** for code quality. All code must pass linting and formatting checks before being committed.

#### Key Rules

- **Line Length**: Maximum 120 characters
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings (including JSX attributes)
- **Semicolons**: Always use semicolons
- **Trailing Commas**: ES5 style (objects, arrays)
- **Line Endings**: LF (Unix-style)
- **JSX Quotes**: Single quotes (configured via `jsxSingleQuote: true`)

#### Available Commands

```bash
# Check for linting errors
pnpm run lint

# Auto-fix linting errors
pnpm run lint:fix

# Format all files with Prettier
pnpm run format

# Check formatting without making changes
pnpm run format:check

# Type-check TypeScript
pnpm run typecheck

# Run all checks (typecheck + lint + format)
pnpm run check
```

### Pre-commit Hooks

We use **Husky**, **lint-staged**, and **commitlint** to automatically enforce code quality and commit message standards. When you commit:

1. **Pre-commit hook** (runs before commit is created):
   - Staged files will be automatically linted with ESLint
   - Auto-fixable issues will be corrected
   - Files will be formatted with Prettier
   - If issues remain, the commit will be blocked

2. **Commit-msg hook** (validates commit message):
   - Ensures commit messages follow conventional commit format
   - Blocks commits with invalid message formats
   - Enforces 120-character header limit

To bypass hooks (use sparingly):

```bash
git commit --no-verify
```

### Editor Setup

#### VS Code (Recommended)

When you open the project, VS Code will recommend installing these extensions:

- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **EditorConfig** - Editor config support

The project includes VS Code settings that will:

- Format on save automatically
- Run ESLint auto-fix on save
- Show a ruler at 120 characters
- Ensure consistent line endings

#### Other Editors

Install plugins for:

- EditorConfig (reads `.editorconfig`)
- Prettier
- ESLint

## Testing

```bash
# Run tests in watch mode
pnpm run test

# Run tests once
pnpm run test:run

# Run tests with coverage
pnpm run test:coverage
```

All new features should include tests.

## Pull Request Process

1. Create a new branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

3. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request on GitHub

5. Ensure all checks pass:
   - Linting
   - Type checking
   - Tests
   - Build

### Commit Message Convention

We enforce **conventional commits** using commitlint. All commit messages must follow this format:

```
<type>: <subject>

[optional body]

[optional footer]
```

#### Allowed Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes
- `revert:` - Revert previous commit
- `ci:` - CI/CD changes
- `build:` - Build system changes

#### Rules

- Type must be lowercase
- Subject is required and cannot be empty
- Subject must not end with a period
- Header (type + subject) max 120 characters
- Body lines max 120 characters
- Blank line between header and body
- Blank line between body and footer

#### Valid Examples

```bash
# Simple commit
feat: add dark mode theme support

# With body
fix: resolve image loading issue on mobile

The images were not loading correctly on iOS Safari due to
incorrect MIME type detection. Updated the image loader to
properly handle all image formats.

# With breaking change
feat!: update API response format

BREAKING CHANGE: The API now returns data in a different format.
Update all API calls to use the new response structure.

# Multiple types of commits
docs: update README with new installation steps
test: add unit tests for story generation
chore: update dependencies to latest versions
```

#### Invalid Examples (will be rejected)

```bash
# Missing type
Add dark mode support

# Uppercase type
Feat: add dark mode

# Empty subject
feat:

# Subject ends with period
feat: add dark mode.

# Header too long
feat: add comprehensive dark mode theme support with multiple color schemes and user preferences
```

**Note**: The commit-msg hook will automatically validate your commit message and prevent commits that don't follow this convention.

## Common Issues

### Pre-commit Hook Not Running

If the pre-commit hook isn't working:

```bash
pnpm run prepare
```

### ESLint Errors

If you encounter ESLint errors:

```bash
# Try auto-fixing first
pnpm run lint:fix

# If that doesn't work, check the error messages and fix manually
pnpm run lint
```

### Prettier Formatting Conflicts

If your editor and Prettier disagree:

1. Ensure you have the latest `.prettierrc` from the repository
2. Restart your editor
3. Run `pnpm run format` to format all files

## Getting Help

- Check existing issues on GitHub
- Read the project documentation in `CLAUDE.md`
- Ask questions in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
