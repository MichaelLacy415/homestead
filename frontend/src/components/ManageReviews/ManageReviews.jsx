import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUserReviewsThunk } from "../../store/session";
import DeleteReviewModalButton from "./DeleteReviewModalButton";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.session.userReviews);

  useEffect(() => {
    dispatch(loadUserReviewsThunk());
  }, [dispatch]);

  return (
    <div className="manage-reviews">
      <h2>Manage Reviews</h2>
      {reviews.length ? (
        reviews.map((review) => (
          <div className="spot" key={review.id}>
            <span>{review.review}</span>
            <button>Update</button>
            <DeleteReviewModalButton reviewId={review.id} />
          </div>
        ))
      ) : (
        <div>No Spots Found</div>
      )}
    </div>
  );
};

export default ManageSpots;