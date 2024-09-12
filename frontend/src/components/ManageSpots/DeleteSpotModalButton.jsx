import { useState, useEffect } from "react";
import OpenModalMenuItem from "../Modal/OpenModalMenuItem";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/session";
import s from "./DeleteSpotModal.module.css";

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <div className={s.delete_spot_modal_button}>
      <h1>Are you sure you want to remove this spot from the listings?</h1>
      <button
        className={s.yes}
        onClick={async () => {
          const response = await dispatch(deleteSpotThunk(spotId));
          console.log(response)
          if (response || response.message === "Successfully deleted") {
            closeModal();
          }
        }}
      >
        Yes (Delete Spot)
      </button>
      <button className={s.no} onClick={closeModal}>
        No (Keep Spot)
      </button>
    </div>
  );
}

function DeleteSpotModalButton({ spotId }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  return (
    <button onClick={toggleMenu}>
      <OpenModalMenuItem
        itemText="Delete"
        onItemClick={closeMenu}
        modalComponent={<DeleteSpotModal spotId={spotId} />}
      />
    </button>
  );
}

export default DeleteSpotModalButton;