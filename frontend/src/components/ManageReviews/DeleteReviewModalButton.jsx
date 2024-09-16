import { useState, useEffect } from "react";
import OpenModalMenuItem from "../Modal/OpenModalMenuItem";
import DeleteReviewModal from "./DeleteReviewModal";

function DeleteReviewModalButton({ reviewId, spotId }) {
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
        modalComponent={
          <DeleteReviewModal reviewId={reviewId} spotId={spotId} />
        }
      />
    </button>
  );
}

export default DeleteReviewModalButton;