# react-i18next Integration Guide

## Overview

This project uses `react-i18next` for internationalization (i18n) with support for English (en) and Vietnamese (vi) languages.

## Installation

Packages installed:

- `react-i18next` v16.3.3
- `i18next` v25.6.2

## File Structure

```
src/app/(frontend)/core/i18n/
├── config.ts              # i18next configuration
├── I18nProvider.tsx       # Provider component
├── index.ts               # Main exports
└── locale/
    ├── en/
    │   └── default.ts     # English translations
    └── vi/
        └── default.ts     # Vietnamese translations
```

## Setup

The `I18nProvider` is already added to the root layout in `src/app/layout.tsx`.

## Usage Examples

### 1. Basic Translation (Object Access) - Recommended for existing code

This approach maintains backward compatibility with the existing codebase:

```tsx
import { useTranslation } from "@/app/(frontend)/core/i18n";

export default function MyComponent() {
  const t = useTranslation();

  return (
    <div>
      <h1>{t.navbar.appName}</h1>
      <p>{t.auth.loginTitle}</p>
      <button>{t.common.submit}</button>
    </div>
  );
}
```

### 2. Function-based Translation (react-i18next style)

Use this for dynamic keys or when you need i18next features:

```tsx
import { useI18nTranslation } from "@/app/(frontend)/core/i18n";

export default function MyComponent() {
  const { t, i18n } = useI18nTranslation();

  return (
    <div>
      <h1>{t("navbar.appName")}</h1>
      <p>{t("auth.loginTitle")}</p>
      <button>{t("common.submit")}</button>

      {/* Dynamic key */}
      <p>{t(`errors.${errorCode}`)}</p>
    </div>
  );
}
```

### 3. Trans Component for JSX in translations

```tsx
import { Trans } from "@/app/(frontend)/core/i18n";

export default function MyComponent() {
  return (
    <Trans i18nKey="auth.termsAgreement">
      I agree to the <a href="/terms">Terms and Conditions</a>
    </Trans>
  );
}
```

### 4. Changing Language

The language is managed by Zustand store:

```tsx
import { useSetLocale } from "@/app/(frontend)/core/store/useLanguageStore";

export default function LanguageSwitcher() {
  const setLocale = useSetLocale();

  return <button onClick={() => setLocale("vi")}>Switch to Vietnamese</button>;
}
```

### 5. Interpolation (Parameters)

Add parameters in your translation files:

```typescript
// locale/en/default.ts
{
  dashboard: {
    welcome: "Welcome back, {{name}}!",
    itemCount: "You have {{count}} items"
  }
}
```

Then use with the function-based approach:

```tsx
import { useI18nTranslation } from "@/app/(frontend)/core/i18n";

export default function Dashboard({ userName, itemCount }) {
  const { t } = useI18nTranslation();

  return (
    <div>
      <h1>{t("dashboard.welcome", { name: userName })}</h1>
      <p>{t("dashboard.itemCount", { count: itemCount })}</p>
    </div>
  );
}
```

### 6. Pluralization

```typescript
// locale/en/default.ts
{
  items: {
    count_one: "{{count}} item",
    count_other: "{{count}} items"
  }
}
```

```tsx
const { t } = useI18nTranslation();
<p>{t("items.count", { count: itemCount })}</p>;
```

### 7. Accessing i18n Instance Directly

```tsx
import { i18n } from "@/app/(frontend)/core/i18n";

// Change language programmatically
i18n.changeLanguage("vi");

// Get current language
const currentLang = i18n.language;

// Check if key exists
const hasKey = i18n.exists("navbar.appName");
```

## Migration Guide

The existing code continues to work without changes:

**Before (still works):**

```tsx
const locale = useLocale();
const t = locales[locale];
return <p>{t.navbar.appName}</p>;
```

**After (recommended):**

```tsx
const t = useTranslation();
return <p>{t.navbar.appName}</p>;
```

**New way (for dynamic keys):**

```tsx
const { t } = useI18nTranslation();
return <p>{t("navbar.appName")}</p>;
```

## Translation File Structure

All translations should follow this nested object structure:

```typescript
const defaultTranslations = {
  common: {
    loading: "Loading...",
    error: "Error",
    // ...
  },
  navbar: {
    appName: "AI Note",
    // ...
  },
  auth: {
    loginTitle: "Sign In",
    // ...
  },
  // ...
} as const;

export default defaultTranslations;
```

## Best Practices

1. **Use Object Access for Static Keys**: `t.navbar.appName` (type-safe, autocomplete)
2. **Use Function for Dynamic Keys**: `t(\`errors.\${code}\`)` (flexible)
3. **Keep Translation Keys Organized**: Group related translations together
4. **Use Namespaces**: Use nested objects for better organization
5. **Consistent Naming**: Use camelCase for keys
6. **Add New Keys to Both Languages**: Always add translations for both en and vi

## TypeScript Support

The current setup provides type safety for the object access pattern:

```tsx
const t = useTranslation();
t.navbar.appName; // ✅ Type-safe, autocomplete works
t.navbar.invalidKey; // ❌ TypeScript error
```

For function-based approach, you can add type definitions in `locale/en/default.ts`:

```typescript
export type TranslationKeys = typeof defaultTranslations;
```

## Troubleshooting

### Language not changing

- Ensure `I18nProvider` wraps your app
- Check that `useLocale()` returns the correct value
- Verify translations exist in both language files

### Missing translations

- Check console for missing key warnings
- Ensure the key exists in locale files
- Verify the key path is correct

### SSR/Hydration issues

- `useSuspense: false` is already configured
- Provider is set up as a client component

## Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
