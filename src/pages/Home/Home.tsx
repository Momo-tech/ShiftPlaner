import { Calender } from "../../components/Calender/Calender";
import "./home.scss";
export const Home = () => {
  return (
    <div>
      <h2>Übersicht</h2>
      <div className="home-page-grid">
        <div className="home-page-grid__calender">
          <div className="calender-back-groud-color">
            <Calender />
          </div>
        </div>
        <div className="home-page-grid__info">Info Placeholder</div>
      </div>
    </div>
  );
};
