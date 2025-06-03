import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useNavigate } from "react-router-dom";
import UserCard from "../components/UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      if (feed) {
        return;
      }
      const res = await axios.get(BASE_URL + "/feed");
      dispatch(addFeed(res.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      }
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [feed]);

  if (!feed) return;

  if (feed.length <= 0)
    return (
      <h1 className="text-center font-bold my-10 text-2xl">
        No New User Found!!
      </h1>
    );
  return (
    feed && (
      <div>
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
