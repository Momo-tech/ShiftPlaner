import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router";
import { APPLY, HOME, SHIFTS } from "routes";
import { GitPullRequest, Home, Messages } from "tabler-icons-react";

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
  },
  {
    icon: <GitPullRequest size="1rem" />,
    color: "blue",
    label: "Schichten",
    route: SHIFTS,
  },
  {
    icon: <Messages size="1rem" />,
    color: "violet",
    label: "Bewerben",
    route: APPLY,
  },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
