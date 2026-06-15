import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaImage, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdAdminPortal = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [stats, setStats] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    image: null,
    button_text: '',
    button_link: '',
    has_button: false
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [adType, setAdType] = useState('single');
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetchAds();
    fetchStats();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/ads`);
      const data = await response.json();
      if (data.success) {
        setAds(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ads:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/ads/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Image file size must be less than 10MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Slideshow management
  const addSlide = () => {
    setSlides(prev => [
      ...prev,
      {
        id: 'new_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        file: null,
        preview: null,
        image_url: '',
        cloudinary_id: '',
        has_button: false,
        button_text: '',
        button_link: ''
      }
    ]);
  };

  const removeSlide = (id) => {
    setSlides(prev => prev.filter(s => s.id !== id));
  };

  const handleSlideInputChange = (id, field, value) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSlideCheckboxChange = (id, e) => {
    const checked = e.target.checked;
    setSlides(prev => prev.map(s => s.id === id ? { ...s, has_button: checked } : s));
  };

  const handleSlideImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Image file size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSlides(prev => prev.map(s => s.id === id ? { ...s, file: file, preview: reader.result } : s));
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setFormData({ image: null, button_text: '', button_link: '', has_button: false });
    setImagePreview(null);
    setAdType('single');
    setSlides([]);
    setEditMode(false);
    setCurrentAd(null);
    setShowModal(true);
    setSubmitting(false);
  };

  const openEditModal = (ad) => {
    const hasBtn = !!(ad.button_text || ad.button_link);
    setAdType(ad.type || 'single');

    if (ad.type === 'carousel') {
      const carouselSlides = (ad.images || []).map((s, idx) => ({
        id: `slide_${idx}_${Date.now()}`,
        file: null,
        preview: null,
        image_url: s.image_url,
        cloudinary_id: s.cloudinary_id,
        has_button: !!(s.button_text || s.button_link),
        button_text: s.button_text || '',
        button_link: s.button_link || ''
      }));
      setSlides(carouselSlides);
      
      setFormData({
        image: null,
        button_text: '',
        button_link: '',
        has_button: false
      });
      setImagePreview(null);
    } else {
      setFormData({ 
        image: null, 
        button_text: ad.button_text || '', 
        button_link: ad.button_link || '',
        has_button: hasBtn
      });
      setImagePreview(ad.image_url);
      setSlides([]);
    }

    setEditMode(true);
    setCurrentAd(ad);
    setShowModal(true);
    setSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ image: null, button_text: '', button_link: '', has_button: false });
    setImagePreview(null);
    setAdType('single');
    setSlides([]);
    setEditMode(false);
    setCurrentAd(null);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;

    if (adType === 'single') {
      if (!editMode && !formData.image) {
        alert('Please select an image file');
        return;
      }
    } else {
      if (slides.length === 0) {
        alert('Please add at least one slide for the carousel');
        return;
      }
      
      const missingImage = slides.some(s => !s.file && !s.image_url);
      if (missingImage) {
        alert('Please select an image file for all slides');
        return;
      }
    }

    setSubmitting(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('type', adType);
    
    if (adType === 'single') {
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      formDataToSend.append('button_text', formData.has_button ? formData.button_text : '');
      formDataToSend.append('button_link', formData.has_button ? formData.button_link : '');
    } else {
      const slidesMetadata = [];
      let fileCounter = 0;

      slides.forEach((slide) => {
        const metadata = {
          button_text: slide.has_button ? slide.button_text : '',
          button_link: slide.has_button ? slide.button_link : '',
          image_url: slide.image_url || '',
          cloudinary_id: slide.cloudinary_id || '',
          fileIndex: -1
        };

        if (slide.file) {
          metadata.fileIndex = fileCounter;
          formDataToSend.append(`slide_image_${fileCounter}`, slide.file);
          fileCounter++;
        }

        slidesMetadata.push(metadata);
      });

      formDataToSend.append('slides', JSON.stringify(slidesMetadata));
      if (slides.length > 0) {
        const first = slides[0];
        formDataToSend.append('button_text', first.has_button ? first.button_text : '');
        formDataToSend.append('button_link', first.has_button ? first.button_link : '');
      }
    }

    try {
      const url = editMode 
        ? `${API_URL}/ads/${currentAd.id}` 
        : `${API_URL}/ads`;
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editMode ? 'Ad updated successfully!' : 'Ad created successfully!');
        fetchAds();
        fetchStats();
        closeModal();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/ads/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Ad deleted successfully!');
        fetchAds();
        fetchStats();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('An error occurred while deleting the ad');
    }
  };

  const handleSetActive = async (id) => {
    try {
      const response = await fetch(`${API_URL}/ads/${id}/set-active`, {
        method: 'PATCH'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Ad visibility toggled successfully!');
        fetchAds();
        fetchStats();
      }
    } catch (error) {
      console.error('Error activating ad:', error);
      alert('An error occurred while activating the ad');
    }
  };

  const handleDeactivateAll = async () => {
    if (!window.confirm('Are you sure you want to hide the popup from the website?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/ads/deactivate-all`, {
        method: 'PATCH'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('All ads deactivated! The popup is now hidden from the website.');
        fetchAds();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deactivating ads:', error);
      alert('An error occurred while deactivating ads');
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
    <div className="p-4 md:p-8 w-full bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ad Popup Management Portal</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleDeactivateAll}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FaTimesCircle /> Hide Popup
          </button>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FaPlus /> Add New Ad
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
              {stats.total_ads}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">Total Ads</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
              {stats.active_ads}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">Active Ads</p>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> You can activate MULTIPLE ads at the same time. All active ads will automatically form a sliding carousel on the website popup!
        </p>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div 
            key={ad.id} 
            className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow ${ad.is_active ? 'ring-4 ring-green-500' : ''}`}
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-200 overflow-hidden group">
              <img 
                src={ad.image_url}
                alt="Ad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {ad.type === 'carousel' ? `SLIDESHOW (${ad.images?.length || 0})` : 'SINGLE AD'}
              </div>
              {ad.is_active && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <FaCheckCircle /> ACTIVE
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSetActive(ad.id)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    ad.is_active 
                      ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {ad.is_active ? 'Deactivate' : 'Set as Active'}
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(ad)}
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(ad.id)}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                Created: {new Date(ad.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {ads.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md">
          <FaImage className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-lg">No ads found. Add your first ad!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={closeModal}
        >
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-250 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {editMode ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Form Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Ad Type Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Ad Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAdType('single')}
                    disabled={submitting}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      adType === 'single'
                        ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-750 bg-white'
                    }`}
                  >
                    <FaImage size={24} className="mb-2" />
                    <span className="font-bold text-sm">Single Image</span>
                    <span className="text-[11px] text-gray-400 mt-1 font-normal text-center hidden sm:block">A simple banner image with optional link button</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdType('carousel')}
                    disabled={submitting}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      adType === 'carousel'
                        ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-750 bg-white'
                    }`}
                  >
                    <FaImage size={24} className="mb-2" />
                    <span className="font-bold text-sm">Slideshow / Carousel</span>
                    <span className="text-[11px] text-gray-400 mt-1 font-normal text-center hidden sm:block">Multiple slides rotating automatically in a single ad</span>
                  </button>
                </div>
              </div>

              {adType === 'single' ? (
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Ad Image {editMode ? '(Leave empty to keep current image)' : '*'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editMode}
                      disabled={submitting}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    <p className="text-[11px] text-gray-400">Supported formats: JPG, PNG, WebP. Recommended size: 900x600px. Max: 10MB</p>
                    
                    {imagePreview && (
                      <div className="mt-4 flex justify-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto">
                        <img 
                          src={imagePreview} 
                          alt="Preview"
                          className="max-h-48 w-auto rounded-lg border object-contain bg-black"
                        />
                      </div>
                    )}
                  </div>

                  {/* Toggle button check */}
                  <div className="flex items-center justify-between bg-blue-50/30 p-4 rounded-xl border border-blue-55">
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-gray-800">
                        Add Call-to-Action (CTA) Button
                      </label>
                      <span className="text-xs text-gray-500">
                        Show a custom button below the image that leads to a link
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="has_button"
                        checked={formData.has_button}
                        onChange={handleCheckboxChange}
                        disabled={submitting}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Button Details */}
                  {formData.has_button && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Button Text
                        </label>
                        <input
                          type="text"
                          name="button_text"
                          value={formData.button_text}
                          onChange={handleInputChange}
                          placeholder="e.g., Register Now"
                          disabled={submitting}
                          required={formData.has_button}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Button Link
                        </label>
                        <input
                          type="url"
                          name="button_link"
                          value={formData.button_link}
                          onChange={handleInputChange}
                          placeholder="https://..."
                          disabled={submitting}
                          required={formData.has_button}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">Slides ({slides.length})</h3>
                      <p className="text-xs text-gray-500">Manage slideshow carousel elements</p>
                    </div>
                    <button
                      type="button"
                      onClick={addSlide}
                      disabled={submitting}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      <FaPlus size={10} /> Add Slide
                    </button>
                  </div>

                  {slides.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-250 rounded-2xl text-gray-400 bg-gray-50/50">
                      <FaImage className="mx-auto text-4xl text-gray-300 mb-3" />
                      <p className="text-sm font-semibold text-gray-600">No slides added yet</p>
                      <p className="text-xs text-gray-400 mt-1">Click "+ Add Slide" to start building your carousel.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {slides.map((slide, index) => (
                      <div key={slide.id} className="p-5 border border-gray-200 rounded-2xl bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <h4 className="font-bold text-gray-800 text-sm">Slide #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeSlide(slide.id)}
                            disabled={submitting}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer border border-transparent hover:border-red-200"
                            title="Remove Slide"
                          >
                            <FaTrash size={12} /> Remove
                          </button>
                        </div>

                        {/* Image Selection */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Slide Image {slide.image_url ? '(Optional - Keep current)' : '(Required)'}
                          </label>
                          
                          <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50/50 p-3 rounded-xl border border-gray-200">
                            <div className="flex-1 w-full">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleSlideImageChange(slide.id, e)}
                                required={!slide.image_url && !slide.preview}
                                disabled={submitting}
                                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                              />
                              <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WebP. Max 10MB.</p>
                            </div>

                            {(slide.preview || slide.image_url) && (
                              <div className="flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-black h-16 w-16 flex items-center justify-center shadow-inner">
                                <img
                                  src={slide.preview || slide.image_url}
                                  alt={`Slide ${index + 1} Preview`}
                                  className="h-16 w-16 object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Button Configuration */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between bg-blue-50/30 p-3 rounded-xl border border-blue-50">
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-gray-850">
                                Add Call-to-Action (CTA) Button
                              </label>
                              <span className="text-[10px] text-gray-500">Show button on this slide</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                id={`has_button_${slide.id}`}
                                checked={slide.has_button}
                                onChange={(e) => handleSlideCheckboxChange(slide.id, e)}
                                disabled={submitting}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          {slide.has_button && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  Button Text
                                </label>
                                <input
                                  type="text"
                                  value={slide.button_text}
                                  onChange={(e) => handleSlideInputChange(slide.id, 'button_text', e.target.value)}
                                  placeholder="e.g., Register Now"
                                  required={slide.has_button}
                                  disabled={submitting}
                                  className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  Button Link
                                </label>
                                <input
                                  type="url"
                                  value={slide.button_link}
                                  onChange={(e) => handleSlideInputChange(slide.id, 'button_link', e.target.value)}
                                  placeholder="https://..."
                                  required={slide.has_button}
                                  disabled={submitting}
                                  className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button 
                type="button" 
                onClick={closeModal}
                disabled={submitting}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-250 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer hover:-translate-y-[1px]"
              >
                {submitting ? (
                  <>
                    <svg 
                      className="animate-spin h-4 w-4 text-white" 
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
                    {editMode ? 'Update Ad' : 'Add Ad'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdAdminPortal;
