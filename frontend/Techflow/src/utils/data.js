import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuListChecks,
  LuClipboardList,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "All Tasks",
    icon: LuClipboardList,
    path: "/admin/all-tasks",
  },
  {
    id: "03",
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "04",
    label: "Manage Tasks",
    icon: LuListChecks,
    path: "/admin/manage-tasks",
  },
  {
    id: "05",
    label: "Create Task",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: "06",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "07",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "All Tasks",
    icon: LuClipboardList,
    path: "/user/all-tasks",
  },
  {
    id: "03",
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "04",
    label: "Manage Tasks",
    icon: LuListChecks,
    path: "/user/manage-tasks",
  },
  {
    id: "05",
    label: "Create Task",
    icon: LuSquarePlus,
    path: "/user/create-task",
  },
  {
    id: "06",
    label: "Team Members",
    icon: LuUsers,
    path: "/user/users",
  },
  {
    id: "07",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Routine", value: "Routine" },
  { label: "ASAP", value: "ASAP" },
  { label: "STAT", value: "STAT" },
];

export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

export const ORDER_TYPE_DATA = [
  { label: "Routine EEG | IP", value: "Routine EEG | IP" },
  { label: "Routine EEG | OP", value: "Routine EEG | OP" },
  { label: "Routine EEG | BMC", value: "Routine EEG | BMC" },
  { label: "Routine EEG | Pediatric", value: "Routine EEG | Pediatric" },
  { label: "Routine EEG | Neonate", value: "Routine EEG | Neonate" },
  { label: "Routine EEG | WADA", value: "Routine EEG | WADA" },
  { label: "Continuous EEG | LTM", value: "Continuous EEG | LTM" },
  { label: "Continuous EEG | EMU", value: "Continuous EEG | EMU" },
  { label: "Continuous EEG | Pediatric", value: "Continuous EEG | Pediatric" },
  { label: "Continuous EEG | Neonate", value: "Continuous EEG | Neonate" },
  { label: "Continuous SEEG", value: "Continuous SEEG" },
  { label: "Neuropsychiatric EEG", value: "Neuropsychiatric EEG" },
];

export const TODO_DROPDOWN_OPTIONS = [
  { label: "Skin Check", value: "Skin Check" },
  { label: "Fix Electrodes", value: "Fix Electrodes" },
  { label: "Hyperventilation", value: "Hyperventilation" },
  { label: "Photic Stimulation", value: "Photic Stimulation" },
  { label: "Disconnect & Chart", value: "Disconnect & Chart" },
  { label: "Transfer Patient to", value: "Transfer Patient to" },
  { label: "Rehook", value: "Rehook" },
  { label: "Troubleshoot", value: "Troubleshoot" },
];

export const AUTOMATIC_CHECKLIST_ITEMS = {
  "Routine EEG | IP": [
    "1 Hook-Up",
    "2 Disconnect", 
    "3 Place Charge & Chart"
  ],
  "Routine EEG | OP": [
    "1 Hook-Up",
    "2 Place Charge & Chart",
    "3 Disconnect"
  ],
  "Routine EEG | BMC": [
    "1 Drive to BMC",
    "2 Hook-Up",
    "3 Disconnect",
    "4 Upload to Server", 
    "5 Place Charge & Chart"
  ],
  "Routine EEG | Pediatric": [
    "1 Hook-Up",
    "2 Disconnect",
    "3 Place Charge & Chart"
  ],
  "Routine EEG | Neonate": [
    "1 Hook-Up",
    "2 Disconnect",
    "3 Place Charge & Chart"
  ],
  "Routine EEG | WADA": [
    "1 Hook-Up",
    "2 Disconnect",
    "3 Place Charge & Chart"
  ],
  "Continuous EEG | LTM": [
    "1 Hook-Up",
    "2 Place Start Time & Chart",
    "3 Inform Reading Provider"
  ],
  "Continuous EEG | EMU": [
    "1 Hook-Up", 
    "2 Place Start Time & Chart"
  ],
  "Continuous EEG | Pediatric": [
    "1 Hook-Up",
    "2 Place Start Time & Chart",
    "3 Inform Reading Provider or Neurotech"
  ],
  "Continuous EEG | Neonate": [
    "1 Hook-Up",
    "2 Place Start Time & Chart", 
    "3 Inform Neurotech"
  ],
  "Continuous SEEG": [
    "1 Hook-Up",
    "2 Place Start Time & Chart"
  ],
  "Neuropsychiatric EEG": [
    "1 Hook-Up",
    "2 Transfer Patient",
    "3 Disconnect",
    "4 Place Charge & Chart"
  ]
};