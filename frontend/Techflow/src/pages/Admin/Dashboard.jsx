import React, { useContext, useEffect, useState } from "react"
import { useUserAuth } from "../../hooks/useUserAuth"
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import { AUTOMATIC_CHECKLIST_ITEMS } from "../../utils/data";

const COLORS = ["#8D51FF", "#00B8DB", "#0ccb57", "#FF1F57"];

const Dashboard = () => {
  useUserAuth();

  const {user} = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [orderDistribution, setOrderDistribution] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    disconnected: 0
  });

  // Helper function to determine order status
  const getOrderStatus = (task) => {
    // Check if disconnected
    const hasDisconnect = task.todoChecklist?.some(todo => {
      const text = todo.text.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\)\s*$/, '').trim().toLowerCase();
      return (text.includes('disconnect') || text.includes('discontinue')) && todo.completed;
    });
    
    const hasEndTimeChart = task.todoChecklist?.some(todo => {
      const text = todo.text.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\)\s*$/, '').trim().toLowerCase();
      return text.includes('place end time') && text.includes('chart') && text.includes('inform reading provider') && todo.completed;
    });
    
    if (hasDisconnect && hasEndTimeChart) {
      return 'Disconnected';
    }
    
    const orderType = task.orderType;
    const automaticItems = AUTOMATIC_CHECKLIST_ITEMS[orderType];
    
    if (!automaticItems || automaticItems.length === 0) {
      return 'Pending';
    }
    
    // Count completed automatic items
    let completedCount = 0;
    automaticItems.forEach(itemText => {
      const matchingTodo = task.todoChecklist?.find(todo => {
        const todoTextWithoutTimestamp = todo.text.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+at\s+\d{1,2}:\d{2}\s+[AP]M\)\s*$/, '').trim();
        return todoTextWithoutTimestamp === itemText && todo.completed;
      });
      if (matchingTodo) {
        completedCount++;
      }
    });
    
    if (completedCount === 0) {
      return 'Pending';
    } else if (completedCount === automaticItems.length) {
      return 'Completed';
    } else {
      return 'In Progress';
    }
  };

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const PriorityLevelData = [
      { priority: "Routine", count: taskPriorityLevels?.Routine || 0 },
      { priority: "ASAP", count: taskPriorityLevels?.ASAP || 0 },
      { priority: "STAT", count: taskPriorityLevels?.STAT || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
        
        // Calculate order distribution from recent tasks
        const recentTasks = response.data?.recentTasks || [];
        let pending = 0;
        let inProgress = 0;
        let completed = 0;
        let disconnected = 0;
        
        // Get all tasks for accurate counts
        const allTasksResponse = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS_EVERYONE);
        const allTasks = allTasksResponse.data?.tasks || [];
        
        allTasks.forEach(task => {
          const status = getOrderStatus(task);
          switch (status) {
            case 'Pending':
              pending++;
              break;
            case 'In Progress':
              inProgress++;
              break;
            case 'Completed':
              completed++;
              break;
            case 'Disconnected':
              disconnected++;
              break;
          }
        });
        
        const total = pending + inProgress + completed + disconnected;
        
        setOrderDistribution({
          total,
          pending,
          inProgress,
          completed,
          disconnected
        });
        
        // Set pie chart data for orders
        const orderPieData = [
          { status: "Pending", count: pending },
          { status: "In Progress", count: inProgress },
          { status: "Completed", count: completed },
          { status: "Disconnected", count: disconnected },
        ];
        setPieChartData(orderPieData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/all-tasks")
  }

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl font-bold text-primary">Hello {user?.name?.split(" ")[0]}</h2>
            <h1 className="text-base md:text-lg text-gray-500 mt-0.5">Neurophysiology Department</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
            <h1 className="text-base md:text-lg font-medium text-primary mt-1">Orders</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mt-1">
          <InfoCard
            label="Total"
            value={addThousandsSeparator(orderDistribution.total)}
            color="bg-primary"
          />

          <InfoCard
            label="Pending"
            value={addThousandsSeparator(orderDistribution.pending)}
            color="bg-violet-500"
          />

          <InfoCard
            label="In Progress"
            value={addThousandsSeparator(orderDistribution.inProgress)}
            color="bg-cyan-500"
          />

          <InfoCard
            label="Completed"
            value={addThousandsSeparator(orderDistribution.completed)}
            color="bg-green-500"
          />

          <InfoCard
            label="Disconnected"
            value={addThousandsSeparator(orderDistribution.disconnected)}
            color="bg-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-600 mb-2">Status Of Orders</h5>
            </div>

            <CustomPieChart
              data={pieChartData}
              colors={COLORS}
            />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-600 mb-2">Order Priority Levels</h5>
            </div>

            <CustomBarChart
              data={barChartData}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-medium text-gray-600">Recent Orders</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable 
              tableData={dashboardData?.recentTasks || []} 
              getOrderStatus={getOrderStatus}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;