import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { trackSignUp } from "@/app/(frontend)/core/utils/analytics";
import { useTranslation } from "react-i18next";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Custom hook for Sign Up logic
 * Handles both credentials and Google OAuth registration
 */
export function useSignUp() {
  const router = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /**
   * Handle email/password sign up
   */
  const handleCredentialsSignUp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error(t("auth.passwordsDoNotMatch"));
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        toast.error(t("auth.passwordTooShort"));
        return;
      }

      setIsLoading(true);

      try {
        // Create account via API
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || t("auth.signUpFailed"));
          return;
        }

        // Account created, now sign in
        toast.success(t("auth.accountCreatedSuccess"));

        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
        } else if (result?.ok) {
          // Track successful sign up
          trackSignUp("email");
          router.push("/notes");
          router.refresh();
        }
      } catch (error) {
        toast.error(t("auth.errorOccurred"));
        console.error("Sign up error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, router, t],
  );

  /**
   * Handle Google OAuth sign up
   */
  const handleGoogleSignUp = useCallback(async () => {
    setIsLoading(true);
    try {
      // Track Google sign up (tracking happens on successful callback)
      trackSignUp("google");
      await signIn("google", { callbackUrl: "/notes" });
    } catch (error) {
      toast.error(t("auth.errorOccurred"));
      console.error("Google sign up error:", error);
      setIsLoading(false);
    }
  }, [t]);

  /**
   * Update form field value
   */
  const updateFormData = useCallback(
    (field: keyof SignUpFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return {
    formData,
    isLoading,
    handleCredentialsSignUp,
    handleGoogleSignUp,
    updateFormData,
  };
}
