import { useState, useEffect } from "react";
import OpenModalMenuItem from "../Modal/OpenModalMenuItem";
import CreateReviewModal from "./CreateReviewModal";

function CreateReviewModalButton({ spotId }) {
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
        itemText="Create Review"
        onItemClick={closeMenu}
        modalComponent={<CreateReviewModal spotId={spotId} />}
      />
    </button>
  );
}

export default CreateReviewModalButton;