import React from "react";
import { UserSelect } from "./components/UserSelect";
import { ScheduleBoard } from "./components/ScheduleBoard";
import { useScheduleStore } from "./store/scheduleStore";

function App() {
  const currentUser = useScheduleStore((state) => state.currentUser);

  return (
    <div className="w-full">
      {currentUser ? <ScheduleBoard /> : <UserSelect />}
    </div>
  );
}

export default App;
