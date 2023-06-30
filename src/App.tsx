import { MantineProvider } from "@mantine/core";
import { Session } from "@supabase/supabase-js";
import { createContext } from "preact";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./colors.scss";
import { SideNavbar } from "./components/Navbar/SideNavbar";
import { supabase } from "./config";
import { User } from "./models/User";
import { Home } from "./pages/Home/Home";
import { LoginPage } from "./pages/Login/Login";
import { HOME, LOGIN } from "./routes";
import { getUser } from "./supabase/userFunctions";

export default function App() {
  const [session, setSession] = useState<Session>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    supabase?.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session ?? undefined);
      if (session?.user.id) {
        const user = await getUser(session?.user.id ?? "");
        setUser(user);
      }
    });

    supabase?.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? undefined);
      if (session?.user.id !== session?.user.id) {
        const user = await getUser(session?.user.id ?? "");
        setUser(user);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <SideNavbar>
        <MantineProvider
          theme={{
            colors: {
              "yellow-green-crayola": [
                "#d4ded9",
                "#a9bdb4",
                "#7e9b8e",
                "#698b7b",
                "#537a69",
                "#3e6a56",
                "#285943",
                "#183528",
                "#142d22",
                "#040907",
              ],
            },
            primaryShade: 6,
            primaryColor: "yellow-green-crayola",
            // fontFamily: ""
          }}
        >
          <UserContext.Provider value={user}>
            <div className="page">
              <Routes>
                {!session || !user ? (
                  <>
                    <Route path={"/"} element={<LoginPage />} />
                    <Route path={LOGIN} element={<LoginPage />} />
                  </>
                ) : (
                  <>
                    <Route index path={"/"} element={<Home />}></Route>
                    <Route index path={HOME} element={<Home />}></Route>
                  </>
                )}
              </Routes>
            </div>
          </UserContext.Provider>
        </MantineProvider>

        <ToastContainer pauseOnFocusLoss={false} hideProgressBar={true} />
      </SideNavbar>
    </BrowserRouter>
  );
}
