import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { addProject, updateProject, getProjects } from "./contexts/firestore"
import { uploadToCloudinary } from "../lib/cloudinary"
import LoadingSpinner from "../utils/ui"
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react"

const ProjectForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      liveUrl: "",
      sourceUrl: "",
      tags: [{ name: "", color: "#3B82F6" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  })

  const watchedImageUrl = watch("imageUrl")

  useEffect(() => {
    if (isEditing) {
      loadProject()
    }
  }, [id, isEditing])

  useEffect(() => {
    setImagePreview(watchedImageUrl)
  }, [watchedImageUrl])

  const loadProject = async () => {
    try {
      const projects = await getProjects()
      const project = projects.find((proj) => proj.id === id)

      if (project) {
        setValue("name", project.name)
        setValue("description", project.description)
        setValue("imageUrl", project.imageUrl || "")
        setValue("liveUrl", project.liveUrl || "")
        setValue("sourceUrl", project.sourceUrl || "")
        setValue("tags", project.tags || [{ name: "", color: "#3B82F6" }])
        setImagePreview(project.imageUrl || "")
      }
    } catch (error) {
      console.error("Error loading project:", error)
      // toast.error("Failed to load project")
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setImageUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setValue("imageUrl", url)
      setImagePreview(url)
      // toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      // toast.error("Failed to upload image")
    } finally {
      setImageUploading(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const projectData = {
        ...data,
        tags: data.tags.filter((tag) => tag.name.trim() !== ""),
      }

      if (isEditing) {
        await updateProject(id, projectData)
        // toast.success("Project updated successfully")
      } else {
        await addProject(projectData)
        // toast.success("Project added successfully")
      }
      navigate("/projects")
    } catch (error) {
      console.error("Error saving project:", error)
      // toast.error("Failed to save project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/projects")}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isEditing ? "Edit Project" : "Add New Project"}</h1>
          <p className="text-gray-600">
            {isEditing ? "Update the project details" : "Add a new project to your portfolio"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
        <div className="card space-y-6">
          {/* Basic Information */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...register("name", { required: "Project name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical flex-1"
              placeholder="Describe your project, technologies used, and key features..."
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Project Image</label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Project preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label
                  htmlFor="image-upload"
                  className="btn-secondary cursor-pointer flex items-center justify-center w-full max-w-md"
                >
                  {imageUploading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-400 mb-2">
                Live Demo URL
              </label>
              <input
                type="url"
                id="liveUrl"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://your-project.com"
                {...register("liveUrl")}
              />
            </div>

            <div>
              <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-400 mb-2">
                Source Code URL
              </label>
              <input
                type="url"
                id="sourceUrl"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://github.com/username/project"
                {...register("sourceUrl")}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-400">Technologies & Tags</label>
              <button
                type="button"
                onClick={() => append({ name: "", color: "#3B82F6" })}
                className="btn-secondary flex items-center text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Tag
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-3">
                  <input
                    type="text"
                    className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tag name (e.g., React, Node.js)"
                    {...register(`tags.${index}.name`)}
                  />
                  <input
                    type="color"
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    {...register(`tags.${index}.color`)}
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button type="button" onClick={() => navigate("/projects")} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">{isEditing ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <span>{isEditing ? "Update Project" : "Add Project"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm
