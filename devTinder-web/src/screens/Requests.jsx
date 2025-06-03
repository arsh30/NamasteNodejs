/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/connectionRequestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved");
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const handleReviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {}
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!requests) return;

  if (requests.length === 0)
    return (
      <h1 className="text-center font-semibold mt-5"> No requests Found</h1>
    );

  return (
    <div>
      <h1 className="text-center text-3xl font-semibold my-8">
        Connection Requests
      </h1>

      {requests.map((elem, index) => {
        const { firstName, lastName, photoUrl, gender, age, about } =
          elem.fromUserId;
        return (
          <div
            key={index}
            className="my-8 p-3 w-[40vw] flex gap-3 bg-base-300 justify-between items-center rounded-2xl"
          >
            <div>
              <img
                className="w-20 h-20 rounded-full "
                src={photoUrl}
                alt="photo"
              />
            </div>

            <div>
              <p className="font-semibold text-lg">{`${firstName} ${lastName}`}</p>
              <p>{gender && age && `${gender}, ${age}`}</p>
              <p className="text-sm">{about}</p>
            </div>

            <div className="flex gap-4">
              <button
                className="btn btn-primary"
                onClick={() => handleReviewRequest("rejected", elem._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleReviewRequest("accepted", elem._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
