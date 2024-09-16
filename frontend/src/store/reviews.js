import { csrfFetch } from "./csrf";
import { getSpecificSpotThunk } from "./spots";

const GET_SPOT_REVIEWS = "reviews/GET_SPOT_REVIEWS";


const getSpotReviews = (spotId, reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    reviews,
    spotId,
  };
};


export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
  const jsonResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (jsonResponse.ok) {
    const { Reviews } = await jsonResponse.json();
    dispatch(getSpotReviews(spotId, Reviews));
  }
};

export const createReviewThunk = (spotId, review) => async (dispatch) => {
  const jsonResponse = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  const response = await jsonResponse.json();

  if (response.message !== "Bad Request") {
    dispatch(getSpotReviewsThunk(spotId));
    dispatch(getSpecificSpotThunk(spotId));
  }

  return response;
};


const initialState = { spotReviews: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOT_REVIEWS: {
      return {
        ...state,
        spotReviews: {
          ...state.spotReviews,
          [action.spotId]: action.reviews,
        },
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;