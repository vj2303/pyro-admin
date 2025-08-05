'use client'
import { useState, useEffect } from "react";
import { Eye, Filter, ArrowUpDown, Plus, Trash2, Edit } from "lucide-react";

type Influencer = {
  _id: string;
  name: string;
  user_name: string;
  categoryInstagram: string;
  categoryYouTube: string;
  city: string;
  state: string;
  language: string;
  gender: string;
  instagramData: {
    followers: number;
    genderDistribution: Array<{ gender: string; distribution: number; _id: string }>;
    ageDistribution: Array<{ age: string; value: number; _id: string }>;
    audienceByCountry: Array<{ category: string; name: string; value: number; _id: string }>;
    collaborationCharges: {
      reel: number;
      story: number;
      post: number;
      oneMonthDigitalRights: number;
    };
  };
  youtubeData: {
    followers: number;
    link: string;
    genderDistribution: Array<{ gender: string; distribution: number; _id: string }>;
    ageDistribution: Array<{ age: string; value: number; _id: string }>;
    audienceByCountry: Array<{ category: string; name: string; value: number; _id: string }>;
    collaborationCharges: {
      reel: number;
      story: number;
      post: number;
      oneMonthDigitalRights: number;
    };
  };
  averageLikes: number;
  averageViews: number;
  averageComments: number;
  averageEngagement: number;
  image: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Influencer[];
  totalPages?: number;
  currentPage?: number;
  totalInfluencers?: number;
};

const TableSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

