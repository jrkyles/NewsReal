# Contributing to NewsReal 🎙️

Thank you for your interest in contributing to NewsReal! We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@newsreal.com](mailto:conduct@newsreal.com).

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/newsreal.git
   cd newsreal
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/newsreal.git
   ```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

## How to Contribute

### 🐛 Bug Reports

1. **Search existing issues** first
2. **Use the bug report template**
3. **Include reproduction steps**
4. **Provide system information**

### 🚀 Feature Requests

1. **Check existing feature requests**
2. **Use the feature request template**
3. **Explain the use case**
4. **Consider implementation complexity**

### 💻 Code Contributions

1. **Pick an issue** or create one
2. **Comment on the issue** to claim it
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Write/update tests**
6. **Submit a pull request**

## Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated (if needed)

### PR Checklist

1. **Create descriptive title**
2. **Fill out PR template**
3. **Link related issues**
4. **Add screenshots** (for UI changes)
5. **Request review** from maintainers

### Review Process

- PRs require at least one approval
- All automated checks must pass
- Address reviewer feedback promptly
- Maintain a clean commit history

## Coding Standards

### TypeScript

- Use strict TypeScript settings
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use semantic commit messages:
  ```
  feat: add new audio player controls
  fix: resolve category selection bug
  docs: update API documentation
  test: add unit tests for hooks
  ```

### File Organization

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── services/      # API and external services
├── types/         # TypeScript definitions
├── utils/         # Utility functions
├── constants/     # App constants
└── pages/         # Page components
```

## Testing Guidelines

### Unit Tests

- Write tests for all new components
- Use React Testing Library
- Test user interactions
- Mock external dependencies

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });
});
```

### Coverage

- Maintain >80% test coverage
- Focus on critical business logic
- Test error scenarios
- Test accessibility features

## Issue Guidelines

### Bug Reports

Use this template:

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Screenshots**
Add screenshots if applicable.

**Environment**
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome, Firefox]
- Version: [e.g., 1.0.0]
```

### Feature Requests

Use this template:

```markdown
**Feature Description**
A clear description of the feature.

**Problem/Use Case**
What problem does this solve?

**Proposed Solution**
How would you implement this?

**Alternatives**
Other solutions considered.
```

## Development Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation
- `refactor/component-name` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch
4. Submit PR to main
5. Tag release after merge

## Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Report bugs via GitHub Issues
- 📧 **Email**: Contact maintainers at [team@newsreal.com](mailto:team@newsreal.com)
- 📖 **Documentation**: Check the README and docs

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project website (coming soon)

Thank you for contributing to NewsReal! 🎉
