import { createSpotThunk } from "../../../store/spots";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import s from "./SpotForm.module.css";

const NewSpotForm = ({ previousData }) => {
  if (!previousData) previousData = {};
  const [country, setCountry] = useState(previousData.country || "");
  const [lng, setLng] = useState(previousData.lng || "");
  const [address, setAddress] = useState(previousData.address || "");
  const [state, setState] = useState(previousData.state || "");
  const [lat, setLat] = useState(previousData.lat || "");
  const [city, setCity] = useState(previousData.city || "");
  const [description, setDescription] = useState(
    previousData.description || ""
  );
  const [price, setPrice] = useState(previousData.price || "");
  const [name, setName] = useState(previousData.name || "");
  const [previewImage, setPreviewImage] = useState(
    previousData.previewImage || ""
  );
  const [img1, setImg1] = useState(previousData.img1 || "");
  const [img2, setImg2] = useState(previousData.img2 || "");
  const [img3, setImg3] = useState(previousData.img3 || "");
  const [img4, setImg4] = useState(previousData.img4 || "");

  const [errors, setErrors] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createInput = (type, value, setFunction, placeholder) => {
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => {
          e.preventDefault();
          setFunction(e.target.value);
        }}
        placeholder={placeholder}
      />
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      createSpotThunk({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        previewImage,
        img1,
        img2,
        img3,
        img4,
      })
    );

    if (response.message == "Bad Request") {
      setErrors(response.errors);
    } else {
      navigate(`/spots/${response.id}`);
    }
  };

  return (
    <div className={s.spot_form_container}>
      <div className={s.spot_form}>
        <h2>Create a new Spot</h2>
        <form onSubmit={handleSubmit}>
          <div className={s.section}>
            <h3>{"Spot Location?"}</h3>
            <p>
                Guests will receive your exact address only after they have made a reservation.
            </p>

            <div className={s.line}>
              <div className={s.input_container}>
                <div className={s.label}>
                  Country <span className={s.error}>{errors.country}</span>
                </div>
                <div className={s.input}>
                  {createInput("text", country, setCountry, "Country")}
                </div>
              </div>
            </div>

            <div className={s.line}>
              <div className={s.input_container}>
                <div className={s.label}>
                  Street Address{" "}
                  <span className={s.error}>{errors.address}</span>
                </div>
                <div className={s.input}>
                  {createInput("text", address, setAddress, "Street Address")}
                </div>
              </div>
            </div>

            <div className={s.line}>
              <div className={s.input_container}>
                <div className={s.label}>
                  City <span className={s.error}>{errors.city}</span>
                </div>
                <div className={s.input}>
                  {createInput("text", city, setCity, "City")}
                </div>
              </div>
              <div className={s.separator}>
                <span>,</span>
              </div>
              <div className={s.input_container}>
                <div className={s.label}>
                  State <span className={s.error}>{errors.state}</span>
                </div>
                <div className={s.input}>
                  {createInput("text", state, setState, "State")}
                </div>
              </div>
            </div>

            <div className={s.line}>
              <div className={s.input_container}>
                <div className={s.label}>
                  Latitude <span className={s.error}>{errors.lat}</span>
                </div>
                <div className={s.input}>
                  {createInput("number", lat, setLat, "Latitude")}
                </div>
              </div>
              <div className={s.separator}>
                <span>,</span>
              </div>
              <div className={s.input_container}>
                <div className={s.label}>
                  Longitude <span className={s.error}>{errors.lng}</span>
                </div>
                <div className={s.input}>
                  {createInput("number", lng, setLng, "Longitude")}
                </div>
              </div>
            </div>
          </div>

          <div className={s.section}>
            <h3>Describe your place to guests</h3>

            <p>
                Highlight the top features of your space, any unique amenities such as high-speed WiFi or parking, and share what you love about the neighborhood.
            </p>

            <div className={s.line}>
              <div className={s.input_container}>
                <div className={s.input}>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      e.preventDefault();
                      setDescription(e.target.value);
                    }}
                    placeholder="Please write at least 30 characters"
                  />
                  <span className={s.error}>{errors.description}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={s.section}>
            <h3>Create a title for your spot</h3>
            <p>
              Catch guest{"'"}s attention with a spot that highlights what makes
              your place special
            </p>
            <div className={s.line}>
              <div className={s.input_container}>
                <div className={s.input}>
                  {createInput("text", name, setName, "Name of your spot")}
                </div>
                <span className={s.error}>{errors.name}</span>
              </div>
            </div>
          </div>

          <div className={s.section}>
            <h3>Set a base price for your spot</h3>
            <p>
                Offering competitive pricing can make your listing more attractive and improve its ranking in search results.
            </p>

            <div className={s.line}>
              <div className={s.input_container}>
                <div className={s.input}>
                  <div className={s.price_input}>
                    ${" "}
                    {createInput(
                      "number",
                      price,
                      setPrice,
                      "Price per night (USD)"
                    )}
                  </div>
                  <span className={s.error}>{errors.price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={s.section}>
            <h3>Make your spot POP! with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>
            <div className={s.line}>
              <div className={s.input_container}>
                {createInput(
                  "text",
                  previewImage,
                  setPreviewImage,
                  "Preview Image URL"
                )}
                <span className={s.error}>{errors.previewImage}</span>
              </div>
            </div>
            <div className={s.line}>
              <div className={s.input_container}>
                {createInput("text", img1, setImg1, "Image URL")}
                <span className={s.error}>{errors.img1}</span>
              </div>
            </div>
            <div className={s.line}>
              <div className={s.input_container}>
                {createInput("text", img2, setImg2, "Image URL")}
                <span className={s.error}>{errors.img2}</span>
              </div>
            </div>
            <div className={s.line}>
              <div className={s.input_container}>
                {createInput("text", img3, setImg3, "Image URL")}
                <span className={s.error}>{errors.img3}</span>
              </div>
            </div>
            <div className={s.line}>
              <div className={s.input_container}>
                {createInput("text", img4, setImg4, "Image URL")}
                <span className={s.error}>{errors.img4}</span>
              </div>
            </div>
          </div>
          <div className={s.button_container}>
            <button>Create Spot</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSpotForm;