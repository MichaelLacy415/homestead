import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "../Modal/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useNavigate } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import s from "./Navigation.module.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  return (
    <>
      <button onClick={toggleMenu} className={s.profile_button}>
        <HiOutlineBars3 />
        <div>
          <FaUserCircle />
        </div>
      </button>
      {showMenu && (
        <div className={s.drop_down_menu} ref={ulRef}>
          {user ? (
            <>
              <div className={s.drop_down_top}>
                <div>Hello, {user.firstName}</div>
                <div>{user.email}</div>
              </div>
              <div className={s.drop_down_middle}>
                <li
                  onClick={() => {
                    navigate("/spots/current");
                    closeMenu();
                  }}
                >
                  Manage Spots
                </li>
              </div>
              <div className={s.logout_button}>
                <button onClick={logout}>Log Out</button>
              </div>
            </>
          ) : (
            <>
              <div className={s.drop_down_top}>
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </div>
              <div className={s.drop_down_bottom}>
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ProfileButton;