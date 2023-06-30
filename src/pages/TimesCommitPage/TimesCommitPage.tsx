import { TextInput } from "@mantine/core";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import "./timesCommitPage.scss";
export const TimesCommitPage = () => {
  return (
    <PageContainer className="times-commit-page">
      <h1>Home</h1>
      <div className="times-commit-page__inputs">
        <TextInput label="Name" placeholder="name" />
      </div>
      <div className="times-commit-page__times"></div>
    </PageContainer>
  );
};
