# Security policy

## Supported versions

| Version | Supported |
|---------|-----------|
| Latest on npm | ✅ |
| Older major/minor | ❌ (upgrade recommended) |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

1. Use [GitHub private vulnerability reporting](https://github.com/KonseptDesign/three-iges-loader/security/advisories/new) if enabled, **or**
2. Email the maintainers via the contact on the [npm package page](https://www.npmjs.com/package/three-iges-loader) / repository owner profile.

Include:

- Description of the issue
- Steps to reproduce
- Impact (e.g. prototype pollution, ReDoS from malicious IGES input)
- Suggested fix (optional)

We aim to acknowledge within **5 business days** and release a fix or advisory when appropriate.

## Scope notes

This library parses **text IGES files** in user-controlled environments. Threat model includes:

- Malicious or enormous files causing excessive memory/CPU (denial of service)
- Untrusted inputs in server-side conversion pipelines

Not in scope: vulnerabilities in **Three.js** or your application code that merely uses this loader.
