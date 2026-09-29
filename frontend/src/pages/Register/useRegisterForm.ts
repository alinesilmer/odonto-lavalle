import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/auth/useAuth";
import { ROUTES } from "@/constants";
import { registerSchema, type RegisterFormData, type RegisterFormInput } from "@/schemas";
import { ApiRequestError } from "@/services/http";

/** Registration signs the patient straight in, so the redirect happens here too. */
const REDIRECT_DELAY_MS = 1500;

const EMPTY_FORM: RegisterFormInput = {
  fullName: "",
  dni: "",
  email: "",
  phone: "",
  birthDate: "",
  password: "",
  confirmPassword: "",
  gender: "",
  insurance: "",
};

export function useRegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<RegisterFormInput, unknown, RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: EMPTY_FORM,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setFormError(null);
    try {
      // confirmPassword is a client-side check only; the API never sees it.
      const { confirmPassword: _confirmPassword, ...payload } = data;
      await register(payload);

      setShowSuccess(true);
      setTimeout(() => navigate(ROUTES.patient.home, { replace: true }), REDIRECT_DELAY_MS);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        for (const [field, message] of Object.entries(err.details ?? {})) {
          if (field in data) {
            form.setError(field as keyof RegisterFormData, { type: "server", message });
          }
        }
        setFormError(err.message);
        return;
      }
      setFormError("No pudimos conectar con el servidor");
    }
  });

  return { form, onSubmit, formError, showSuccess, closeSuccess: () => setShowSuccess(false) };
}
