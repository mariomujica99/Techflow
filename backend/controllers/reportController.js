const Task = require('../models/Task');
const User = require('../models/User');
const ComStation = require('../models/ComStation');
const Supply = require('../models/Supply')
const excelJS = require('exceljs');

// @desc  Export all tasks as Excel file
// @route GET /api/reports/export/tasks
// @access Private (Admin)
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks Report');

    worksheet.columns = [
      { header: 'Task ID', key: '_id', width: 25 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Order Type', key: 'orderType', width: 50 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Completed On', key: 'completedOn', width: 20 },
      { header: 'Created On', key: 'createdOn', width: 20 },
      { header: 'Assigned To', key: 'assignedTo', width: 30 },
    ];

    tasks.forEach(task => {
      const assignedTo = task.assignedTo
        .map(user => `${user.name} (${user.email})`)
        .join(', ');
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        orderType: task.orderType,
        priority: task.priority,
        status: task.status,
        completedOn: task.completedOn ? task.completedOn.toISOString().split('T')[0] : 'Not Completed',
        createdOn: task.createdAt.toISOString().split('T')[0],
        assignedTo: assignedTo || 'Unassigned',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="tasks_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting tasks', error: error.message });
  }
};

// @desc Export user report as Excel file
// @route GET /api/reports/export/users
// @access Private (Admin)
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select('name email').lean();

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Team Members Report');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 40 },
    ];

    users.forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="team_members_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting team members', error: error.message });
  }
};

// @desc    Export computer stations report
// @route   GET /api/com-stations/export
// @access  Private (Admin)
const exportComStationsReport = async (req, res) => {
  try {
    const comStations = await ComStation.find().sort({ comStation: 1 });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Computer Stations Report');

    worksheet.columns = [
      { header: 'Computer Station', key: 'comStation', width: 20 },
      { header: 'Location', key: 'comStationLocation', width: 15 },
      { header: 'Type', key: 'comStationType', width: 15 },
      { header: 'Status', key: 'comStationStatus', width: 15 },
      { header: 'Graveyard Reason', key: 'graveyardReason', width: 30 },
    ];

    comStations.forEach(station => {
      worksheet.addRow({
        comStation: station.comStation,
        comStationLocation: station.comStationLocation,
        comStationType: station.comStationType,
        comStationStatus: station.comStationStatus,
        graveyardReason: station.graveyardReason || 'N/A',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="computer_stations.xlsx"');

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting computer stations', error: error.message });
  }
};

// @desc    Export supplies report
// @route   GET /api/reports/export/supplies
// @access  Private (Admin)
const exportSuppliesReport = async (req, res) => {
  try {
    const supplies = await Supply.find().sort({ storageRoom: 1 });

    // Organize by storage room
    const storageRoomMap = {};
    supplies.forEach(supply => {
      storageRoomMap[supply.storageRoom] = supply.items || [];
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Needed Supplies Report');

    // Define columns - each storage room as a column
    const storageRooms = ['Department', 'Outpatient Rooms', '2nd Floor Storage', '6th Floor Storage', '8th Floor Storage'];
    
    worksheet.columns = storageRooms.map(room => ({
      header: room,
      key: room.replace(/\s+/g, '_'),
      width: 30
    }));

    // Find the maximum number of items in any storage room
    const maxItems = Math.max(
      ...storageRooms.map(room => (storageRoomMap[room] || []).length),
      0
    );

    // Add rows - each row contains items at the same index from each storage room
    for (let i = 0; i < maxItems; i++) {
      const row = {};
      storageRooms.forEach(room => {
        const roomItems = storageRoomMap[room] || [];
        row[room.replace(/\s+/g, '_')] = roomItems[i] || '';
      });
      worksheet.addRow(row);
    }

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add borders to all cells
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="needed_supplies.xlsx"');

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting supplies', error: error.message });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
  exportComStationsReport,
  exportSuppliesReport,
};