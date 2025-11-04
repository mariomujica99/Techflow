const Task = require('../models/Task');
const User = require('../models/User');
const Provider = require('../models/Provider');
const ComStation = require('../models/ComStation');
const Supply = require('../models/Supply')
const excelJS = require('exceljs');

// @desc  Export all tasks as Excel file
// @route GET /api/reports/export/tasks
// @access Private (Admin)
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name');

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks Report');

    worksheet.columns = [
      { header: 'Room', key: 'title', width: 30 },
      { header: 'Order Type', key: 'orderType', width: 50 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Created On', key: 'createdOn', width: 20 },      
      { header: 'Completed On', key: 'completedOn', width: 20 },
      { header: 'Worked On', key: 'assignedTo', width: 30 },
    ];

    tasks.forEach(task => {
      const assignedTo = task.assignedTo
        .map(user => `${user.name}`)
        .join(', ');
      worksheet.addRow({
        title: task.title,
        orderType: task.orderType,
        priority: task.priority,
        status: task.status,
        createdOn: task.createdAt.toISOString().split('T')[0],
        completedOn: task.completedOn ? task.completedOn.toISOString().split('T')[0] : 'Not Completed',
        assignedTo: assignedTo || 'Unassigned',
      });
    });

    // Style
    worksheet.getRow(1).font = { bold: true };
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
    const users = await User.find().select('name email phoneNumber pagerNumber').lean();
    
    // Sort alphabetically by name
    users.sort((a, b) => a.name.localeCompare(b.name));
    
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Team Members Report');
    
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Phone', key: 'phoneNumber', width: 20 },
      { header: 'Pager', key: 'pagerNumber', width: 20 },
    ];
    
    users.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || 'N/A',
        pagerNumber: user.pagerNumber || 'N/A',
      });
    });
    
    // Style
    worksheet.getRow(1).font = { bold: true };
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

// @desc Export providers report as Excel file
// @route GET /api/reports/export/providers
// @access Private (Admin)
const exportProvidersReport = async (req, res) => {
  try {
    const providers = await Provider.find().select('name email phoneNumber pagerNumber').lean();
    
    // Sort alphabetically by name
    providers.sort((a, b) => a.name.localeCompare(b.name));
    
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reading Providers Report');
    
    worksheet.columns = [
      { header: 'Provider', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Phone', key: 'phoneNumber', width: 20 },
      { header: 'Pager', key: 'pagerNumber', width: 20 },
    ];
    
    providers.forEach((provider) => {
      worksheet.addRow({
        name: `Dr. ${provider.name}`,
        email: provider.email || 'N/A',
        phoneNumber: provider.phoneNumber || 'N/A',
        pagerNumber: provider.pagerNumber || 'N/A',
      });
    });
    
    // Style
    worksheet.getRow(1).font = { bold: true };
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
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reading_providers_report.xlsx"'
    );
    
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({ message: 'Error exporting providers', error: error.message });
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
      { header: 'Issue', key: 'issueDescription', width: 30 },
      { header: 'Ticket?', key: 'hasTicket', width: 10 },
      { header: 'Ticket Number', key: 'ticketNumber', width: 20 },
    ];

    comStations.forEach(station => {
      worksheet.addRow({
        comStation: station.comStation,
        comStationLocation: station.comStationLocation,
        comStationType: station.comStationType,
        comStationStatus: station.comStationStatus,
        issueDescription: station.issueDescription || 'N/A',
        hasTicket: station.hasTicket ? 'Yes' : 'No',
        ticketNumber: station.ticketNumber || 'N/A',
      });
    });

    // Style
    worksheet.getRow(1).font = { bold: true };
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

    // Style
    worksheet.getRow(1).font = { bold: true };
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
  exportProvidersReport,
};