import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/authContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext);

  console.log(currentUser);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">The Place of Your Dream - EasyCar</h1>
          <p>
          "Welcome to EasyCar, your premier online marketplace for buying and selling vehicles. Whether you're looking to find your dream car or sell your current one, our platform offers a seamless, user-friendly experience. Join our community today and discover how simple car trading can be!"
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>5+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Vehicle Sold</h2>
            </div>
            <div className="box">
              <h1>5000+</h1>
              <h2>Vehicles Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
