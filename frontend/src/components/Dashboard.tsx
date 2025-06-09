import { useEffect, useState } from "react";
import { completeTask, revertTask, getAllTasks } from "../api/TaskApi";
import type { GetAllTasksResponse } from "../types/ApiDTO";
import "../css/Dashboard.css";

interface props {
  token: string;
}

const Dashboard: React.FC<props> = ({ token }) => {
  const [taskList, setTaskList] = useState<GetAllTasksResponse>();
  const [error, setError] = useState<String>();
  const [isUpdatedTrigger, setIsUpdatedTrigger] = useState<Boolean>(false);

  useEffect(() => {
    const get = async () => {
      try {
        const resp = await getAllTasks();
        setTaskList(resp);
      } catch (err) {
        setError("Task list could not be retrieved.");
      }
    };

    console.log("token: ", token);

    if (!token) {
      return;
    }

    get();
  }, [token, isUpdatedTrigger]);

  const handleComplete = async (id: number) => {
    try {
      await completeTask(id);
      setIsUpdatedTrigger((ut) => !ut);
    } catch (err) {
      setError(`Task id = ${id} could not be completed`);
    }
  };

  const handleRevert = async (id: number) => {
    try {
      await revertTask(id);
      setIsUpdatedTrigger((ut) => !ut);
    } catch (err) {
      setError(`Task id = ${id} could not be completed`);
    }
  };

  if (!taskList) return null;

  const getTaskTable = (
    taskList: GetAllTasksResponse,
    title: String,
    buttonName: String,
    handleFunc: (id: number) => void
  ) => {
    return (
      <div className="flex column">
        <h3>{title}</h3>
        <div className="tasks flex column gap-10">
          {taskList.map((task) => (
            <div className="task-row flex space-between center-y" key={task.id}>
              <div className="title">{task.title}</div>
              <div className="due_date">{task.due_date}</div>
              <button onClick={(e) => handleFunc(task.id)}>{buttonName}</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="task-categories flex center-x gap-10">
        {getTaskTable(
          taskList.filter((task) => !task.is_completed),
          "Todo List",
          "complete",
          handleComplete
        )}
        {getTaskTable(
          taskList.filter((task) => task.is_completed),
          "Completed List",
          "revert",
          handleRevert
        )}
      </div>
    </div>
  );
};

export default Dashboard;
