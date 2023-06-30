interface IPageHeaderProps {
  title: string;
}

export const PageHeader = (props: IPageHeaderProps) => {
  return (
    <div className="page-header">
      <h2>{props.title}</h2>
    </div>
  );
};
