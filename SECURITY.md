# Security Policy

## Supported Versions

We actively support the following versions of NewsReal:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability within NewsReal, please follow these steps:

### Private Disclosure

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

1. **Email**: security@newsreal.com
2. **GitHub Security Advisory**: Use the "Security" tab in this repository

### What to Include

When reporting a vulnerability, please include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes (if available)
- Your contact information for follow-up

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Critical issues within 30 days, others within 90 days

### Security Best Practices

When using NewsReal:

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use `.env` files and keep them private
3. **Dependencies**: Regularly update dependencies using `npm audit`
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: The app validates user inputs, but be cautious with external APIs

### Responsible Disclosure

We follow responsible disclosure practices:

- We will acknowledge receipt of your vulnerability report
- We will investigate and validate the issue
- We will develop and test a fix
- We will coordinate disclosure timing with you
- We will credit you for the discovery (if desired)

## Bug Bounty

Currently, we do not have a formal bug bounty program, but we greatly appreciate security research and responsible disclosure.

Thank you for helping keep NewsReal and our users safe!
