import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye, FaInfoCircle } from 'react-icons/fa';

const NewsAdminPortal = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [stats, setStats] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: ['', '', ''],
    tag: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [showDimensionTooltip, setShowDimensionTooltip] = useState(false); // NEW: Tooltip visibility

  // Fetch all articles
  useEffect(() => {
    fetchArticles();
    fetchStats();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/news`);
      const data = await response.json();
      if (data.success) {
        setArticles(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/news/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Format current date and time for form defaults
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const time = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return { date, time };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (index, value) => {
    const newDesc = [...formData.description];
    newDesc[index] = value;
    setFormData(prev => ({ ...prev, description: newDesc }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    const { date, time } = getCurrentDateTime();
    setFormData({
      date,
      time,
      description: ['', '', ''],
      tag: '',
      image: null
    });
    setImagePreview(null);
    setImageDimensions(null);
    setShowDimensionTooltip(false);
    setEditMode(false);
    setCurrentArticle(null);
    setShowModal(true);
    setSubmitting(false);
  };

  const openEditModal = (article) => {
    setFormData({
      date: article.date,
      time: article.time,
      description: Array.isArray(article.description) 
        ? article.description 
        : JSON.parse(article.description),
      tag: article.tag,
      image: null
    });
    setImagePreview(article.image);
    setImageDimensions(null);
    setShowDimensionTooltip(false);
    setEditMode(true);
    setCurrentArticle(article);
    setShowModal(true);
    setSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      date: '',
      time: '',
      description: ['', '', ''],
      tag: '',
      image: null
    });
    setImagePreview(null);
    setImageDimensions(null);
    setShowDimensionTooltip(false);
    setEditMode(false);
    setCurrentArticle(null);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) {
      return;
    }

    setSubmitting(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('tag', formData.tag);
    
    const descriptions = formData.description.filter(d => d.trim() !== '');
    formDataToSend.append('description', JSON.stringify(descriptions));
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const url = editMode 
        ? `${API_URL}/news/${currentArticle.id}` 
        : `${API_URL}/news`;
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editMode ? 'Article updated successfully!' : 'Article created successfully!');
        fetchArticles();
        fetchStats();
        closeModal();
      } else {
        alert('Error: ' + data.message);
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Article deleted successfully!');
        fetchArticles();
        fetchStats();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('An error occurred while deleting the article');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`${API_URL}/news/${id}/toggle`, {
        method: 'PATCH'
      });

      const data = await response.json();
      
      if (data.success) {
        fetchArticles();
        fetchStats();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">News Management Portal</h1>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <FaPlus /> Create New Article
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
              {stats.total_articles}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">Total Articles</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
              {stats.active_articles}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">Active</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
              {stats.inactive_articles}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">Inactive</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">
              {stats.total_views || 0}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">Total Views</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tag</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img 
                      src={article.image} 
                      alt="News" 
                      className="w-24 h-16 object-cover rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{article.date}</div>
                    <div className="text-xs text-gray-500 mt-1">{article.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {article.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEye className="text-gray-400" /> {article.views || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={article.is_active}
                        onChange={() => handleToggleActive(article.id)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => openEditModal(article)}
                        className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                        title="Edit Article"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                        title="Delete Article"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articles found. Create your first article!
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button 
                onClick={closeModal}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="October 04, 2025"
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="12:25 PM"
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tag/Country *
                </label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  placeholder="Canada, Germany, India, etc."
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Description Paragraphs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description Paragraphs *
                </label>
                <div className="space-y-3">
                  {[0, 1, 2].map((index) => (
                    <textarea
                      key={index}
                      value={formData.description[index]}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder={`Paragraph ${index + 1} - Add detailed information here...`}
                      rows="3"
                      disabled={submitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  ))}
                </div>
              </div>

              {/* Image Upload with Recommendation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Article Image {editMode ? '(Leave empty to keep current image)' : '*'}
                </label>
                
                {/* Recommendation Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-4 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <FaInfoCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Recommended Image Specifications
                      </p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        For best results, upload an image with dimensions of <span className="font-bold">940 × 788 pixels</span>. 
                        This ensures optimal quality and proper display across all devices. Supported formats: JPG, PNG, WebP.
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editMode}
                  disabled={submitting}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
                />
                
                {imagePreview && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-600 font-medium">Image Preview:</p>
                      {imageDimensions && (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            imageDimensions.width === 940 && imageDimensions.height === 788
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-amber-100 text-amber-700 border border-amber-300'
                          }`}>
                            {imageDimensions.width} × {imageDimensions.height} px
                          </span>
                          {imageDimensions.width === 940 && imageDimensions.height === 788 ? (
                            <span className="text-xs text-green-600 font-medium">✓ Perfect!</span>
                          ) : (
                            <span className="text-xs text-amber-600 font-medium">⚠ Not recommended size</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Image with Hover Tooltip */}
                    <div 
                      className="relative group"
                      onMouseEnter={() => setShowDimensionTooltip(true)}
                      onMouseLeave={() => setShowDimensionTooltip(false)}
                    >
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-64 object-cover rounded-lg shadow-md border border-gray-200 cursor-pointer transition-all duration-200 group-hover:shadow-lg"
                      />
                      
                      {/* Hover Tooltip with Dimensions */}
                      {imageDimensions && showDimensionTooltip && (
                        <div className="absolute top-2 left-2 bg-black/80 text-white px-4 py-2 rounded-lg shadow-xl z-10 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <FaInfoCircle className="text-blue-400" size={14} />
                            <div className="text-xs">
                              <p className="font-bold">Dimensions</p>
                              <p className="mt-1">
                                Width: <span className="font-semibold">{imageDimensions.width}px</span>
                              </p>
                              <p>
                                Height: <span className="font-semibold">{imageDimensions.height}px</span>
                              </p>
                              <p className="mt-1 text-gray-300">
                                Ratio: {imageDimensions.width}:{imageDimensions.height}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Hover Overlay Effect */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg pointer-events-none"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse md:flex-row gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={submitting}
                  className="w-full md:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg 
                        className="animate-spin h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                           fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {editMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {editMode ? 'Update Article' : 'Create Article'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default NewsAdminPortal;
