import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye, FaVideo, FaGripVertical } from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Table Row Component
const SortableTableRow = ({ testimonial, onEdit, onDelete, onToggleActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 transition-colors ${
        isDragging ? 'bg-blue-50 shadow-lg z-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <td className="px-4 py-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaGripVertical size={20} />
        </div>
      </td>

      {/* Video */}
      <td className="px-4 py-4">
        <div className="relative w-32 h-20 bg-gray-200 rounded-lg overflow-hidden shadow-sm group">
          {testimonial.video_url.includes('cloudinary') ? (
             <video
              src={testimonial.video_url}
              className="w-full h-full object-cover"
              muted
            />
          ) : (
            <iframe
              src={testimonial.video_url}
              className="w-full h-full object-cover pointer-events-none"
              title={testimonial.name}
              frameBorder="0"
            ></iframe>
          )}
         
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FaVideo className="text-white text-2xl" />
          </div>
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-4">
        <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
      </td>

      {/* Prefix */}
      <td className="px-4 py-4">
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
          {testimonial.prefix}
        </span>
      </td>

      {/* Views */}
      <td className="px-4 py-4">
        <span className="flex items-center gap-2 text-sm text-gray-600">
          <FaEye className="text-gray-400" /> {testimonial.views || 0}
        </span>
      </td>

      {/* Status Toggle */}
      <td className="px-4 py-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={testimonial.is_active}
            onChange={() => onToggleActive(testimonial.id)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
        </label>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(testimonial)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(testimonial.id)}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

const TestimonialAdminPortal = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [stats, setStats] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeId, setActiveId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    prefix: 'None',
    video: null,
    video_url: '',
    inputType: 'file' // 'file' or 'url'
  });

  const [videoPreview, setVideoPreview] = useState(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/testimonials`);
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/testimonials/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end and update order
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = testimonials.findIndex((item) => item.id === active.id);
      const newIndex = testimonials.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(testimonials, oldIndex, newIndex);
      setTestimonials(newOrder);

      // Update order in backend
      try {
        const orderData = newOrder.map((item, index) => ({
          id: item.id,
          order: index,
        }));
        
        console.log('Saving new order:', orderData);

        const response = await fetch(`${API_URL}/testimonials/reorder`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order: orderData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save order');
        }
        
        console.log('Order saved successfully');
      } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to save new order. Please try again.');
        // Revert on error
        fetchTestimonials();
      }
    }

    setActiveId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Video file size must be less than 100MB');
        return;
      }

      setFormData((prev) => ({ ...prev, video: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      prefix: 'None',
      video: null,
      video_url: '',
      inputType: 'url'
    });
    setVideoPreview(null);
    setEditMode(false);
    setCurrentTestimonial(null);
    setShowModal(true);
    setSubmitting(false);
    setUploadProgress(0);
  };

  const openEditModal = (testimonial) => {
    const isFile = testimonial.video_url.includes('cloudinary');
    setFormData({
      name: testimonial.name,
      prefix: testimonial.prefix,
      video: null,
      video_url: isFile ? '' : testimonial.video_url,
      inputType: isFile ? 'file' : 'url'
    });
    setVideoPreview(testimonial.video_url);
    setEditMode(true);
    setCurrentTestimonial(testimonial);
    setShowModal(true);
    setSubmitting(false);
    setUploadProgress(0);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      prefix: 'None',
      video: null,
      video_url: '',
      inputType: 'file'
    });
    setVideoPreview(null);
    setEditMode(false);
    setCurrentTestimonial(null);
    setSubmitting(false);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!editMode) {
       if (formData.inputType === 'file' && !formData.video) {
        alert('Please select a video file');
        return;
       }
       if (formData.inputType === 'url' && !formData.video_url) {
        alert('Please enter a video URL');
        return;
       }
    }

    setSubmitting(true);
    setUploadProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('prefix', formData.prefix);

    if (formData.inputType === 'file' && formData.video) {
      formDataToSend.append('video', formData.video);
    } else if (formData.inputType === 'url' && formData.video_url) {
       formDataToSend.append('video_url', formData.video_url);
    }

    try {
      const url = editMode
        ? `${API_URL}/testimonials/${currentTestimonial.id}`
        : `${API_URL}/testimonials`;

      const method = editMode ? 'PUT' : 'POST';

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            alert(
              editMode
                ? 'Testimonial updated successfully!'
                : 'Testimonial created successfully!'
            );
            fetchTestimonials();
            fetchStats();
            closeModal();
          } else {
            alert('Error: ' + data.message);
            setSubmitting(false);
          }
        } else {
          alert('Error: Upload failed');
          setSubmitting(false);
        }
      });

      xhr.addEventListener('error', () => {
        alert('An error occurred during upload');
        setSubmitting(false);
      });

      xhr.open(method, url);
      xhr.send(formDataToSend);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Testimonial deleted successfully!');
        fetchTestimonials();
        fetchStats();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('An error occurred while deleting the testimonial');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`${API_URL}/testimonials/${id}/toggle`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (data.success) {
        fetchTestimonials();
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

  const activeTestimonial = testimonials.find((t) => t.id === activeId);

  return (
    <div className="p-4 md:p-8 w-full mx-auto bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Testimonial Management Portal
        </h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <FaPlus /> Add New Testimonial
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">
              {stats.total_testimonials}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">
              Total Videos
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
              {stats.active_testimonials}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">
              Active
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
              {stats.inactive_testimonials}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">
              Inactive
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
              {stats.total_views || 0}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">
              Total Views
            </p>
          </div>
        </div>
      )}

      {/* Drag and Drop Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <FaGripVertical className="text-blue-500" />
          <span className="font-semibold">Drag and drop</span> testimonials to reorder them. Changes are saved automatically.
        </p>
      </div>

      {/* Table with Drag and Drop */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Order
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Video
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Prefix
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Views
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <SortableContext
                  items={testimonials.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {testimonials.map((testimonial) => (
                    <SortableTableRow
                      key={testimonial.id}
                      testimonial={testimonial}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeId && activeTestimonial ? (
                <table className="bg-white shadow-2xl rounded-lg border-2 border-purple-500">
                  <tbody>
                    <tr className="opacity-90">
                      <td className="px-4 py-4">
                        <FaGripVertical size={20} className="text-purple-500" />
                      </td>
                      <td className="px-4 py-4">
                         <div className="relative w-32 h-20 bg-gray-200 rounded-lg overflow-hidden">
                          {activeTestimonial.video_url.includes('cloudinary') ? (
                             <video
                               src={activeTestimonial.video_url}
                               className="w-full h-full object-cover"
                               muted
                             />
                          ) : (
                            <iframe
                              src={activeTestimonial.video_url}
                              className="w-full h-full object-cover pointer-events-none"
                              title={activeTestimonial.name}
                              frameBorder="0"
                            ></iframe>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {activeTestimonial.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {activeTestimonial.prefix}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No testimonials found. Add your first testimonial!
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
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button
                onClick={closeModal}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prefix *
                  </label>
                  <select
                    name="prefix"
                    value={formData.prefix}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="None">None</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
              </div>

               {/* Video Input Type Selection */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    formData.inputType === 'file'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, inputType: 'file' }))}
                >
                  Upload Video
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    formData.inputType === 'url'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, inputType: 'url' }))}
                >
                  Video URL (Vimeo/YouTube)
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.inputType === 'file' ? 'Video File' : 'Video URL'} {editMode ? '(Optional)' : '*'}
                </label>
                
                {formData.inputType === 'file' ? (
                  <>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      disabled={submitting}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Maximum file size: 100MB. Supported formats: MP4, AVI, MOV, WebM
                    </p>
                  </>
                ) : (
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="https://player.vimeo.com/video/..."
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                )}

                {(videoPreview || (formData.inputType === 'url' && formData.video_url)) && (
                  <div className="mt-4">
                    {formData.inputType === 'file' || (videoPreview && !videoPreview.startsWith('http')) ? (
                         <video
                          src={videoPreview}
                          controls
                          className="w-full h-64 rounded-lg shadow-md"
                        />
                    ) : (
                        <iframe
                          src={formData.inputType === 'url' ? formData.video_url : videoPreview}
                          className="w-full h-64 rounded-lg shadow-md"
                          title="Preview"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                        ></iframe>
                    )}
                  </div>
                )}
              </div>

              {submitting && uploadProgress > 0 && formData.inputType === 'file' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

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
                  className="w-full md:w-auto px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      {editMode ? 'Update Testimonial' : 'Create Testimonial'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialAdminPortal;
