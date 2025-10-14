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
  const activeMenu = location.state?.from || "Worked-On Tasks";

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
      const todoItem = todoChecklist[index];
      const wasCompleted = todoItem.completed;
      todoItem.completed = !todoItem.completed;

      // Check if this is a transfer task and it's being completed
      if (!wasCompleted && todoItem.completed && todoItem.text.includes("Transfer Patient to ")) {
        const roomMatch = todoItem.text.match(/Transfer Patient to (\d+)/);
        if (roomMatch && roomMatch[1]) {
          const newRoom = roomMatch[1];
          try {
            await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
              title: newRoom
            });
          } catch (error) {
            console.error("Error updating room number:", error);
          }
        }
      }

      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          todoItem.completed = !todoItem.completed;
        }
      } catch (error) {
        todoItem.completed = !todoItem.completed;
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
                <h2 className="text-base md:text-xl font-medium">{task?.title}</h2>

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
                <div className="col-span-4">
                  <InfoBox label="Computer Station" value={task?.comStation?.comStation || "Not Selected"} />
                </div>

                {task?.assignedTo && task?.assignedTo.length > 0 && (
                  <div className="col-span-8 ml-4">
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
                  {(() => {
                    // Group todos by creation date
                    const todosByDate = {};
                    
                    task?.todoChecklist?.forEach((todo) => {
                      const createdDate = todo.createdAt 
                        ? moment(todo.createdAt).format('dddd Do MMM YYYY')
                        : 'Unknown Date';
                      
                      if (!todosByDate[createdDate]) {
                        todosByDate[createdDate] = [];
                      }
                      todosByDate[createdDate].push(todo);
                    });

                    // Sort dates (most recent first)
                    const sortedDates = Object.keys(todosByDate).sort((a, b) => {
                      if (a === 'Unknown Date') return 1;
                      if (b === 'Unknown Date') return -1;
                      return moment(b, 'dddd Do MMM YYYY').valueOf() - moment(a, 'dddd Do MMM YYYY').valueOf();
                    });

                    return sortedDates.map((date) => (
                      <div key={date} className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Added {date}
                        </p>
                        {todosByDate[date].map((todo, index) => (
                          <TodoCheckList
                            key={`${date}-${index}`}
                            text={todo.text}
                            isChecked={todo.completed}
                            onChange={() => {
                              const todoIndex = task.todoChecklist.findIndex(t => t._id === todo._id);
                              updateTodoChecklist(todoIndex);
                            }}
                          />
                        ))}
                      </div>
                    ));
                  })()}
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
  // Extract timestamp if it exists
  const timestampMatch = text.match(/\((\d{1,2}\/\d{1,2}\/\d{2}\s+at\s+\d{1,2}:\d{2}\s+[AP]M)\)$/);
  const timestamp = timestampMatch ? timestampMatch[1] : null;
  const textWithoutTimestamp = text.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\)\s*$/, '').trim();
  
  return (
    <div className="flex items-start gap-3 p-1">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 accent-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer flex-shrink-0 mt-0.5"
      />
      
      <p className="text-[13px] text-gray-800 break-words flex-1 min-w-0">
        {textWithoutTimestamp}{' '}
        {timestamp && (
          <span className="text-xs text-gray-400 whitespace-nowrap inline-block">
            ({timestamp})
          </span>
        )}
      </p>
    </div>
  );
};

const Comment = ({ comment, index }) => {
  return <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
    <div className="flex items-start gap-3">
      <p className="text-xs text-black flex-1">{comment}</p>
    </div>
  </div>
}