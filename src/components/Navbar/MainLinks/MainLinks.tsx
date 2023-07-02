import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { Role } from "models/User";
import React from "react";
import { useNavigate } from "react-router";
import { APPLY, HOME, LOGIN, PLAN, SHIFTS } from "routes";
import {
  CalendarTime,
  GitPullRequest,
  Home,
  Login,
  Messages,
} from "tabler-icons-react";
import { useUserContext } from "util/context";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  route: string;
}

function MainLink({ icon, color, label, route }: MainLinkProps) {
  const navigate = useNavigate();

  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      onClick={() => navigate(route)}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
  {
    icon: <Home />,
    color: "green",
    label: "Home",
    route: HOME,
    acces: [Role.EMPLOYEE, Role.OWNER, Role.PLANER],
  },
  {
    icon: <GitPullRequest size="1rem" />,
    color: "blue",
    label: "Schichten",
    route: SHIFTS,
    acces: [Role.EMPLOYEE, Role.OWNER, Role.PLANER],
  },
  {
    icon: <Messages size="1rem" />,
    color: "violet",
    label: "Bewerben",
    route: APPLY,
    acces: [Role.EMPLOYEE, Role.OWNER, Role.PLANER],
  },
  {
    icon: <CalendarTime />,
    color: "green",
    label: "Planen",
    route: PLAN,
    acces: [Role.OWNER, Role.PLANER],
  },
];
const noUserData = [
  {
    icon: <Login />,
    color: "green",
    label: "Login",
    route: LOGIN,
  },
];

export function MainLinks() {
  const user = useUserContext();
  const dataToUse = user
    ? data.filter((link) => link.acces.includes(user.role))
    : noUserData;
  const links = dataToUse.map((link) => (
    <MainLink {...link} key={link.label} />
  ));
  return <div>{links}</div>;
}
