import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Session } from "@supabase/supabase-js";
import { Apply } from "pages/Apply/Apply";
import { CreateShifts } from "pages/Home/CreateShifts/CreateShifts";
import { Plan } from "pages/Plan/Plan";
import { Shifts } from "pages/Shifts/Shifts";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "util/context";
import "./colors.scss";
import { SideNavbar } from "./components/Navbar/SideNavbar";
import { supabase } from "./config";
import { User, isAtLeastPlaner } from "./models/User";
import { Home } from "./pages/Home/Home";
import { LoginPage } from "./pages/Login/Login";
import { APPLY, CREATESHIFTS, HOME, LOGIN, PLAN, SHIFTS } from "./routes";
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
      <UserContext.Provider value={user}>
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
            <Notifications position="top-right" />
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
                    <Route index path={SHIFTS} element={<Shifts />}></Route>
                    <Route index path={APPLY} element={<Apply />}></Route>
                    {isAtLeastPlaner(user?.role) && (
                      <>
                        <Route index path={PLAN} element={<Plan />}></Route>
                        <Route
                          index
                          path={CREATESHIFTS}
                          element={<CreateShifts />}
                        ></Route>
                      </>
                    )}
                  </>
                )}
              </Routes>
            </div>
          </MantineProvider>
        </SideNavbar>
      </UserContext.Provider>
    </BrowserRouter>
  );
}
