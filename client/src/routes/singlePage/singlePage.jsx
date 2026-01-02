import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext"
import apiRequest from "../../lib/apiRequests";

function SinglePage() {

  const post = useLoaderData();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(post.isSaved)
  const { currentUser } = useContext(AuthContext);

  const handleSave = async () => {
    setSaved((prev) => !prev);
    if (!currentUser) {
      navigate("/login");
    }
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err)
      setSaved((prev) => !prev);
    }
  }

  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
    } else {
      navigate("/profile", { state: { receiverId: post.user.id } });
    }
  }

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">Rs. {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.postDetail.desc),
            }}></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/engine.png" alt="" />
              <div className="featureText">
                <span>Engine Running Condition</span>
                <p>{post.postDetail.runningcondition}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/interior.png" alt="" />
              <div className="featureText">
                <span>Interior Condition</span>
                <p>{post.postDetail.interiorcondition}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/exterior.png" alt="" />
              <div className="featureText">
                <span>Exterior Condition</span>
                <p>{post.postDetail.exteriorcondition}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/seat.png" alt="" />
              <h4>Seats : </h4>
              <span>{post.seats} Seats</span>
            </div>
            <div className="size">
              <img src="/boot.png" alt="" />
              <h4>Boot Capacity : </h4>
              <span>{post.postDetail.bootcapacity} liters</span>
            </div>
          </div>
          <p className="title">Honest Review</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/accident.png" alt="" />
              <div className="featureText">
                <span>Accidents</span>
                <p>{post.postDetail.seriusaccidents}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Damage Repairs</span>
                <p>{post.postDetail.repair}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/scratch.png" alt="" />
              <div className="featureText">
                <span>Paint Damage</span>
                <p>{post.postDetail.scratchedlevel} out of 10</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handleSendMessage}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button onClick={handleSave} style={{
              backgroundColor: saved ? "#4ccaf049" : "#E7F6F9"
            }}>
              <img src="/save.png" alt="" />
              {saved ? "Post Saved ✔" : "Save the Vehicle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
