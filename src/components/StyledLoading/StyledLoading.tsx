import { Loader } from "@mantine/core";
import "./styledLoading.scss";
export const StyledLoading = () => {
  return (
    <div className="loader-box">
      <Loader color="green" className="loader" />
    </div>
  );
};
