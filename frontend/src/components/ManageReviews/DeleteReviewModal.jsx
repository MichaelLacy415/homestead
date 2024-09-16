import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/session";
import s from "./DeleteReviewModal.module.css";

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <div className={s.delete_spot_modal_button}>
      <h1>Are you sure you want to remove this Review?</h1>
      <button
        className={s.yes}
        onClick={async () => {
          console.log(reviewId);
          const response = await dispatch(deleteReviewThunk(reviewId, spotId));
          if (response.message !== "Bad Request") {
            closeModal();
          }
        }}
      >
        Yes (Delete Review)
      </button>
      <button className={s.no} onClick={closeModal}>
        No (Keep Review)
      </button>
    </div>
  );
}

export default DeleteReviewModal;