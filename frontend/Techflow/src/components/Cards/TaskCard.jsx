import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuMessageSquareText, LuClock, LuLoader, LuCircle, LuTrash2, LuMoonStar, LuShieldAlert, LuBrain, LuBrainCircuit, LuTriangleAlert } from "react-icons/lu";
import { FaComputer } from "react-icons/fa6";
import moment from "moment";

const TaskCard = ({
  title,
  orderType,
  electrodeType,
  allergyType,
  sleepDeprivationType,
  priority,
  status,
  progress,
  createdAt,
  assignedTo,
  commentCount,
  completedTodoCount,
  completedOn,
  todoChecklist,
  onClick,
  onDelete,
  showDeleteButton = false
}) => {

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-green-500 bg-green-50 border border-green-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case 'Routine':
        return 'bg-lime-50 text-lime-500 border border-lime-500/10';
      case 'ASAP':
        return 'bg-orange-50 text-orange-500 border border-orange-500/10';
      default:
        return 'bg-red-50 text-red-500 border border-red-500/10';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "In Progress":
        return <LuClock className="text-cyan-500 text-sm" />;
      case "Pending":
        return <LuCircle className="text-violet-500 text-sm" />;
      default:
        return <LuCircle className="text-gray-400 text-sm" />;
    }
  };
  
  return <div
    className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer relative"
    onClick={onClick}
  >
    <div className="flex items-end gap-3 px-4">
      <div
        className={`text-[11px] font-medium ${getStatusTagColor()} px-3.5 py-0.5 rounded`}
      >
        <span className="whitespace-nowrap">{status}</span>
      </div>
      <div
        className={`text-[11px] font-medium ${getPriorityTagColor()} px-3.5 py-0.5 rounded`}
      >
        {priority}
      </div>
    </div>

    {showDeleteButton && (
      <div className="absolute top-3 right-4">
        <button
          className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded-full px-2 py-2 border border-rose-100 hover:border-rose-300 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onDelete();
          }}
        >
          <LuTrash2 className="text-base" />
        </button>
      </div>
    )}


      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-green-500"
            : "border-violet-500"  
        }`}
      >
        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-medium text-gray-800 line-clamp-2">
            {title}
          </p>

          {/* Electrode Type - only show for Continuous */}
          {(orderType?.includes("Continuous EEG") || orderType?.includes("Continuous SEEG")) && (
            <div
              className={`flex items-center gap-1 text-[11px] font-medium px-3 py-0.25 rounded-full ring-1 ${
                electrodeType === "MRI Leads"
                  ? "text-rose-600 bg-rose-50 ring-rose-200"
                  : orderType?.includes("Continuous SEEG")
                  ? "text-teal-600 bg-teal-50 ring-teal-200"
                  : "text-blue-600 bg-blue-50 ring-blue-200"
              }`}
            >
              {electrodeType === "MRI Leads" ? (
                <>
                  <LuTriangleAlert className="text-xs" />
                  <span>MRI</span>
                </>
              ) : orderType?.includes("Continuous SEEG") ? (
                <>
                  <LuBrainCircuit className="text-xs" />
                  <span>Depth</span>
                </>
              ) : (
                <>
                  <LuBrain className="text-xs" />
                  <span>Regular</span>
                </>
              )}
            </div>
          )}
        </div>


        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-gray-500 line-clamp-2 leading-[18px]">
            {orderType}
          </p>
          
          {/* Allergy - only show if Adhesive Tape Allergy */}
          {allergyType === "Adhesive Tape" && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 ring-1 ring-amber-200 px-3 py-0.25 rounded-full">
              <LuShieldAlert className="text-xs" />
              <span>Allergy</span>
            </div>
          )}
        </div>


        <div className="flex items-center justify-between mt-2.5 mb-2.5">
          <p className="text-[13px] text-gray-700/80 font-medium leading-[18px]">
            Task Done:{" "}
            <span className="font-semibold text-gray-700">
              {completedTodoCount} / {todoChecklist.length || 0}
            </span>
          </p>
          
          {sleepDeprivationType === "Ordered" && (
            <div className="flex items-center gap-1 bg-indigo-50 px-3 py-0.25 rounded-full border border-indigo-200">
              <LuMoonStar className="text-indigo-600 text-xs" />
              <span className="text-[11px] text-indigo-700 font-medium">SD</span>
            </div>
          )}
        </div>

        <Progress progress={progress} status={status} />
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Created On</label>
            <p className="text-[13px] font-medium text-gray-700">
              {moment(createdAt).utc().format("Do MMM YYYY")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Completed On</label>
            {completedOn ? (
              <p className="text-[13px] font-medium text-gray-700">
                {moment(completedOn).utc().format("Do MMM YYYY")}
              </p>
            ) : (
              <div className="flex items-center gap-1.5">
                {getStatusIcon()}
                <span className="text-[13px] text-gray-700">—</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup 
            avatars={assignedTo?.map(user => user.profileImageUrl) || []} 
            users={assignedTo || []}
          />

          {commentCount > 0 && (
            <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 pb-1.5 pt-1 rounded-lg">
              <LuMessageSquareText className="text-blue-500 mt-0.75" />
              <span className="text-xs text-blue-500">{commentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
};

export default TaskCard;