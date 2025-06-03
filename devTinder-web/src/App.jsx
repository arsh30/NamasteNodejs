import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./screens/Body";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./screens/Feed";
import Connections from "./screens/Connections";
import Requests from "./screens/Requests";

const App = () => {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Requests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