const FormModal = ({ table, type, id, data }: { table: string; type: string; id?: string; data?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getButtonContent = () => {
    switch (type) {
      case "create":
        return (
          <button
            onClick={() => setIsOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors"
          >
            <Plus size={14} />
          </button>
        );
      case "update":
        return (
          <button
            onClick={() => setIsOpen(true)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500 transition-colors"
          >
            <Edit size={12} className="text-white" />
          </button>
        );
      case "delete":
        return (
          <button
            onClick={() => setIsOpen(true)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-400 hover:bg-red-500 transition-colors"
          >
            <Trash2 size={12} className="text-white" />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {getButtonContent()}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {type === "create" && "Create New Influencer"}
                {type === "update" && "Update Influencer"}
                {type === "delete" && "Delete Influencer"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {type === "delete" ? (
              <div>
                <p className="mb-4">Are you sure you want to delete this influencer?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle delete logic here
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Form component would go here
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Table = ({ columns, renderRow, data }: { columns: { header: string; accessor: string; className?: string }[]; renderRow: (item: any, index: number) => React.ReactNode; data: any[] }) => (
  <table className="w-full mt-4">
    <thead>
      <tr className="text-left text-gray-500 text-sm">
        {columns.map((col) => (
          <th key={col.accessor} className={col.className}>{col.header}</th>
        ))}
      </tr>
    </thead>
    <tbody>{data?.map((item, index) => renderRow(item, index))}</tbody>
  </table>
);

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => (
  <div className="p-4 flex items-center justify-between text-gray-500">
    <button
      disabled={currentPage <= 1}
      onClick={() => onPageChange(currentPage - 1)}
      className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
    >
      Prev
    </button>
    <div className="flex items-center gap-2 text-sm">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 py-1 rounded text-xs ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
    <button
      disabled={currentPage >= totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
    >
      Next
    </button>
  </div>
);

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Username",
    accessor: "user_name",
    className: "hidden md:table-cell",
  },
  {
    header: "Categories",
    accessor: "categories",
    className: "hidden md:table-cell",
  },
  {
    header: "Location",
    accessor: "location",
    className: "hidden md:table-cell",
  },
  {
    header: "Followers",
    accessor: "followers",
    className: "hidden lg:table-cell",
  },
  {
    header: "Engagement",
    accessor: "engagement",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const InfluencerListPage = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Influencer>>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const limit = 10;

  // Mock role - in real app this would come from auth context
  const role = "admin";

  const fetchInfluencers = async (page = 1, search = "", sort = "createdAt", order = "desc") => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: sort,
        sortOrder: order,
      });

      if (search.trim()) {
        queryParams.append('search', search.trim());
      }

      const response = await fetch(`https://api.phyo.ai/api/influencers?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response has content before parsing
      const responseText = await response.text();
      if (!responseText.trim()) {
        throw new Error('Empty response from server');
      }
      
      let result: ApiResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }
      
      if (result.success) {
        setInfluencers(result.data);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.currentPage || page);
      } else {
        throw new Error(result.message || 'Failed to fetch influencers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching influencers');
      console.error('Error fetching influencers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchInfluencers(currentPage, searchTerm, sortBy, sortOrder);
  }, [currentPage, sortBy, sortOrder]);

  // Search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        fetchInfluencers(1, searchTerm, sortBy, sortOrder);
      } else {
        setCurrentPage(1); // Reset to first page on search
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (newSortBy: string) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const fetchInfluencerById = async (id: string) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`https://api.phyo.ai/api/influencers/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      if (!responseText.trim()) {
        throw new Error('Empty response from server');
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }
      
      if (result.success) {
        setSelectedInfluencer(result.data);
        setEditFormData(result.data);
        setShowDetailModal(true);
      } else {
        throw new Error(result.message || 'Failed to fetch influencer details');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error fetching influencer details');
      console.error('Error fetching influencer details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateInfluencer = async (id: string, updateData: Partial<Influencer>) => {
    setUpdateLoading(true);
    try {
      const response = await fetch(`https://api.phyo.ai/api/influencers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updateData.name,
          user_name: updateData.user_name,
          gender: updateData.gender,
          language: updateData.language,
          city: updateData.city,
          state: updateData.state,
          categoryInstagram: updateData.categoryInstagram,
          categoryYouTube: updateData.categoryYouTube,
          averageLikes: updateData.averageLikes,
          averageViews: updateData.averageViews,
          averageComments: updateData.averageComments,
          averageEngagement: updateData.averageEngagement,
          image: updateData.image,
          'instagramData.followers': updateData.instagramData?.followers,
          'youtubeData.followers': updateData.youtubeData?.followers,
          'youtubeData.link': updateData.youtubeData?.link,
          'youtubeData.genderDistribution': updateData.youtubeData?.genderDistribution,
          'youtubeData.ageDistribution': updateData.youtubeData?.ageDistribution,
        }),
      });

      if (response.ok) {
        alert('Influencer updated successfully!');
        setIsEditMode(false);
        setSelectedInfluencer(null); 
        setShowDetailModal(false);
        // Refresh the main list
        await fetchInfluencers(currentPage, searchTerm, sortBy, sortOrder);
      } else {
        throw new Error('Failed to update influencer');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating influencer');
      console.error('Error updating influencer:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditSubmit = () => {
    if (!selectedInfluencer) return;
    
    const updateData = {
      name: editFormData.name,
      city: editFormData.city,
      state: editFormData.state,
      averageLikes: editFormData.averageLikes,
      averageViews: editFormData.averageViews,
      averageEngagement: editFormData.averageEngagement,
      'instagramData.followers': editFormData.instagramData?.followers,
      'youtubeData.followers': editFormData.youtubeData?.followers,
    };
    
    updateInfluencer(selectedInfluencer._id, updateData);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedInfluencer(null);
    setIsEditMode(false);
    setEditFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this influencer?')) return;
    
    try {
      const response = await fetch(`https://api.phyo.ai/api/influencers/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Influencer deleted successfully!');
        fetchInfluencers(currentPage, searchTerm, sortBy, sortOrder);
      } else {
        throw new Error('Failed to delete influencer');
      }
    } catch (err) {
      alert('Error deleting influencer. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const renderRow = (item: Influencer) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-blue-50 transition-colors cursor-pointer"
      onClick={() => fetchInfluencerById(item._id)}
    >
      <td className="flex items-center gap-4 p-4">
   
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">@{item.user_name}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">@{item.user_name}</td>
      <td className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1">
            IG: {item.categoryInstagram}
          </span>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            YT: {item.categoryYouTube}
          </span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="font-medium">{item.city}</span>
          <span className="text-xs text-gray-500">{item.state}</span>
        </div>
      </td>
      <td className="hidden lg:table-cell">
        <div className="flex flex-col">
          <span className="text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            IG: {item.instagramData.followers.toLocaleString()}
          </span>
          <span className="text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            YT: {item.youtubeData.followers.toLocaleString()}
          </span>
        </div>
      </td>
      <td className="hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <div className="w-12 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${Math.min(item.averageEngagement * 10, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">{item.averageEngagement}%</span>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              fetchInfluencerById(item._id);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <Eye size={12} className="text-blue-600" />
          </button>
          {role === "admin" && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  fetchInfluencerById(item._id);
                  setTimeout(() => setIsEditMode(true), 100);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors"
              >
                <Edit size={12} className="text-green-600" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item._id);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors"
              >
                <Trash2 size={12} className="text-red-600" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 shadow-sm">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">All Influencers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search influencers..."
              className="w-[200px] p-2 bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 self-end">
            <button 
              onClick={() => alert('Filter functionality')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors"
            >
              <Filter size={14} />
            </button>
            <button 
              onClick={() => handleSort('name')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors"
            >
              <ArrowUpDown size={14} />
            </button>
            {role === "admin" && (
              <FormModal table="influencer" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading influencers...</span>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-medium">Error:</span>
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={() => fetchInfluencers(currentPage, searchTerm, sortBy, sortOrder)}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && influencers.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No influencers match "${searchTerm}"` : "Get started by adding your first influencer"}
            </p>
          </div>
          {role === "admin" && !searchTerm && (
            <FormModal table="influencer" type="create" />
          )}
        </div>
      )}

      {/* DATA TABLE */}
      {!loading && !error && influencers.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <Table columns={columns} renderRow={renderRow} data={influencers} />
          </div>
          
          {/* STATS */}
          <div className="mt-4 text-sm text-gray-600 border-t pt-4">
            Showing {influencers.length} influencer{influencers.length !== 1 ? 's' : ''} 
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          
          {/* PAGINATION */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* DETAILED VIEW MODAL */}
      {showDetailModal && selectedInfluencer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
           
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedInfluencer.name}</h2>
                  <p className="text-gray-600">@{selectedInfluencer.user_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Edit Mode
                  </span>
                )}
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading details...</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Name:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editFormData.name || ''}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.name}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Username:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editFormData.user_name || ''}
                            onChange={(e) => setEditFormData({...editFormData, user_name: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                          />
                        ) : (
                          <span className="font-medium">@{selectedInfluencer.user_name}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Gender:</span>
                        {isEditMode ? (
                          <select
                            value={editFormData.gender || ''}
                            onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        ) : (
                          <span className="font-medium">{selectedInfluencer.gender}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Language:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editFormData.language || ''}
                            onChange={(e) => setEditFormData({...editFormData, language: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.language}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">City:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editFormData.city || ''}
                            onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.city}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">State:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editFormData.state || ''}
                            onChange={(e) => setEditFormData({...editFormData, state: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.state}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Instagram Category:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editFormData.categoryInstagram || ''}
                            onChange={(e) => setEditFormData({...editFormData, categoryInstagram: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.categoryInstagram}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">YouTube Category:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editFormData.categoryYouTube || ''}
                            onChange={(e) => setEditFormData({...editFormData, categoryYouTube: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.categoryYouTube}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Likes:</span>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editFormData.averageLikes || 0}
                            onChange={(e) => setEditFormData({...editFormData, averageLikes: parseInt(e.target.value) || 0})}
                            className="border rounded px-2 py-1 text-sm w-32"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.averageLikes.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Views:</span>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editFormData.averageViews || 0}
                            onChange={(e) => setEditFormData({...editFormData, averageViews: parseInt(e.target.value) || 0})}
                            className="border rounded px-2 py-1 text-sm w-32"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.averageViews.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Comments:</span>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editFormData.averageComments || 0}
                            onChange={(e) => setEditFormData({...editFormData, averageComments: parseInt(e.target.value) || 0})}
                            className="border rounded px-2 py-1 text-sm w-32"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.averageComments?.toLocaleString() || 'N/A'}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Image URL:</span>
                        {isEditMode ? (
                          <input
                            type="url"
                            value={editFormData.image || ''}
                            onChange={(e) => setEditFormData({...editFormData, image: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-48"
                            placeholder="https://..."
                          />
                        ) : (
                          <a href={selectedInfluencer.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate max-w-48">
                            View Image
                          </a>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Engagement:</span>
                        {isEditMode ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.1"
                              value={editFormData.averageEngagement || 0}
                              onChange={(e) => setEditFormData({...editFormData, averageEngagement: parseFloat(e.target.value) || 0})}
                              className="border rounded px-2 py-1 text-sm w-20"
                            />
                            <span className="text-sm">%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(selectedInfluencer.averageEngagement * 10, 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{selectedInfluencer.averageEngagement}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Instagram Data */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      Instagram Data
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Followers:</span>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editFormData.instagramData?.followers || 0}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              instagramData: {
                                ...selectedInfluencer.instagramData,
                                ...editFormData.instagramData,
                                followers: parseInt(e.target.value) || 0
                              }
                            })}
                            className="border rounded px-2 py-1 text-sm w-32"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.instagramData?.followers?.toLocaleString() || 'N/A'}</span>
                        )}
                      </div>
                      
                      {/* Gender Distribution */}
                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">Gender Distribution:</h4>
                        <div className="space-y-1">
                          {selectedInfluencer.instagramData?.genderDistribution?.length > 0 ? (
                            selectedInfluencer.instagramData.genderDistribution.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.gender}:</span>
                                <span>{item.distribution}%</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">No data available</div>
                          )}
                        </div>
                      </div>

                      {/* Age Distribution */}
                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">Age Distribution:</h4>
                        <div className="space-y-1">
                          {selectedInfluencer.instagramData?.ageDistribution?.length > 0 ? (
                            selectedInfluencer.instagramData.ageDistribution.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.age}:</span>
                                <span>{item.value}%</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">No data available</div>
                          )}
                        </div>
                      </div>

                      {/* Audience by Country */}
                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">Audience by Country:</h4>
                        <div className="space-y-1">
                          {selectedInfluencer.instagramData?.audienceByCountry?.length > 0 ? (
                            selectedInfluencer.instagramData.audienceByCountry.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name}:</span>
                                <span>{item.value}%</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">No data available</div>
                          )}
                        </div>
                      </div>

                      {/* Collaboration Charges */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Collaboration Charges:</h4>
                        <div className="space-y-1">
                          {selectedInfluencer.instagramData?.collaborationCharges ? (
                            <>
                              <div className="flex justify-between">
                                <span>Reel:</span>
                                <span>${selectedInfluencer.instagramData.collaborationCharges.reel || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Story:</span>
                                <span>${selectedInfluencer.instagramData.collaborationCharges.story || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Post:</span>
                                <span>${selectedInfluencer.instagramData.collaborationCharges.post || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>One Month Digital Rights:</span>
                                <span>${selectedInfluencer.instagramData.collaborationCharges.oneMonthDigitalRights || 'N/A'}</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-gray-500">No data available</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* YouTube Data */}
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      YouTube Data
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-red-700">Followers:</span>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editFormData.youtubeData?.followers || 0}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              youtubeData: {
                                ...selectedInfluencer.youtubeData,
                                ...editFormData.youtubeData,
                                followers: parseInt(e.target.value) || 0
                              }
                            })}
                            className="border rounded px-2 py-1 text-sm w-32"
                          />
                        ) : (
                          <span className="font-medium">{selectedInfluencer.youtubeData?.followers?.toLocaleString() || 'N/A'}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-700">Channel Link:</span>
                        {isEditMode ? (
                          <input
                            type="url"
                            value={editFormData.youtubeData?.link || ''}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              youtubeData: {
                                ...selectedInfluencer.youtubeData,
                                ...editFormData.youtubeData,
                                link: e.target.value
                              }
                            })}
                            className="border rounded px-2 py-1 text-sm w-48"
                            placeholder="https://youtube.com/..."
                          />
                        ) : (
                          selectedInfluencer.youtubeData?.link ? (
                            <a 
                              href={selectedInfluencer.youtubeData.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm truncate max-w-48"
                            >
                              {selectedInfluencer.youtubeData.link}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )
                        )}
                      </div>
                      
                      {/* Gender Distribution */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Gender Distribution:</h4>
                        <div className="space-y-1">
                          {isEditMode ? (
                            <div className="space-y-2">
                              {(editFormData.youtubeData?.genderDistribution || selectedInfluencer.youtubeData.genderDistribution).map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={item.gender}
                                    onChange={(e) => {
                                      const updatedDistribution = [...(editFormData.youtubeData?.genderDistribution || selectedInfluencer.youtubeData.genderDistribution)];
                                      updatedDistribution[index] = { ...item, gender: e.target.value };
                                      setEditFormData({
                                        ...editFormData,
                                        youtubeData: {
                                          ...selectedInfluencer.youtubeData,
                                          ...editFormData.youtubeData,
                                          genderDistribution: updatedDistribution
                                        }
                                      });
                                    }}
                                    className="border rounded px-2 py-1 text-xs w-20"
                                    placeholder="Gender"
                                  />
                                  <input
                                    type="number"
                                    value={item.distribution}
                                    onChange={(e) => {
                                      const updatedDistribution = [...(editFormData.youtubeData?.genderDistribution || selectedInfluencer.youtubeData.genderDistribution)];
                                      updatedDistribution[index] = { ...item, distribution: parseFloat(e.target.value) || 0 };
                                      setEditFormData({
                                        ...editFormData,
                                        youtubeData: {
                                          ...selectedInfluencer.youtubeData,
                                          ...editFormData.youtubeData,
                                          genderDistribution: updatedDistribution
                                        }
                                      });
                                    }}
                                    className="border rounded px-2 py-1 text-xs w-16"
                                    placeholder="%"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedDistribution = (editFormData.youtubeData?.genderDistribution || selectedInfluencer.youtubeData.genderDistribution).filter((_: any, i: number) => i !== index);
                                      setEditFormData({
                                        ...editFormData,
                                        youtubeData: {
                                          ...selectedInfluencer.youtubeData,
                                          ...editFormData.youtubeData,
                                          genderDistribution: updatedDistribution
                                        }
                                      });
                                    }}
                                    className="text-red-600 hover:text-red-800 text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const currentDistribution = editFormData.youtubeData?.genderDistribution || selectedInfluencer.youtubeData.genderDistribution;
                                  const updatedDistribution = [...currentDistribution, { gender: '', distribution: 0, _id: `temp_${Date.now()}` }];
                                  setEditFormData({
                                    ...editFormData,
                                    youtubeData: {
                                      ...selectedInfluencer.youtubeData,
                                      ...editFormData.youtubeData,
                                      genderDistribution: updatedDistribution
                                    }
                                  });
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                + Add Gender
                              </button>
                            </div>
                          ) : (
                            selectedInfluencer.youtubeData?.genderDistribution?.length > 0 ? (
                              selectedInfluencer.youtubeData.genderDistribution.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.gender}:</span>
                                  <span className="font-medium">{item.distribution}%</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500">No data available</div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Age Distribution */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Age Distribution:</h4>
                        <div className="space-y-1">
                          {isEditMode ? (
                            <div className="space-y-2">
                              {(editFormData.youtubeData?.ageDistribution || selectedInfluencer.youtubeData.ageDistribution).map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={item.age}
                                    onChange={(e) => {
                                      const updatedDistribution = [...(editFormData.youtubeData?.ageDistribution || selectedInfluencer.youtubeData.ageDistribution)];
                                      updatedDistribution[index] = { ...item, age: e.target.value };
                                      setEditFormData({
                                        ...editFormData,
                                        youtubeData: {
                                          ...selectedInfluencer.youtubeData,
                                          ...editFormData.youtubeData,
                                          ageDistribution: updatedDistribution
                                        }
                                      });
                                    }}
                                    className="border rounded px-2 py-1 text-xs w-20"
                                    placeholder="Age Range"
                                  />
                                  <input
                                    type="number"
                                    value={item.value}
                                    onChange={(e) => {
                                      const updatedDistribution = [...(editFormData.youtubeData?.ageDistribution || selectedInfluencer.youtubeData.ageDistribution)];
                                      updatedDistribution[index] = { ...item, value: parseFloat(e.target.value) || 0 };
                                      setEditFormData({
                                        ...editFormData,
                                        youtubeData: {
                                          ...selectedInfluencer.youtubeData,
                                          ...editFormData.youtubeData,
                                          ageDistribution: updatedDistribution
                                        }
                                      });
                                    }}
                                    className="border rounded px-2 py-1 text-xs w-16"
                                    placeholder="%"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedDistribution = (editFormData.youtubeData?.ageDistribution || selectedInfluencer.youtubeData.ageDistribution).filter((_: any, i: number) => i !== index);
                                      setEditFormData({
                                        ...editFormData,
                                        youtubeData: {
                                          ...selectedInfluencer.youtubeData,
                                          ...editFormData.youtubeData,
                                          ageDistribution: updatedDistribution
                                        }
                                      });
                                    }}
                                    className="text-red-600 hover:text-red-800 text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const currentDistribution = editFormData.youtubeData?.ageDistribution || selectedInfluencer.youtubeData.ageDistribution;
                                  const updatedDistribution = [...currentDistribution, { age: '', value: 0, _id: `temp_${Date.now()}` }];
                                  setEditFormData({
                                    ...editFormData,
                                    youtubeData: {
                                      ...selectedInfluencer.youtubeData,
                                      ...editFormData.youtubeData,
                                      ageDistribution: updatedDistribution
                                    }
                                  });
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                + Add Age Range
                              </button>
                            </div>
                          ) : (
                            selectedInfluencer.youtubeData?.ageDistribution?.length > 0 ? (
                              selectedInfluencer.youtubeData.ageDistribution.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.age}:</span>
                                  <span className="font-medium">{item.value}%</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500">No data available</div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Audience by Country */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Audience by Country:</h4>
                        <div className="space-y-1">
                          {selectedInfluencer.youtubeData?.audienceByCountry?.length > 0 ? (
                            selectedInfluencer.youtubeData.audienceByCountry.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name}:</span>
                                <span className="font-medium">{item.value}%</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">No data available</div>
                          )}
                        </div>
                      </div>

                      {/* Collaboration Charges */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Collaboration Charges:</h4>
                        <div className="space-y-1">
                          {selectedInfluencer.youtubeData?.collaborationCharges ? (
                            <>
                              <div className="flex justify-between">
                                <span>Reel:</span>
                                <span>${selectedInfluencer.youtubeData.collaborationCharges.reel || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Story:</span>
                                <span>${selectedInfluencer.youtubeData.collaborationCharges.story || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Post:</span>
                                <span>${selectedInfluencer.youtubeData.collaborationCharges.post || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>One Month Digital Rights:</span>
                                <span>${selectedInfluencer.youtubeData.collaborationCharges.oneMonthDigitalRights || 'N/A'}</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-gray-500">No data available</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                {isEditMode ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setEditFormData(selectedInfluencer);
                      }}
                      disabled={updateLoading}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSubmit}
                      disabled={updateLoading}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {updateLoading && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    {role === "admin" && (
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Edit Influencer
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerListPage;