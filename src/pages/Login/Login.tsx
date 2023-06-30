import { Alert, Button, TextInput } from "@mantine/core";
import {
  AuthError,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AlertCircle } from "tabler-icons-react";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { BASE_URL, supabase } from "../../config";
import { SETTINGS_PASSWORD } from "../../routes";
import { PasswordResetModal } from "./PasswordResetModal/PasswordResetModal";
import "./login.scss";

export const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<AuthError | null>();
  const [passwordRestModalIsOpen, setPasswordResetModalIsOpen] =
    useState(false);
  const navigate = useNavigate();
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Bitte Passwort und E-Mail eingeben");
      return;
    }
    const credentials: SignInWithPasswordCredentials = {
      email: email,
      password: password,
    };
    if (!supabase) {
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    setError(error);
    if (data.session && data.user) {
      supabase.auth.setSession(data.session);
      supabase.auth.updateUser(data.user);
      navigate("/home");
      window.location.reload();
    }
  };

  const handlePasswordReset = async (email: string) => {
    setPasswordResetModalIsOpen(false);
    const result = await supabase?.auth.resetPasswordForEmail(email, {
      redirectTo: BASE_URL + SETTINGS_PASSWORD,
    });
    if (result?.error) {
      toast.error("Fehler beim versenden der Email, versuche es später erneut");
    }
    toast.success("Email mit Passwort zurücksetzen wurde versandt");
  };

  return (
    <div className="login-page">
      <PageHeader title="Login" />
      <form onSubmit={(event) => handleLogin(event)}>
        <div className="login-page__inputs">
          <TextInput
            value={email}
            id="email"
            label="Account"
            type={"email"}
            placeholder="E-Mail"
            onChange={(value) => setEmail(value.currentTarget.value)}
          />
          <TextInput
            value={password}
            id="password"
            placeholder="Passwort"
            type={"password"}
            label="Passwort"
            onChange={(value) => setPassword(value.currentTarget.value)}
          />
        </div>
        {error && (
          <Alert
            style={{ marginBottom: "2rem" }}
            icon={<AlertCircle />}
            title="Fehler!"
            color="red"
          >
            Falsches Passwort oder E-Mail!
          </Alert>
        )}

        <div className="login-page-button-container">
          <Button
            color="gray"
            onClick={() => setPasswordResetModalIsOpen(true)}
          >
            Passwort Vergessen
          </Button>
          <Button type="submit">Login</Button>
        </div>
      </form>
      <PasswordResetModal
        isOpen={passwordRestModalIsOpen}
        onClose={() => setPasswordResetModalIsOpen(false)}
        onReset={handlePasswordReset}
      />
    </div>
  );
};
