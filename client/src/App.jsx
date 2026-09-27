import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HotelList from "./views/HotelList";
import HotelFormPage from "./views/HotelFormPage";
import HotelDetails from "./views/HotelDetails";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<HotelList />}
        />

        <Route
          path="/add"
          element={<HotelFormPage />}
        />

        <Route
          path="/edit/:id"
          element={<HotelFormPage />}
        />

        <Route
          path="/hotel/:id"
          element={<HotelDetails />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;