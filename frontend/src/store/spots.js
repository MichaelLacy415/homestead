import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/GET_SPOTS";
const GET_SPECIFIC_SPOT = "spots/GET_SPECIFIC_SPOT";

const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots,
  };
};

const getSpecificSpot = (spot) => {
  return {
    type: GET_SPECIFIC_SPOT,
    spot,
  };
};


export const getSpotsThunk = () => async (dispatch) => {
  const jsonResponse = await csrfFetch("/api/spots");

  if (jsonResponse.ok) {
    const response = await jsonResponse.json();
    dispatch(getSpots(response.Spots));
  }
};

export const getSpecificSpotThunk = (spotId) => async (dispatch) => {
  const jsonResponse = await csrfFetch(`/api/spots/${spotId}`);

  if (jsonResponse.ok) {
    const response = await jsonResponse.json();
    dispatch(getSpecificSpot(response));
  }
};

export const createSpotThunk = (spot) => async (dispatch) => {
  const jsonResponse = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  });

  const response = await jsonResponse.json();

  if (jsonResponse.ok) {
    dispatch(getSpecificSpot(response));
  }

  return response;
};

export const updateSpotThunk = (spotId, spot) => async (dispatch) => {
  const jsonResponse = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  });

  const response = await jsonResponse.json();

  if (response.message !== "Bad request") {
    console.log(response)
    dispatch(getSpecificSpotThunk(spotId));
  }

  return response;
};


const initialState = { allSpots: [], seenSpots: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOTS: {
      return { ...state, allSpots: action.spots };
    }
    case GET_SPECIFIC_SPOT: {
      return {
        ...state,
        seenSpots: {
          ...state.seenSpots,
          [action.spot.id]: action.spot,
        },
      };
    }
    default:
      return state;
  }
};

export default spotsReducer;