import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"
import UploadWidget from "../../components/uploadWidget/uploadWidget.jsx"
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequests";


function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          year: parseInt(inputs.year),
          seats: parseInt(inputs.seats),
          type: inputs.type,
          vehicletype: inputs.vehicletype,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          runningcondition: inputs.runningcondition,
          interiorcondition: inputs.interiorcondition,
          exteriorcondition: inputs.exteriorcondition,
          bootcapacity: parseInt(inputs.bootcapacity),
          seriusaccidents: parseInt(inputs.seriusaccidents),
          repair: parseInt(inputs.repair),
          scratchedlevel: parseInt(inputs.scratchedlevel),
        },
      });
      navigate("/"+res.data.id);
      console.log(res);
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" placeholder="Ex: Colombo 11"/>
            </div>
            <div className="item">
              <label htmlFor="year">Build Year</label>
              <input min={1} id="year" name="year" type="number" placeholder="Ex: 2012"/>
            </div>
            <div className="item">
              <label htmlFor="seats">Number of Seats</label>
              <input min={1} id="seats" name="seats" type="number" placeholder="Ex: 5"/>
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" placeholder="Show Your Location on Map"/>
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" placeholder="Show Your Location on Map"/>
            </div>
            <div className="item">
              <label htmlFor="type">Advertisement Type</label>
              <select name="type">
              <option value="buy" defaultChecked>Sell</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">vehicletype</label>
              <select name="vehicletype">
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="SUV">SUV</option>
                <option value="Pickup">Pickup</option>
                <option value="Lorry">Lorry</option>
                <option value="Bike">Bike</option>
                <option value="Bus">Bus</option>
                <option value="Construction">Construction</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="runningcondition">Running Condition</label>
              <select name="runningcondition">
                <option value="brandnew">Brand New</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="interiorcondition">Interior Condition</label>
              <select name="interiorcondition">
                <option value="brandnew">Brand New</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="exteriorcondition">Exterior Condition</label>
              <select name="exteriorcondition">
                <option value="brandnew">Brand New</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="bootcapacity">Total Bootcapacity (ltr)</label>
              <input min={0} id="bootcapacity" name="bootcapacity" type="number" placeholder="Boot Capacity in Leters"/>
            </div>
            <div className="item">
              <label htmlFor="seriusaccidents">Accident Records</label>
              <input min={0} id="seriusaccidents" name="seriusaccidents" type="number" placeholder="How Many Accidents have Happened"/>
            </div>
            <div className="item">
              <label htmlFor="repair">Repair</label>
              <input min={0} id="repair" name="repair" type="number" placeholder="How May Repairs have Done"/>
            </div>
            <div className="item">
              <label htmlFor="scratchedlevel">Scratched Level</label>
              <input min={0} max={10} id="scratchedlevel" name="scratchedlevel" type="number" placeholder="Give a Number 0-10"/>
            </div>
            <button className="sendButton">Add</button>
            {error && <span>error</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;