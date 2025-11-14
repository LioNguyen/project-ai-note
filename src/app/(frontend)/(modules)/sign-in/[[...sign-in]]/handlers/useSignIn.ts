import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { trackSignIn } from "@/app/(frontend)/core/utils/analytics";
import { clearAllTrialData } from "@/app/(frontend)/core/utils/trialMode";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";

interface SignInFormData {
  email: string;
  password: string;
}

/**
 * Custom hook for Sign In logic
 * Handles both credentials and Google OAuth authentication
 */
export function useSignIn() {
  const router = useRouter();
  const locale = useLocale();
  const t = locales[locale];

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  /**
   * Handle email/password sign in
   */
  const handleCredentialsSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
        } else if (result?.ok) {
          // Clear trial data after successful sign in
          await clearAllTrialData();

          // Track successful sign in
          trackSignIn("email");
          toast.success(t.auth.loginSuccess);
          router.push("/notes");
          router.refresh();
        }
      } catch (error) {
        toast.error(t.auth.errorOccurred);
        console.error("Sign in error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [formData.email, formData.password, router, t.auth],
  );

  /**
   * Handle Google OAuth sign in
   */
  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      // Track Google sign in (tracking happens on successful callback)
      trackSignIn("google");
      await signIn("google", { callbackUrl: "/notes" });
    } catch (error) {
      toast.error(t.auth.errorOccurred);
      console.error("Google sign in error:", error);
      setIsLoading(false);
    }
  }, [t.auth]);

  /**
   * Update form field value
   */
  const updateFormData = useCallback(
    (field: keyof SignInFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return {
    formData,
    isLoading,
    handleCredentialsSignIn,
    handleGoogleSignIn,
    updateFormData,
  };
}
