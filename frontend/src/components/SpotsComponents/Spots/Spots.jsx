import { useEffect } from "react";
import { getSpotsThunk } from "../../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import s from "./Spots.module.css";

const Spots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spots = useSelector((state) => state.spots.allSpots);

  useEffect(() => {
    dispatch(getSpotsThunk());
  }, [dispatch]);

  console.log(spots);

  const decimal = (number) => {
    const string = String(number);
    if (!string.includes(".")) {
      return string + ".0";
    } else {
      return string;
    }
  };

  return (
    <div className={s.spots_page}>
      <div className={s.spots_container}>
        {spots.map(
          ({ id, previewImage, city, state, avgRating, price, name }) => {
            return (
              <div
                key={id}
                className={s.spot}
                onClick={() => {
                  navigate(`/spots/${id}`);
                }}
              >
                <div className={s.tooltip}>{name}</div>
                <div className={s.preview_image_container}>
                  <img
                    className={s.spot_preview_image}
                    src={previewImage}
                    alt={previewImage}
                  />
                </div>
                <div className={s.spot_top_bar}>
                  <span className={s.spot_location}>
                    {city}, {state}
                  </span>
                  {avgRating && (
                    <div className={s.spot_review}>
                      <FaStar />
                      {decimal(avgRating)}
                    </div>
                  )}
                  {!avgRating && (
                    <div className={s.spot_review}>
                      <FaStar /> New
                    </div>
                  )}
                </div>
                <div className={s.spot_bar_bottom}>
                  <span className={s.price}>${price}</span> night
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Spots;