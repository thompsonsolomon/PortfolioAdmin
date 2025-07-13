import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getProjects, deleteProject } from  "./contexts/firestore"
import { Plus, Edit, Trash2, FolderOpen, ExternalLink, Github } from "lucide-react"
import LoadingSpinner from "../utils/ui"

const ProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    setDeleteLoading(id)
    try {
      await deleteProject(id)
      setProjects(projects.filter((project) => project.id !== id))
      // toast.success("Project deleted successfully")
    } catch (error) {
      console.error("Error deleting project:", error)
      // toast.error("Failed to delete project")
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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your project portfolio</p>
        </div>
        <Link to="/projects/new" className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first project</p>
          <Link to="/projects/new" className="btn-primary">
            Add Project
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card hover:shadow-lg transition-shadow">
              <div className="relative mb-4">
                <img
                  src={project.imageUrl || "/placeholder.svg?height=200&width=300"}
                  alt={project.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Link
                    to={`/projects/edit/${project.id}`}
                    className="p-2 bg-white bg-opacity-90 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id, project.name)}
                    disabled={deleteLoading === project.id}
                    className="p-2 bg-white bg-opacity-90 text-gray-600 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === project.id ? <LoadingSpinner size="sm" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: tag.color + "20",
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Github size={16} />
                    </a>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {project.createdAt && new Date(project.createdAt.seconds * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectsPage
