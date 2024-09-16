import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReviewThunk } from "../../store/reviews";
import s from "./CreateReview.module.css";

function CreateReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      createReviewThunk(spotId, { review, stars })
    );

    if (response.message !== "Bad Request") {
      closeModal();
    } else {
      setErrors(response.errors);
    }
  };

  const starColor = (num) => {
    return stars >= num ? "rgb(0, 0, 0)" : "rgb(200, 200, 200)";
  };

  return (
    <form className={s.review_form} onSubmit={handleSubmit}>
      <h1>How was your Stay?</h1>

      <div className={s.line}>
        <textarea
          value={review}
          onChange={(e) => {
            e.preventDefault();
            setReview(e.target.value);
          }}
          placeholder="Leave your review here..."
        />
        {errors.review && <div className={s.error}>{errors.review}</div>}
      </div>

      <div className={s.line}>
        <div className={s.stars}>
          <div
            className={s.star1}
            onClick={() => {
              setStars(1);
            }}
            style={{ color: starColor(1) }}
          >
            <FaStar />
          </div>
          <div
            className={s.star2}
            onClick={() => {
              setStars(2);
            }}
            style={{ color: starColor(2) }}
          >
            <FaStar />
          </div>
          <div
            className={s.star3}
            onClick={() => {
              setStars(3);
            }}
            style={{ color: starColor(3) }}
          >
            <FaStar />
          </div>
          <div
            className={s.star4}
            onClick={() => {
              setStars(4);
            }}
            style={{ color: starColor(4) }}
          >
            <FaStar />
          </div>
          <div
            className={s.star5}
            onClick={() => {
              setStars(5);
            }}
            style={{ color: starColor(5) }}
          >
            <FaStar />
          </div>
        </div>
        {errors.stars && <div className={s.error}>Select star rating</div>}
      </div>
      <button
        type="submit"
        disabled={stars < 1 || stars > 5 || review.length < 10}
      >
        Submit Your Review
      </button>
    </form>
  );
}

export default CreateReviewModal;