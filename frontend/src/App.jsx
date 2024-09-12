import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import Spots from "./components/SpotsComponents/Spots/Spots";
import Spot from "./components/SpotsComponents/Spot/Spot";
import CreateSpotForm from "./components/SpotsComponents/CreateSpotForm/CreateSpotForm"
import ManageSpots from "./components/ManageSpots/ManageSpots";
import UpdateSpot from "./components/UpdateSpots/UpdateSpot"

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Spots />,
      },
      {
        path: "/spots/:spotId",
        element: <Spot />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <UpdateSpot />
      },
      {
        path: "/spots/new",
        element: <CreateSpotForm />,
      },
      {
        path: "/spots/current",
        element: <ManageSpots />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;