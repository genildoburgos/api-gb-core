# Contributing to Image Management API

First off, thank you for considering contributing to this project! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing improvements and features.

## ⚡ Quick Start

1.  **Fork** the repository on GitHub.
2.  **Clone** the project to your own machine.
3.  **Install dependencies**: `npm install`
4.  **Configure Environment**: Copy `.env.example` to `.env` and fill in your AWS/JWT credentials (see README.md for details).
5.  **Create a Branch**: `git checkout -b <branch-name>`

## 🛠 Development Workflow

### 1. Branch Naming

We follow a simple naming convention for branches to keep things organized:

*   `feat/description`: For new features (e.g., `feat/user-profile-update`)
*   `fix/description`: For bug fixes (e.g., `fix/s3-upload-error`)
*   `docs/description`: For documentation changes
*   `chore/description`: For maintenance tasks, dependencies, etc.

### 2. Coding Standards

*   **Style**: This project uses the standard **NestJS** style guide.
*   **Linting**: Ensure your code passes linting.
*   **Types**: Avoid using `any` whenever possible. Use strict typing with TypeScript interfaces and DTOs.

### 3. Testing

This project maintains high test coverage (~90%).

*   **Unit Tests**: If you add functionality, you **must** add unit tests.
*   **Run Tests**: Before pushing, ensure all tests pass:
    ```bash
    npm run test
    ```

### 4. Commit Messages

We encourage the use of **Conventional Commits** to ensure a clean history and automated changelogs in the future.

Format: `<type>: <subject>`

Examples:
*   `feat: add delete image endpoint`
*   `fix: resolve dynamoDB connection timeout`
*   `docs: update readme with setup instructions`
*   `test: add unit tests for auth service`

## 🐛 Reporting Bugs

Bugs are tracked as GitHub issues. When filing an issue, please include:

1.  A clear title and description.
2.  Steps to reproduce the bug.
3.  Expected behavior vs. actual behavior.
4.  Any relevant logs or screenshots.

## 🚀 Pull Requests

1.  Push your changes to your fork.
2.  Submit a Pull Request to the `main` branch.
3.  **Title**: Use the same convention as commit messages.
4.  **Description**: Explain *what* you changed and *why*. Link to any relevant issues (e.g., "Fixes #123").

### PR Checklist

- [ ] My code follows the style guidelines of this project.
- [ ] I have performed a self-review of my own code.
- [ ] I have added tests that prove my fix is effective or that my feature works.
- [ ] New and existing unit tests pass locally with my changes.
- [ ] I have updated the documentation (if applicable).

---

## ❓ Questions?

Feel free to open an issue if you have any questions or need clarification on the codebase.

Happy Coding! 🚀
