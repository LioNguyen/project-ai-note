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
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import GoogleAuthButton from "../../atoms/GoogleAuthButton/GoogleAuthButton";
import AuthDivider from "../../atoms/AuthDivider/AuthDivider";
import SignInForm from "../../molecules/SignInForm/SignInForm";
import { useSignIn } from "../../../handlers/useSignIn";

/**
 * Sign In Page Organism
 * Composes authentication UI using atomic components
 */
export default function SignInPage() {
  const locale = useLocale();
  const t = locales[locale];

  const {
    formData,
    isLoading,
    handleCredentialsSignIn,
    handleGoogleSignIn,
    updateFormData,
  } = useSignIn();

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t.auth.signIn}</CardTitle>
          <CardDescription>{t.auth.chooseSignInMethod}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sign In Button */}
          <GoogleAuthButton onClick={handleGoogleSignIn} disabled={isLoading} />

          {/* Divider */}
          <AuthDivider />

          {/* Email/Password Sign In Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <SignInForm formData={formData} onUpdateFormData={updateFormData} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t.auth.signingIn : t.auth.signIn}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            {t.auth.noAccount}{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              {t.auth.signUp}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
