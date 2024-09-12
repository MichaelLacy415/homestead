import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const LOAD_USER_SPOTS = "session/LOAD_USER_SPOTS";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

const loadUserSpots = (spots) => {
  return { type: LOAD_USER_SPOTS, spots };
};



export const loadUserSpotsThunk = () => async (dispatch) => {
  const jsonResponse = await csrfFetch("/api/spots/current");

  const { Spots } = await jsonResponse.json();

  if (jsonResponse.ok) {
    dispatch(loadUserSpots(Spots));
  }
};


export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const jsonResponse = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await jsonResponse.json();
  dispatch(setUser(data.user));
  return data;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  console.log(data)
  if (!data.errors) {
    dispatch(setUser(data.user));
  }
  return data;
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const jsonResponse = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  const response = await jsonResponse.json();

  dispatch(loadUserSpotsThunk());

  return response;
};


const initialState = { user: null, userSpots: [], userReviews: [] };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null, userSpots: [] };
    case LOAD_USER_SPOTS: {
      return { ...state, userSpots: action.spots };
    }
    default:
      return state;
  }
};

export default sessionReducer;