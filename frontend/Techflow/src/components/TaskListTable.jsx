import React from "react";
import moment from "moment";

const TaskListTable = ({tableData, getOrderStatus}) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-500 border border-green-200';
      case 'Pending': return 'bg-violet-100 text-violet-500 border border-violet-200';
      case 'In Progress': return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
      case 'Disconnected': return 'bg-red-100 text-red-500 border border-red-200';
      default: return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'STAT': return 'bg-red-100 text-red-500 border border-red-200';
      case 'ASAP': return 'bg-orange-100 text-orange-500 border border-orange-200';
      case 'Routine': return 'bg-lime-100 text-lime-500 border border-lime-200';
      default: return 'bg-gray-100 text-gray-500 border border-gray-200'
    }
  };

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-2 md:px-4 text-gray-600 font-medium text-[13px]">Room</th>
            <th className="py-3 px-2 md:px-4 text-gray-600 font-medium text-[13px]">Status</th>
            <th className="py-3 px-2 md:px-4 text-gray-600 font-medium text-[13px]">Priority</th>
            <th className="py-3 px-4 text-gray-600 font-medium text-[13px] hidden md:table-cell">Created On</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => {
            // Calculate order status if getOrderStatus function is provided
            const orderStatus = getOrderStatus ? getOrderStatus(task) : task.status;
            
            return (
              <tr key={task._id} className="border-t border-gray-200">
                <td className="py-3 px-2 md:px-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">{task.title}</td>
                <td className="py-3 px-2 md:px-4">
                  <span className={`w-[90px] px-2 py-1 text-xs rounded inline-flex items-center justify-center ${getStatusBadgeColor(orderStatus)}`}>{orderStatus}</span>
                </td>
                <td className="py-3 px-2 md:px-4">
                  <span className={`w-[66px] px-2 py-1 text-xs rounded inline-flex items-center justify-center ${getPriorityBadgeColor(task.priority)}`}>{task.priority}</span>
                </td>
                <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">{task.createdAt ? moment.utc(task.createdAt).local().format('Do MMM YYYY') : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
};

export default TaskListTable;