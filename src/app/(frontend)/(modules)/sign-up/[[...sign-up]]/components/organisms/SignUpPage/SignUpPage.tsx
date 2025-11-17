"use client";

import Link from "next/link";
import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(frontend)/core/components/atoms/Card/Card";
import { useTranslation } from "react-i18next";
import GoogleAuthButton from "../../atoms/GoogleAuthButton/GoogleAuthButton";
import AuthDivider from "../../atoms/AuthDivider/AuthDivider";
import SignUpForm from "../../molecules/SignUpForm/SignUpForm";
import { useSignUp } from "../../../handlers/useSignUp";

/**
 * Sign Up Page Organism
 * Composes registration UI using atomic components
 */
export default function SignUpPage() {
  const { t } = useTranslation();

  const {
    formData,
    isLoading,
    handleCredentialsSignUp,
    handleGoogleSignUp,
    updateFormData,
  } = useSignUp();

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t("auth.signUp")}
          </CardTitle>
          <CardDescription>{t("auth.createAccountToStart")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sign Up Button */}
          <GoogleAuthButton onClick={handleGoogleSignUp} disabled={isLoading} />

          {/* Divider */}
          <AuthDivider />

          {/* Email/Password Sign Up Form */}
          <form onSubmit={handleCredentialsSignUp} className="space-y-4">
            <SignUpForm formData={formData} onUpdateFormData={updateFormData} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("auth.creatingAccount") : t("auth.signUp")}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm">
            {t("auth.hasAccount")}{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline"
            >
              {t("auth.signIn")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
