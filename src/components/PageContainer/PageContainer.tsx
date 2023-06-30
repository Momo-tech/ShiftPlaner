import { clsx } from "@mantine/core";
import "./pageContainer.scss";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer(props: PageContainerProps) {
  return (
    <div className={clsx("page-container", props.className)}>
      {props.children}
    </div>
  );
}
