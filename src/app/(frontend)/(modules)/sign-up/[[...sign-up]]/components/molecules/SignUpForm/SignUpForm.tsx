"use client";

import { Input } from "@/app/(frontend)/core/components/atoms/Input/Input";
import { Label } from "@/app/(frontend)/core/components/atoms/Label/Label";
import { useTranslation } from "react-i18next";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface SignUpFormProps {
  formData: SignUpFormData;
  onUpdateFormData: (field: keyof SignUpFormData, value: string) => void;
}

/**
 * SignUpForm Component
 * Name, email, password, and confirm password fields for sign-up
 */
export default function SignUpForm({
  formData,
  onUpdateFormData,
}: SignUpFormProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4">
      {/* Name Field */}
      <div className="grid gap-2">
        <Label htmlFor="name">{t("auth.name")}</Label>
        <Input
          id="name"
          type="text"
          placeholder={t("auth.namePlaceholder")}
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onUpdateFormData("name", e.target.value)
          }
          required
        />
      </div>

      {/* Email Field */}
      <div className="grid gap-2">
        <Label htmlFor="email">{t("auth.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onUpdateFormData("email", e.target.value)
          }
          required
        />
      </div>

      {/* Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="password">{t("auth.password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t("auth.passwordPlaceholder")}
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onUpdateFormData("password", e.target.value)
          }
          required
        />
      </div>

      {/* Confirm Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t("auth.passwordPlaceholder")}
          value={formData.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onUpdateFormData("confirmPassword", e.target.value)
          }
          required
        />
      </div>
    </div>
  );
}
