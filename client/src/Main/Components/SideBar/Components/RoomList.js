import React, { useContext, useRef } from "react";
import RoomItem from "./RoomItem";
import AddRoomBtn from "./AddRoomBtn";
import { UserContext } from "../../../../contexts/UserContextProvider";

const RoomList = ({ roomList }) => {
  const { darkMode } = useContext(UserContext);

  const roomsEndRef = useRef(null);

  const scrollToBottom = () => {
    roomsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className={`flex flex-col overflow-auto overflow-x-hidden h-full w-full  ${
        darkMode ? "scrollbar-dark" : "scrollbar"
      }`}
    >
      {roomList.map((element) => (
        <RoomItem room={element} key={element._id} />
      ))}
      <AddRoomBtn scrollToBottom={scrollToBottom} />
      <div ref={roomsEndRef} />
    </section>
  );
};

export default RoomList;
