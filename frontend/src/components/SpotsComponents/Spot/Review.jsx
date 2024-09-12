import s from "./Spot.module.css";
import { FaStar } from "react-icons/fa";


const Review = ({ reviewObj }) => {
  const {
    User: { firstName, lastName },
    stars,
    createdAt,
    review,
  } = reviewObj;

  const year = createdAt.split("-")[0];
  const month = createdAt.split("-")[1];

  const reviewStars = [];

  for (let i = 0; i < stars; i++) {
    reviewStars.push(<FaStar />);
  }

  const dates = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className={s.user_review} >
      <div className={s.stars}>{reviewStars}</div>
      <div className={s.reviewer_name}>
        {firstName} {lastName}
      </div>
      <div className={s.review_date}>
        {dates[Number(month)]} {year}
      </div>
      <div className={s.review_text}>{review}</div>
    </div>
  );
};

export default Review;