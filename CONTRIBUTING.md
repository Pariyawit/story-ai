# Contributing to Story AI

Thank you for contributing to Story AI! This guide will help you set up your development environment and follow our code standards.

## Development Setup

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Git

### Initial Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd story-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```bash
   OPENAI_API_KEY=sk-your-api-key-here
   ENABLE_IMAGE_GENERATION=true
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Code Standards

### Formatting and Linting

We use **Prettier** for code formatting and **ESLint** for code quality. All code must pass linting and formatting checks before being committed.

#### Key Rules

- **Line Length**: Maximum 100 characters
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Double quotes for strings
- **Semicolons**: Always use semicolons
- **Trailing Commas**: ES5 style (objects, arrays)
- **Line Endings**: LF (Unix-style)

#### Available Commands

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without making changes
npm run format:check

# Type-check TypeScript
npm run typecheck

# Run all checks (typecheck + lint + format)
npm run check
```

### Pre-commit Hooks

We use **Husky** and **lint-staged** to automatically lint and format code before each commit. When you commit:

1. Staged files will be automatically linted with ESLint
2. Auto-fixable issues will be corrected
3. Files will be formatted with Prettier
4. If issues remain, the commit will be blocked

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
- Show a ruler at 100 characters
- Ensure consistent line endings

#### Other Editors

Install plugins for:

- EditorConfig (reads `.editorconfig`)
- Prettier
- ESLint

## Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
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

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

Example:

```
feat: add dark mode theme support
fix: resolve image loading issue on mobile
docs: update README with new installation steps
```

## Common Issues

### Pre-commit Hook Not Running

If the pre-commit hook isn't working:

```bash
npm run prepare
```

### ESLint Errors

If you encounter ESLint errors:

```bash
# Try auto-fixing first
npm run lint:fix

# If that doesn't work, check the error messages and fix manually
npm run lint
```

### Prettier Formatting Conflicts

If your editor and Prettier disagree:

1. Ensure you have the latest `.prettierrc` from the repository
2. Restart your editor
3. Run `npm run format` to format all files

## Getting Help

- Check existing issues on GitHub
- Read the project documentation in `CLAUDE.md`
- Ask questions in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
