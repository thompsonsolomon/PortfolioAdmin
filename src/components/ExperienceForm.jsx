import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { addExperience, updateExperience, getExperiences } from "./contexts/firestore"
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react"
import { uploadToCloudinary } from "../lib/cloudinary"
import LoadingSpinner from "../utils/ui"

const ExperienceForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)
  const [iconUploading, setIconUploading] = useState(false)
  const [iconPreview, setIconPreview] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      company_name: "",
      startDate: "",
      endDate: "",
      iconBg: "#3B82F6",
      icon: "",
      points: [""],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "points",
  })

  const watchedIconUrl = watch("icon")

  useEffect(() => {
    if (isEditing) {
      loadExperience()
    }
  }, [id, isEditing])

  useEffect(() => {
    setIconPreview(watchedIconUrl)
  }, [watchedIconUrl])

  const loadExperience = async () => {
    try {
      const experiences = await getExperiences()
      const experience = experiences.find((exp) => exp.id === id)

      if (experience) {
        setValue("title", experience.title)
        setValue("company_name", experience.company_name)
        setValue("startDate", experience.startDate)
        setValue("endDate", experience.endDate || "")
        setValue("iconBg", experience.iconBg || "#3B82F6")
        setValue("icon", experience.icon || "")
        setValue("points", experience.points || [""])
        setIconPreview(experience.icon || "")
      }
    } catch (error) {
      console.error("Error loading experience:", error)
      toast.error("Failed to load experience")
    }
  }

  const handleIconUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIconUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setValue("icon", url)
      setIconPreview(url)
      // toast.success("Icon uploaded successfully")
    } catch (error) {
      console.error("Error uploading icon:", error)
      // toast.error("Failed to upload icon")
    } finally {
      setIconUploading(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const experienceData = {
        ...data,
        points: data.points.filter((point) => point.trim() !== ""),
        startDate: data.startDate,
        endDate: data.endDate || null,
      }

      if (isEditing) {
        await updateExperience(id, experienceData)
        // toast.success("Experience updated successfully")
      } else {
        await addExperience(experienceData)
        // toast.success("Experience added successfully")
      }

      navigate("/admin/experiences")
    } catch (error) {
      console.error("Error saving experience:", error)
      // toast.error("Failed to save experience")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/admin/experiences")}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">{isEditing ? "Edit Experience" : "Add New Experience"}</h1>
          <p className="text-gray-400">
            {isEditing ? "Update the experience details" : "Add a new work experience entry"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
        <div className="card space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register("title", { required: "Job title is required" })}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-400 mb-2">
                Company *
              </label>
              <input
                type="text"
                id="company_name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register("company_name", { required: "Company is required" })}
              />
              {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-400 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register("startDate", { required: "Start date is required" })}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-2">
                End Date (Leave empty if current)
              </label>
              <input type="date" id="endDate" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" {...register("endDate")} />
            </div>
          </div>

          {/* Icon and Background Color */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Company Icon</label>
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center"
                  style={{ iconBg: watch("iconBg") }}
                >
                  {iconPreview ? (
                    <img
                      src={iconPreview || "/placeholder.svg"}
                      alt="Icon preview"
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleIconUpload} className="hidden" id="icon-upload" />
                  <label
                    htmlFor="icon-upload"
                    className="btn-secondary cursor-pointer flex items-center justify-center"
                  >
                    {iconUploading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        Upload Icon
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="iconBg" className="block text-sm font-medium text-gray-400 mb-2">
                Background Color
              </label>
              <input
                type="color"
                id="iconBg"
                className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                {...register("iconBg")}
              />
            </div>
          </div>

          {/* Bullet Points */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-400">Key Responsibilities & Achievements</label>
              <button type="button" onClick={() => append("")} className="btn-secondary flex items-center text-sm">
                <Plus size={16} className="mr-1" />
                Add Point
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start space-x-2">
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical flex-1"
                    placeholder={`Key point ${index + 1}...`}
                    {...register(`points.${index}`)}
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg mt-1"
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
            <button type="button" onClick={() => navigate("/admin/experiences")} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">{isEditing ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <span>{isEditing ? "Update Experience" : "Add Experience"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ExperienceForm
