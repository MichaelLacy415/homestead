import { useEffect } from "react";
import { loadUserSpotsThunk } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import s from "./ManageSpots.module.css";
import DeleteSpotModalButton from "./DeleteSpotModalButton";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spots = useSelector((state) => state.session.userSpots);

  useEffect(() => {
    dispatch(loadUserSpotsThunk());
  }, [dispatch]);

  if (!spots.length) {
    return (
      <button
        className={s.create_spot_button}
        onClick={() => navigate("/spots/new")}
      >
        Create a new Spot
      </button>
    );
  }

  const decimal = (number) => {
    const string = String(number);
    if (!string.includes(".")) {
      return string + ".0";
    } else {
      return string;
    }
  };

  return (
    <>
      <h1>Manage Spots</h1>
      <div className={s.spots_page}>
        <div className={s.spots_container}>
          {spots.map(
            ({ name, id, previewImage, city, state, avgRating, price }) => {
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
                  <div className={s.modal_buttons}>
                    <DeleteSpotModalButton spotId={id} />
                    <div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/spots/${id}/edit`);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default ManageSpots;