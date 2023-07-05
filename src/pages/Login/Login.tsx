import { Alert, Button, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  AuthError,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOME } from "routes";
import { AlertCircle } from "tabler-icons-react";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { supabase } from "../../config";
import "./login.scss";

export const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<AuthError | null>();
  // const [passwordRestModalIsOpen, setPasswordResetModalIsOpen] =
  //   useState(false);
  const navigate = useNavigate();
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      notifications.show({
        title: "Fehler",
        message: "Es ist ein Fehler aufgetretten, versuche es später erneut.",
      });
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
    if (data.session && data.user) {
      supabase.auth.setSession(data.session);
      supabase.auth.updateUser(data.user);
      navigate(HOME);
      window.location.reload();
    } else {
      setError(error);
    }
  };

  // const handlePasswordReset = async (email: string) => {
  //   setPasswordResetModalIsOpen(false);
  //   const result = await supabase?.auth.resetPasswordForEmail(email, {
  //     redirectTo: BASE_URL + SETTINGS_PASSWORD,
  //   });
  //   if (result?.error) {
  //     toast.error("Fehler beim versenden der Email, versuche es später erneut");
  //   }
  //   toast.success("Email mit Passwort zurücksetzen wurde versandt");
  // };

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
          {/* <Button
            color="gray"
            onClick={() => setPasswordResetModalIsOpen(true)}
          >
            Passwort Vergessen
          </Button> */}
          <Button type="submit">Login</Button>
        </div>
      </form>
      {/* <PasswordResetModal
        isOpen={passwordRestModalIsOpen}
        onClose={() => setPasswordResetModalIsOpen(false)}
        onReset={handlePasswordReset}
      /> */}
    </div>
  );
};
