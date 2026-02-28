---
name: spec:no-barrel-exports
description: "Never use barrel exports (index.js)"
---

# Never use barrel exports (index.js)

Import directly from specific files, never through index.js re-exports.

## Rule

- Never create `index.js` files to re-export components or modules
- Always import from the specific file path
- Use path aliases (`@/`) for cleaner imports

## Example

```javascript
// WRONG
// src/components/splash-screen/index.js
export { SplashScreen } from './splash-screen';

// some-page.jsx
import { SplashScreen } from '@/components/splash-screen';

// CORRECT
// No index.js file at all

// some-page.jsx
import { SplashScreen } from '@/components/splash-screen/splash-screen';
```

## Why

Barrel exports hide the actual file structure and make imports harder to trace. Direct imports are explicit and easier to maintain.
