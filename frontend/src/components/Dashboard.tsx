import React, { useEffect, useState, useRef } from "react";
import {
  completeTask,
  revertTask,
  getAllTasks,
  getUrgencyTasks,
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
  const [updatingTableName, setUpdatingTableName] = useState<string | null>(
    null
  );
  const [tempTask, setTempTask] = useState<Task | null>(null);

  const [todoList, setTodoList] = useState<GetAllTasksResponse>([]);
  const [completedList, setCompletedList] = useState<GetAllTasksResponse>([]);
  const [urgencyList, setUrgencyList] = useState<GetAllTasksResponse>([]);

  const taskList: Record<string, Task[]> = {
    todo: todoList,
    completed: completedList,
    urgent: urgencyList,
  };

  const titleRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const updateButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let allTasks: GetAllTasksResponse, urgencyTasks: GetAllTasksResponse;
    const get = async () => {
      try {
        allTasks = await getAllTasks();
      } catch (err) {
        console.log("Task list could not be retrieved.");
      }
      try {
        urgencyTasks = await getUrgencyTasks();
      } catch (err) {
        console.log("Urgency task list could not be retrieved.");
      }

      setTodoList(
        allTasks.filter(
          (task) =>
            !task.is_completed &&
            !urgencyTasks.map((t) => t.id).includes(task.id)
        )
      );
      setCompletedList(allTasks.filter((task) => task.is_completed));
      setUrgencyList(urgencyTasks);
      setUpdatingRowId(null);
    };

    console.log("token: ", token);

    if (!token) {
      return;
    }

    get();
  }, [token, isUpdatedTrigger]);

  useEffect(() => {
    setTempTask(null);
    if (updatingRowId != null) {
      titleRef.current?.focus();
    }
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
      : taskList[updatingTableName!][updatingRowId!];
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
    tableName: string
  ) => {
    return (
      <div className="task-table flex column center-y">
        <h3 style={tableName === "urgent" ? { color: "red" } : {}}>{title}</h3>
        <div className="tasks flex column gap-10">
          {taskList.map((task, idx) => (
            <div
              className="task-row flex space-between center-y"
              key={task.id}
              onClick={() => {
                setUpdatingRowId(idx);
                setUpdatingTableName(tableName);
              }}
            >
              {updatingRowId == idx && updatingTableName == tableName ? (
                <>
                  <input
                    className="title"
                    ref={titleRef}
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
        {getTaskTable(
          todoList,
          "Todo List",
          "complete",
          handleComplete,
          "todo"
        )}
        {getTaskTable(
          completedList,
          "Completed List",
          "revert",
          handleRevert,
          "completed"
        )}
        {getTaskTable(
          urgencyList,
          "Urgent List",
          "complete",
          handleComplete,
          "urgent"
        )}
      </div>
    </div>
  );
};

export default Dashboard;
