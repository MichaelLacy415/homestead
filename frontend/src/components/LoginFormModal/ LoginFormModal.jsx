import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import s from "./LoginForm.module.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential, password }))
      .then((res) => {
        console.log(res);
        if (res.message === "Invalid credentials") {
          setErrors({ credentials: "Invalid credentials" });
        } else {
          closeModal();
        }
      })
      .catch(async (res) => {
        const data = await res.json();
        console.log("data", data);
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const logInDemo = (e) => {
    e.preventDefault();

    return dispatch(
      sessionActions.login({ credential: "DemoProfile", password: "password" })
    ).then(closeModal);
  };

  const disableButton = () => {
    return !(credential.length >= 4 && password.length >= 6);
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <h2>Log In</h2>

      <input
        type="text"
        value={credential}
        onChange={(e) => setCredential(e.target.value)}
        placeholder="Username or Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {errors.credentials && (
        <span style={{ color: "red" }}>
          The provided credentials were invalid
        </span>
      )}
      {errors.credential && <p>{errors.credential}</p>}
      <button type="submit" disabled={disableButton()}>
        Log In
      </button>
      <div onClick={logInDemo} className={s.demo_user}>
        Demo User
      </div>
    </form>
  );
}

export default LoginFormModal;