import {
  AppShell,
  Burger,
  Button,
  Header,
  MediaQuery,
  Navbar,
  useMantineTheme,
} from "@mantine/core";
import { supabase } from "config";
import { useState } from "react";
import { Logout, User } from "tabler-icons-react";
import { useUserContext } from "util/context";
import { Logo } from "./Logo/Logo";
import { MainLinks } from "./MainLinks/MainLinks";
import "./sideNavbar.scss";
interface SideNavbarProps {
  children: React.ReactNode;
}

export function SideNavbar(props: SideNavbarProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const user = useUserContext();
  // Same can be applied to Aside component with Aside.Section component
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    window.location.reload();
    if (error) {
      console.log(error);
    }
  };
  return (
    <AppShell
      fixed={false}
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow mt="xs">
            <MainLinks />
          </Navbar.Section>
          {user && (
            <Navbar.Section className="side-navbar-buttons-bottom">
              <Button>
                <User />
              </Button>
              <Button color="red">
                <Logout onClick={handleLogout} />
              </Button>
            </Navbar.Section>
          )}
        </Navbar>
      }
      // footer={
      //   <Footer height={60} p="md">
      //     Application footer
      //   </Footer>
      // }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Logo />
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <div>Schichtplaner</div>
          </div>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {props.children}
    </AppShell>
  );
}
