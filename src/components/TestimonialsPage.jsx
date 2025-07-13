import { useState, useEffect } from "react"
import { getTestimonials, deleteTestimonial, approveTestimonial, updateTestimonial } from "./contexts/firestore"
import { Check, Edit, Trash2, MessageSquare, Star } from "lucide-react"
import LoadingSpinner from "../utils/ui"

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [filter, setFilter] = useState("all") // all, pending, approved
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      toast.error("Failed to fetch testimonials")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      await approveTestimonial(id)
      setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, status: "approved" } : t)))
      toast.success("Testimonial approved successfully")
    } catch (error) {
      console.error("Error approving testimonial:", error)
      toast.error("Failed to approve testimonial")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the testimonial from ${name}?`)) {
      return
    }

    setActionLoading(id)
    try {
      await deleteTestimonial(id)
      setTestimonials(testimonials.filter((t) => t.id !== id))
      toast.success("Testimonial deleted successfully")
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      toast.error("Failed to delete testimonial")
    } finally {
      setActionLoading(null)
    }
  }

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id)
    setEditForm({
      name: testimonial.name,
      designation: testimonial.designation,
      company: testimonial.company,
      text: testimonial.text,
    })
  }

  const handleSaveEdit = async (id) => {
    setActionLoading(id)
    try {
      await updateTestimonial(id, editForm)
      setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, ...editForm } : t)))
      setEditingId(null)
      setEditForm({})
      toast.success("Testimonial updated successfully")
    } catch (error) {
      console.error("Error updating testimonial:", error)
      toast.error("Failed to update testimonial")
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (filter === "pending") return testimonial.status === "pending"
    if (filter === "approved") return testimonial.status === "approved"
    return true
  })

  const pendingCount = testimonials.filter((t) => t.status === "pending").length
  const approvedCount = testimonials.filter((t) => t.status === "approved").length

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Manage client testimonials and reviews</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All ({testimonials.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "pending" ? "bg-yellow-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "approved" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      {filteredTestimonials.length === 0 ? (
        <div className="card text-center py-12">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === "pending"
              ? "No pending testimonials"
              : filter === "approved"
                ? "No approved testimonials"
                : "No testimonials yet"}
          </h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "Testimonials will appear here when clients submit them"
              : `No ${filter} testimonials found`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`card p-3 rounded-md ${testimonial.status === "pending" ? "border-yellow-200 bg-gray-900" : "bg-blue-400"}`}
            >
              {editingId === testimonial.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={editForm.designation}
                      onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Designation"
                    />
                  </div>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Company"
                  />
                  <textarea
                    value={editForm.text}
                    onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical flex-1"
                    rows={4}
                    placeholder="Testimonial text"
                  />
                  <div className="flex justify-end space-x-2">
                    <button onClick={handleCancelEdit} className="bg-red-400 py-2 px-4 rounded-md text-white">
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(testimonial.id)}
                      disabled={actionLoading === testimonial.id}
                      className="bg-gray-400 py-2 px-4 rounded-md flex items-center"
                    >
                      {actionLoading === testimonial.id ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Saving...</span>
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.photoUrl || "/placeholder.svg?height=60&width=60"}
                        alt={testimonial.name}
                        className="w-15 h-15 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                        <p className="text-gray-600">
                          {testimonial.designation} @ {testimonial.company}
                        </p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          testimonial.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {testimonial.status === "approved" ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 italic mb-6">"{testimonial.text}"</blockquote>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      Submitted on{" "}
                      {testimonial.createdAt && new Date(testimonial.createdAt.seconds * 1000).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {testimonial.status === "pending" && (
                        <button
                          onClick={() => handleApprove(testimonial.id)}
                          disabled={actionLoading === testimonial.id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Approve testimonial"
                        >
                          {actionLoading === testimonial.id ? <LoadingSpinner size="sm" /> : <Check size={18} />}
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit testimonial"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id, testimonial.name)}
                        disabled={actionLoading === testimonial.id}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete testimonial"
                      >
                        {actionLoading === testimonial.id ? <LoadingSpinner size="sm" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TestimonialsPage
