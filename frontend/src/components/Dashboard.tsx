import React, { useEffect, useState, useRef } from "react";
import {
  completeTask,
  revertTask,
  getAllTasks,
  updateTask,
} from "../api/TaskApi";
import type { GetAllTasksResponse } from "../types/ApiDTO";
import "../css/Dashboard.css";
import type { Task } from "../types/Models";

interface props {
  token: string;
}

const Dashboard: React.FC<props> = ({ token }) => {
  const [isUpdatedTrigger, setIsUpdatedTrigger] = useState<boolean>(false);
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null);
  const [isUpdatingTableCompleted, setIsUpdatingTableCompleted] =
    useState<boolean>(false);
  const [tempTask, setTempTask] = useState<Task | null>(null);

  const [todoList, setTodoList] = useState<GetAllTasksResponse>([]);
  const [completedList, setCompletedList] = useState<GetAllTasksResponse>([]);

  const taskList: Record<string, Task[]> = {
    false: todoList,
    true: completedList,
  };

  const dueDateRef = useRef<HTMLInputElement>(null);
  const updateButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const get = async () => {
      try {
        const resp = await getAllTasks();
        setTodoList(resp.filter((task) => !task.is_completed));
        setCompletedList(resp.filter((task) => task.is_completed));
        setUpdatingRowId(null);
      } catch (err) {
        console.log("Task list could not be retrieved.");
      }
    };

    console.log("token: ", token);

    if (!token) {
      return;
    }

    get();
  }, [token, isUpdatedTrigger]);

  useEffect(() => {
    setTempTask(null);
  }, [updatingRowId]);

  const handleComplete = async (id: number) => {
    try {
      await completeTask(id);
      setIsUpdatedTrigger((ut) => !ut);
    } catch (err) {
      console.log(`Task id = ${id} could not be completed`);
    }
  };

  const handleRevert = async (id: number) => {
    try {
      await revertTask(id);
      setIsUpdatedTrigger((ut) => !ut);
    } catch (err) {
      console.log(`Task id = ${id} could not be completed`);
    }
  };

  const handleInputChange = async <K extends keyof Task>(
    e: React.ChangeEvent<HTMLInputElement>,
    paramName: K
  ) => {
    const value = e.target.value;
    const task: Partial<Task> = {
      [paramName]: value,
    };
    const origTask = tempTask
      ? tempTask
      : taskList[isUpdatingTableCompleted.toString()][updatingRowId!];
    setTempTask({ ...origTask, ...task });
  };

  const handleUpdate = async (id: number) => {
    try {
      if (tempTask) {
        await updateTask(id, tempTask);
      }
    } catch (err) {
      console.log(`Task id = ${id} could not be updated`);
    }
    setIsUpdatedTrigger((ut) => !ut);
  };

  const handleTitleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dueDateRef.current?.focus();
    }
  };

  const handleDueDateEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateButtonRef.current?.click();
    }
  };

  if (!taskList) return null;

  const getTaskTable = (
    taskList: GetAllTasksResponse,
    title: string,
    buttonName: string,
    handleFunc: (id: number) => void,
    isCompleted: boolean
  ) => {
    return (
      <div className="task-table flex column center-y">
        <h3>{title}</h3>
        <div className="tasks flex column gap-10">
          {taskList.map((task, idx) => (
            <div
              className="task-row flex space-between center-y"
              key={task.id}
              onClick={() => {
                setUpdatingRowId(idx);
                setIsUpdatingTableCompleted(isCompleted);
              }}
            >
              {updatingRowId == idx &&
              isUpdatingTableCompleted == isCompleted ? (
                <>
                  <input
                    className="title"
                    value={tempTask ? tempTask.title : task.title}
                    onChange={(e) => handleInputChange(e, "title")}
                    onKeyDown={handleTitleEnter}
                  />{" "}
                  <input
                    type="date"
                    className="due_date"
                    ref={dueDateRef}
                    value={tempTask ? tempTask.due_date : task.due_date}
                    onChange={(e) => handleInputChange(e, "due_date")}
                    onKeyDown={handleDueDateEnter}
                  />
                  <button
                    ref={updateButtonRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(task.id);
                    }}
                  >
                    update task
                  </button>
                </>
              ) : (
                <>
                  <div className="title">{task.title}</div>
                  <div className="due_date">{task.due_date}</div>{" "}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFunc(task.id);
                    }}
                  >
                    {buttonName}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="task-categories flex center-x">
        {getTaskTable(todoList, "Todo List", "complete", handleComplete, false)}
        {getTaskTable(
          completedList,
          "Completed List",
          "revert",
          handleRevert,
          true
        )}
      </div>
    </div>
  );
};

export default Dashboard;
