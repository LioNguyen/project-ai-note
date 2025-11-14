"use client";

import { Input } from "@/app/(frontend)/core/components/atoms/Input/Input";
import { Label } from "@/app/(frontend)/core/components/atoms/Label/Label";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";

type SignInFormData = {
  email: string;
  password: string;
};

interface SignInFormProps {
  formData: SignInFormData;
  onUpdateFormData: (field: keyof SignInFormData, value: string) => void;
}

/**
 * SignInForm Component
 * Email and password input fields for sign-in
 */
export default function SignInForm({
  formData,
  onUpdateFormData,
}: SignInFormProps) {
  const locale = useLocale();
  const t = locales[locale];

  return (
    <div className="grid gap-4">
      {/* Email Field */}
      <div className="grid gap-2">
        <Label htmlFor="email">{t.auth.email}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t.auth.emailPlaceholder}
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onUpdateFormData("email", e.target.value)
          }
          required
        />
      </div>

      {/* Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="password">{t.auth.password}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t.auth.passwordPlaceholder}
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onUpdateFormData("password", e.target.value)
          }
          required
        />
      </div>
    </div>
  );
}
