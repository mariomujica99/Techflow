import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { 
  LuFolderPlus,
  LuUpload,
  LuFolder,
  LuDownload,
  LuTrash2,
  LuArrowLeft,
  LuFile,
  LuEye,
  LuX
} from "react-icons/lu";
import { MdOutlineMoreVert } from "react-icons/md";
import { 
  FaFilePdf, 
  FaFileImage 
} from "react-icons/fa";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import moment from "moment";

const Files = () => {
  const { user } = useContext(UserContext);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const isAdmin = user?.role === 'admin';

  const getAllFiles = async (folderId = null) => {
    try {
      const response = await axiosInstance.get(API_PATHS.FILES.GET_ALL_FILES, {
        params: { folderId }
      });
      setFiles(response.data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.FILES.CREATE_FOLDER, {
        name: newFolderName,
        parentFolder: currentFolder
      });
      toast.success("Folder created successfully");
      setNewFolderName('');
      setShowNewFolderModal(false);
      getAllFiles(currentFolder);
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        if (currentFolder) {
          formData.append('parentFolder', currentFolder);
        }
        return axiosInstance.post(API_PATHS.FILES.UPLOAD_FILE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      await Promise.all(uploadPromises);
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`);
      getAllFiles(currentFolder);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(error.response?.data?.message || "Failed to upload files");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axiosInstance.delete(API_PATHS.FILES.DELETE_FILE(fileId));
      toast.success("Deleted successfully");
      setShowDeleteModal(false);
      setDeleteItem(null);
      getAllFiles(currentFolder);
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    }
    setOpenDropdown(null);
  };

  const openDeleteConfirmation = (file) => {
    setDeleteItem(file);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setShowPreviewModal(true);
    setOpenDropdown(null);
  };

  const handleDownload = async (file) => {
    try {
      // Fetch the file as blob
      const response = await fetch(file.fileUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.name; // Use original filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("Download started");
      setOpenDropdown(null);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder._id);
    setFolderPath([...folderPath, { id: folder._id, name: folder.name }]);
    getAllFiles(folder._id);
  };

  const handleBackClick = () => {
    const newPath = [...folderPath];
    newPath.pop();
    setFolderPath(newPath);
    
    const parentId = newPath.length > 0 ? newPath[newPath.length - 1].id : null;
    setCurrentFolder(parentId);
    getAllFiles(parentId);
  };

  const getFileIcon = (file) => {
    if (file.type === 'folder') {
      return <LuFolder className="text-2xl text-blue-500" />;
    }
    
    switch (file.fileType) {
      case 'pdf':
        return <FaFilePdf className="text-2xl text-red-500" />;
      case 'image':
        return <FaFileImage className="text-2xl text-purple-500" />;
      default:
        return <LuFile className="text-2xl text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  useEffect(() => {
    getAllFiles();
  }, []);

  return (
    <DashboardLayout activeMenu="Files">
      <div className="mt-5 mb-10">
        <div className="flex flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {folderPath.length > 0 && (
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <LuArrowLeft className="text-xl text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="text-xl md:text-xl font-bold text-gray-500">Files</h2>
              {folderPath.length > 0 && (
                <p className="text-sm text-gray-500">
                  {folderPath.map(f => f.name).join(' / ')}
                </p>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center gap-2 py-1.5 px-4 md:py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium cursor-pointer"
              >
                <LuFolderPlus className="text-base md:text-lg" />
                <span className="hidden sm:inline">New Folder</span>
              </button>

              <label className="flex items-center gap-2 py-1.5 px-4 md:py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer text-sm font-medium">
                <LuUpload className="text-base md:text-lg" />
                <span className="hidden sm:inline">{uploading ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple
                />
              </label>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mb-2 bg-gray-50 border border-primary rounded-lg p-3 flex items-center gap-2">
          <div className="text-primary text-xs">
            Only Image And PDF Files Are Supported
          </div>
        </div>

        {/* Files Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className={`overflow-x-auto ${isAdmin ? 'pb-30' : ''}`}>
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="pl-4 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 tracking-wider">
                    Type
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 tracking-wider">
                    Name
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 tracking-wider hidden md:table-cell">
                    Created
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 tracking-wider hidden sm:table-cell">
                    Size
                  </th>
                  <th className="pr-4 sm:px-4 py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No files or folders yet
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr
                      key={file._id}
                      className={`hover:bg-gray-50 ${file.type === 'folder' ? 'cursor-pointer' : ''}`}
                      onClick={() => file.type === 'folder' && handleFolderClick(file)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getFileIcon(file)}
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate block">
                          {file.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {moment(file.createdAt).format('M/D/YYYY')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        {isAdmin ? (
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenDropdown(openDropdown === file._id ? null : file._id)}
                              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                            >
                              <MdOutlineMoreVert className="text-gray-600" />
                            </button>
                            
                            {openDropdown === file._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                {file.type === 'file' && (
                                  <>
                                    <button
                                      onClick={() => handlePreview(file)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <LuEye className="text-base" />
                                      Preview
                                    </button>
                                    <button
                                      onClick={() => handleDownload(file)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <LuDownload className="text-base" />
                                      Download
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => openDeleteConfirmation(file)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-gray-100"
                                >
                                  <LuTrash2 className="text-base" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          !isAdmin && file.type === 'file' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handlePreview(file)}
                                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                title="Preview Document"
                              >
                                <LuEye className="text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDownload(file)}
                                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                title="Download File"
                              >
                                <LuDownload className="text-gray-600" />
                              </button>
                            </div>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Folder Modal */}
        <Modal
          isOpen={showNewFolderModal}
          onClose={() => {
            setShowNewFolderModal(false);
            setNewFolderName('');
          }}
          title="Create New Folder"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full dark:text-white px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90"
              >
                Create
              </button>
            </div>
          </div>
        </Modal>

        {/* Preview Modal */}
        {showPreviewModal && previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="relative w-full h-full max-w-7xl max-h-screen p-4">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewFile(null);
                }}
                className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full hover:bg-gray-100 shadow-lg cursor-pointer"
              >
                <LuX className="text-xl text-gray-700" />
              </button>

              {/* Preview Content */}
              <div className="w-full h-full flex items-center justify-center">
                {previewFile.fileType === 'image' ? (
                  <img
                    src={previewFile.fileUrl}
                    alt={previewFile.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : previewFile.fileType === 'pdf' ? (
                  <iframe
                    src={previewFile.fileUrl}
                    title={previewFile.name}
                    className="w-full h-full bg-white rounded-lg"
                  />
                ) : null}
              </div>

              {/* File Name */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-700 text-center">
                  {previewFile.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteItem(null);
          }}
          title={`Delete ${deleteItem?.type === 'folder' ? 'Folder' : 'File'}`}
        >
          <DeleteAlert
            content={`Are you sure you want to delete "${deleteItem?.name}"? ${
              deleteItem?.type === 'folder' 
                ? 'This will also delete all files and folders inside it. ' 
                : ''
            }This action cannot be undone.`}
            onDelete={() => handleDelete(deleteItem?._id)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Files;