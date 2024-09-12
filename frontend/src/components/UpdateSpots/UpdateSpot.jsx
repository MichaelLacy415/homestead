import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import s from "./UpdateSpot.module.css";
import { updateSpotThunk } from "../../store/spots";
import { loadUserSpotsThunk } from "../../store/session";

const UpdateSpot = () => {
  const { spotId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userSpots = useSelector((state) => state.session.userSpots);

  useEffect(() => {
    const {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      previewImage,
    } = userSpots.find((spot) => spot.id === Number(spotId)) || {};
    setCountry(country);
    setAddress(address);
    setCity(city);
    setState(state);
    setLat(lat);
    setLng(lng);
    setDescription(description);
    setName(name);
    setPrice(price);
    setPreviewImage(previewImage);
  }, [userSpots, spotId]);

  useEffect(() => {
    dispatch(loadUserSpotsThunk());
  }, [dispatch]);

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState("");

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
      updateSpotThunk(spotId, {
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
      })
    );

    if (response.message == "Bad Request") {
      setErrors(response.errors);
    } else {
      navigate(`/spots/${response.id}`);
    }
  };

  // if (!previousData) return null;

  return (
    <div className={s.spot_form_container}>
      <div className={s.spot_form}>
        <h2>Update your Spot</h2>
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
                    placeholder={description}
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
          </div>
          <div className={s.button_container}>
            <button>Update Spot</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSpot;