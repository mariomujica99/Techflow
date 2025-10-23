import {
  LuLayoutDashboard,
  LuUser,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuListChecks,
  LuClipboardList,
} from "react-icons/lu";
import { FaComputer } from "react-icons/fa6";
import { FaUserMd } from "react-icons/fa";
import { TbChalkboard } from "react-icons/tb";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsCartPlus } from "react-icons/bs";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Lab Whiteboard",
    icon: TbChalkboard,
    path: "/admin/lab-whiteboard",
  },
  {
    id: "03",
    label: "Floor Whiteboard",
    icon: MdOutlineSpaceDashboard,
    path: "/admin/floor-whiteboard",
  },
  {
    id: "04",
    label: "All Tasks",
    icon: LuClipboardList,
    path: "/admin/all-tasks",
  },
  {
    id: "05",
    label: "Worked-On Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "06",
    label: "Manage Tasks",
    icon: LuListChecks,
    path: "/admin/manage-tasks",
  },
  {
    id: "07",
    label: "Create Task",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: "08",
    label: "Needed Supplies",
    icon: BsCartPlus,
    path: "/admin/supplies",
  },
  {
    id: "09",
    label: "Computer Stations",
    icon: FaComputer,
    path: "/admin/com-stations",
  },
  {
    id: "10",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "11",
    label: "Reading Providers",
    icon: FaUserMd,
    path: "/admin/providers",
  },
  {
    id: "12",
    label: "Edit Profile",
    icon: LuUser,
    path: "/admin/edit-profile",
  },
  {
    id: "13",
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
    label: "Lab Whiteboard",
    icon: TbChalkboard,
    path: "/user/lab-whiteboard",
  },
  {
    id: "03",
    label: "Floor Whiteboard",
    icon: MdOutlineSpaceDashboard,
    path: "/user/floor-whiteboard",
  },
  {
    id: "04",
    label: "All Tasks",
    icon: LuClipboardList,
    path: "/user/all-tasks",
  },
  {
    id: "05",
    label: "Worked-On Tasks",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "06",
    label: "Manage Tasks",
    icon: LuListChecks,
    path: "/user/manage-tasks",
  },
  {
    id: "07",
    label: "Create Task",
    icon: LuSquarePlus,
    path: "/user/create-task",
  },
  {
    id: "08",
    label: "Needed Supplies",
    icon: BsCartPlus,
    path: "/user/supplies",
  },
  {
    id: "09",
    label: "Computer Stations",
    icon: FaComputer,
    path: "/user/com-stations",
  },
  {
    id: "10",
    label: "Team Members",
    icon: LuUsers,
    path: "/user/users",
  },
  {
    id: "11",
    label: "Reading Providers",
    icon: FaUserMd,
    path: "/user/providers",
  },
  {
    id: "12",
    label: "Edit Profile",
    icon: LuUser,
    path: "/user/edit-profile",
  },
  {
    id: "13",
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
  { label: "Disconnected", value: "Disconnected" },
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
  { label: "Skin Check", value: "Skin Check | Day " },
  { label: "Fix Electrodes", value: "Fix Electrodes " },
  { label: "Hyperventilation", value: "Hyperventilation " },
  { label: "Photic Stimulation", value: "Photic Stimulation " },
  { label: "Discontinue CEEG", value: "Disconnect " },
  { label: "Transfer Patient", value: "Transfer Patient from " },
  { label: "Rehook", value: "Rehook " },
  { label: "Troubleshoot", value: "Troubleshoot " },
];

export const TODO_DC_CHART = "Place End Time & Chart | Inform Reading Provider"

export const AUTOMATIC_CHECKLIST_ITEMS = {
  "Routine EEG | IP": [
    "Hook-Up",
    "Disconnect", 
    "Place Charge & Chart"
  ],
  "Routine EEG | OP": [
    "Hook-Up",
    "Place Charge & Chart",
    "Disconnect"
  ],
  "Routine EEG | BMC": [
    "Travel to BMC",
    "Hook-Up (Run Study for 1 Hour)",
    "Disconnect",
    "Ensure Study is Uploaded to Server", 
    "Place Charge & Chart"
  ],
  "Routine EEG | Pediatric": [
    "Hook-Up (Run Study for 1 Hour)",
    "Disconnect",
    "Place Charge & Chart",
    "Inform Pediatric Reading Provider"
  ],
  "Routine EEG | Neonate": [
    "Hook-Up (Run Study for 1 Hour)",
    "Disconnect",
    "Place Charge & Chart",
    "Inform Pediatric Reading Provider"
  ],
  "Routine EEG | WADA": [
    "Hook-Up",
    "Transfer to IR",
    "Disconnect",
    "Review & Annotate Study",
    "Release WADA Order"
  ],
  "Continuous EEG | LTM": [
    "Hook-Up",
    "Place Start Time & Chart",
    "Inform Reading Provider"
  ],
  "Continuous EEG | EMU": [
    "Hook-Up", 
    "Place Start Time & Chart"
  ],
  "Continuous EEG | Pediatric": [
    "Hook-Up",
    "Place Start Time & Chart",
    "Inform Reading Provider and/or Neurotech"
  ],
  "Continuous EEG | Neonate": [
    "Hook-Up",
    "Place Start Time & Chart", 
    "Inform Pediatric Reading Provider and Neurotech"
  ],
  "Continuous SEEG": [
    "Hook-Up",
    "Place Start Time & Chart"
  ],
  "Neuropsychiatric EEG": [
    "Hook-Up",
    "Transfer Patient",
    "Place Charge & Chart",
    "Disconnect"
  ]
};

export const DEFAULT_COMMENTS = {
  "Routine EEG | IP": "Defaults to No Adhesive Tape Allergy",
  "Routine EEG | OP": "Defaults to No Adhesive Tape Allergy",
  "Routine EEG | BMC": "Defaults to No Adhesive Tape Allergy",
  "Routine EEG | Pediatric": "Defaults to No Adhesive Tape Allergy",
  "Routine EEG | Neonate": "Defaults to No Adhesive Tape Allergy",
  "Routine EEG | WADA": "Defaults to No Adhesive Tape Allergy",
  "Continuous EEG | LTM": "Defaults to Regular Leads | Collodion Glue | No Adhesive Tape Allergy | No Sleep Deprivation",
  "Continuous EEG | EMU": "Defaults to Regular Leads | Collodion Glue | No Adhesive Tape Allergy | No Sleep Deprivation",
  "Continuous EEG | Pediatric": "Defaults to Regular Leads | Collodion Glue | No Adhesive Tape Allergy | No Sleep Deprivation",
  "Continuous EEG | Neonate": "Defaults to Regular Leads | Collodion Glue | No Adhesive Tape Allergy",
  "Continuous SEEG": "Defaults to No Sleep Deprivation",
  "Neuropsychiatric EEG": "Defaults to No Adhesive Tape Allergy",
};

export const COM_STATIONS_DROPDOWN_OPTIONS = [
  { label: "All Computer Stations", value: "All Computer Stations" },
  { label: "EMU Stations", value: "EMU Station" },
  { label: "EEG Carts", value: "EEG Cart" },
];

export const ROOM_MAPPINGS = {
  "6820": {
    orderType: "Continuous EEG | EMU",
    comStationName: "CTXLRM6820"
  },
  "6822": {
    orderType: "Continuous EEG | EMU", 
    comStationName: "CTXLRM6822"
  },
  "6824": {
    orderType: "Continuous EEG | EMU",
    comStationName: "CTXLRM6824"
  },
  "6826": {
    orderType: "Continuous EEG | EMU",
    comStationName: "CTXLRM6826"
  },
  "6827": {
    orderType: "Continuous EEG | EMU",
    comStationName: "CTXLRM6827"
  },
  "6828": {
    orderType: "Continuous EEG | EMU",
    comStationName: "CTXLRM6828"
  },
  "6829": {
    orderType: "Continuous EEG | EMU",
    comStationName: "CTXLRM6829"
  },
  "6831": {
    orderType: "Continuous EEG | EMU",
    comStationName: "CTXLRM6831"
  }
};

export const SUPPLIES = [
  { label: "Acetone", value: "Acetone" },
  { label: "Air Hose", value: "Air Hose" },
  { label: "Alarm Button", value: "Alarm Button" },
  { label: "Bags", value: "Bags" },
  { label: "Blankets", value: "Blankets" },
  { label: "Cleaning Wipes", value: "Cleaning Wipes" },
  { label: "Coban", value: "Coban" },
  { label: "Collodion", value: "Collodion" },
  { label: "Collodion Remover", value: "Collodion Remover" },
  { label: "Conductive Paste", value: "Conductive Paste" },
  { label: "Cotton Balls", value: "Cotton Balls" },
  { label: "Cotton Tips", value: "Cotton Tips" },
  { label: "Floor Tape", value: "Floor Tape" },
  { label: "Fitted Sheets", value: "Fitted Sheets" },
  { label: "Gauze Squares", value: "Gauze Squares" },
  { label: "Glue/Remover Cups", value: "Glue/Remover Cups" },
  { label: "Gray Cord", value: "Gray Cord" },
  { label: "Hair Ties", value: "Hair Ties" },
  { label: "Head Wraps", value: "Head Wraps" },
  { label: "Long Towels", value: "Long Towels" },
  { label: "Medipore", value: "Medipore" },
  { label: "Micropore", value: "Micropore" },
  { label: "MRI Leads", value: "MRI Leads" },
  { label: "Pillowcases", value: "Pillowcases" },
  { label: "Prep/Paste Cups", value: "Prep/Paste Cups" },
  { label: "Red Cord", value: "Red Cord" },
  { label: "Regular Leads", value: "Regular Leads" },
  { label: "Skin Prep", value: "Skin Prep" },
  { label: "Square Towels", value: "Square Towels" },
  { label: "Syringes", value: "Syringes" },
  { label: "Tensive", value: "Tensive" },
  { label: "Tongue Depressors", value: "Tongue Depressors" },
  { label: "Top Sheets", value: "Top Sheets" },
  { label: "Transpore", value: "Transpore" },
];