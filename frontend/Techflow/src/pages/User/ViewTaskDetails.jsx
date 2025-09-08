import React, { useEffect, useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AvatarGroup from "../../components/AvatarGroup";
import moment from "moment";
import { LuMessageSquareText, LuSquareArrowOutUpRight } from "react-icons/lu";

const ViewTaskDetails = () => {
  const location = useLocation();
  const activeMenu = location.state?.from || "My Tasks";

  const { id } = useParams(null);
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-green-500 bg-green-50 border border-green-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // Get task info by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle todo check
  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;

      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          // Optionally revert the toggle if the API call fails.
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    }
  };

  // Handle complete all todos
  const completeAllTodos = async () => {
    const todoChecklist = task?.todoChecklist?.map(item => ({
      ...item,
      completed: true
    }));

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist }
      );
      if (response.status === 200) {
        setTask(response.data?.task || task);
      }
    } catch (error) {
      console.error("Error completing all todos:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    return () => {};
  }, [id]);
  return (
    <DashboardLayout activeMenu={activeMenu}>
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">{task?.title}</h2>

                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-4">
                  <InfoBox label="Order Type" value={task?.orderType} />
                </div>

                <div className="col-span-4 ml-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>

                <div className="col-span-4">
                  <InfoBox label="Electrode Type" value={task?.electrodeType || "Regular Leads"} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">   
                <div className="col-span-4">
                  <InfoBox label="Adhesive Glue" value={task?.adhesiveType || "Collodion"} />
                </div>

                <div className="col-span-4 ml-4">
                  <InfoBox label="Allergy" value={task?.allergyType || "None"} />
                </div>

                <div className="col-span-4">
                  <InfoBox label="Sleep Deprivation" value={task?.sleepDeprivationType || "Not Ordered"} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4 mb-4">
                {task?.assignedTo && task?.assignedTo.length > 0 && (
                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-500">
                      Assigned To
                    </label>

                    <AvatarGroup 
                      avatars={task?.assignedTo?.map(item => item?.profileImageUrl) || []} 
                      users={task?.assignedTo || []}
                      maxVisible={5}
                    />
                  </div>
                )}
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-500">
                    Tasks
                  </label>                  
                </div>
                <div className="mb-2">
                  {task?.todoChecklist?.map((item, index) => (
                    <TodoCheckList
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                </div>
              </div>
              {task?.todoChecklist?.some(item => !item.completed) && (
                <button 
                  className="text-xs font-medium text-green-500 bg-green-50 px-3 py-1 rounded border border-green-100 hover:border-green-300 cursor-pointer"
                  onClick={completeAllTodos}
                >
                  Complete All
                </button>
              )}

              {task?.comments?.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-start gap-1.5">
                    <LuMessageSquareText className="text-gray-400 flex-shrink-0 mt-0.25" />
                    <label className="text-xs font-medium text-slate-500">
                      Comments
                    </label>
                  </div>

                  {task?.comments?.map((comment, index) => (
                    <Comment
                      key={`comment_${index}`}
                      comment={comment}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>

      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return <div className="flex items-start gap-3 p-1">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-4 h-4 accent-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer flex-shrink-0 mt-0.5"
    />
    
    <p className="text-[13px] text-gray-800">{text}</p>
  </div>
};

const Comment = ({ comment, index }) => {
  return <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
    <div className="flex items-start gap-3">
      <p className="text-xs text-black flex-1">{comment}</p>
    </div>
  </div>
}