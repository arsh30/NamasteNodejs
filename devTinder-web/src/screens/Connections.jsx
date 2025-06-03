import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections");
      //   console.log(res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <h1 className="text-center font-bold text-2xl">No Connections Found!!</h1>
    );

  return (
    <div>
      <h1 className="text-center text-3xl font-semibold my-8">Connections</h1>

      {connections.map((elem, index) => {
        const { firstName, lastName, photoUrl, gender, age, about } = elem;
        return (
          <div
            key={index}
            className="my-8 p-3 w-[40vw] flex gap-8 bg-base-300 rounded-2xl"
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
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
