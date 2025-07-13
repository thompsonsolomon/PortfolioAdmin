import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Edit, Trash2, Building } from "lucide-react"
import { deleteExperience, getExperiences } from "./contexts/firestore"
import LoadingSpinner from "../utils/ui"
import { formatDateRange } from "../lib/utils"

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const data = await getExperiences()
      setExperiences(data)
    } catch (error) {
      console.error("Error fetching experiences:", error)
      toast.error("Failed to fetch experiences")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    setDeleteLoading(id)
    try {
      await deleteExperience(id)
      setExperiences(experiences.filter((exp) => exp.id !== id))
      // toast.success("Experience deleted successfully")
    } catch (error) {
      console.error("Error deleting experience:", error)
      // toast.error("Failed to delete experience")
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Work Experiences</h1>
          <p className="text-gray-600">Manage your work experience entries</p>
        </div>
        <Link to="/experiences/new" className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Add Experience
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="card text-center py-12">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No experiences yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first work experience</p>
          <Link to="/experiences/new" className="btn-primary">
            Add Experience
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: experience.backgroundColor || "#3B82F6" }}
                  >
                    {experience.iconUrl ? (
                      <img
                        src={experience.iconUrl || "/placeholder.svg"}
                        alt={experience.company}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <Building className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{experience.title}</h3>
                      <span className="text-sm text-gray-500">
                        {formatDateRange(experience.startDate, experience.endDate)}
                      </span>
                    </div>
                    <p className="text-lg text-primary-600 mb-3">{experience.company}</p>
                    {experience.bulletPoints && experience.bulletPoints.length > 0 && (
                      <ul className="space-y-1">
                        {experience.bulletPoints.slice(0, 2).map((point, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <span className="text-primary-600 mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                        {experience.bulletPoints.length > 2 && (
                          <li className="text-sm text-gray-500 ml-4">
                            +{experience.bulletPoints.length - 2} more points
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/experiences/edit/${experience.id}`}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(experience.id, experience.title)}
                    disabled={deleteLoading === experience.id}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === experience.id ? <LoadingSpinner size="sm" /> : <Trash2 size={18} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperiencesPage
