import { useState } from "react"
import { useForm } from "react-hook-form"
import { trackEvent, trackPageView } from "../lib/analytics"
import { uploadToCloudinary } from "../lib/cloudinary"
import LoadingSpinner from "../utils/ui"
import { addTestimonial } from "./contexts/firestore"

const SubmitTestimonial = () => {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    useState(() => {
        trackPageView("/submit-testimonial")
    }, [])

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            let photoUrl = ""

            if (data.photo && data.photo[0]) {
                photoUrl = await uploadToCloudinary(data.photo[0])
            }

            await addTestimonial({
                name: data.name,
                designation: data.designation,
                company: data.company,
                text: data.testimonial,
                photoUrl,
            })

            trackEvent("testimonial_submitted", "engagement", "testimonial_form")
            // toast.success("Testimonial submitted successfully! It will be reviewed before publishing.")
            setSubmitted(true)
            reset()
        } catch (error) {
            console.error("Error submitting testimonial:", error)
            // toast.error("Failed to submit testimonial. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="py-16 bg-gray-900 h-[100dvh] flex justify-center items-center">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white-900 mb-4">Thank You!</h1>
                        <p className="text-lg text-gray-500 mb-8">
                            Your testimonial has been submitted successfully. It will be reviewed and published soon.
                        </p>
                        <button onClick={() => setSubmitted(false)} className="bg-gray-400 py-2 px-5 rounded-md">
                            Submit Another Testimonial
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-16 bg-gray-900 ">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-500 mb-4">Submit a Testimonial</h1>
                    <p className="text-lg text-gray-600">Share your experience working with me</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                            Full Name *
                        </label>
                        <input type="text" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            {...register("name", { required: "Name is required" })} />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-400 mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            id="designation"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            {...register("designation", { required: "Job title is required" })}
                        />
                        {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-400 mb-2">
                            Company *
                        </label>
                        <input
                            type="text"
                            id="company"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            {...register("company", { required: "Company is required" })}
                        />
                        {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="testimonial" className="block text-sm font-medium text-gray-400 mb-2">
                            Testimonial *
                        </label>
                        <textarea
                            id="testimonial"
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical flex-1"
                            placeholder="Share your experience working with me..."
                            {...register("testimonial", {
                                required: "Testimonial is required",
                                minLength: { value: 50, message: "Testimonial must be at least 50 characters" },
                            })}
                        />
                        {errors.testimonial && <p className="text-red-500 text-sm mt-1">{errors.testimonial.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-400 mb-2">
                            Profile Photo (Optional)
                        </label>
                        <input type="file" id="photo" accept="image/*" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            {...register("photo")} />
                        <p className="text-sm text-gray-500 mt-1">Upload a professional photo (JPG, PNG, max 5MB)</p>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-gray-400 p-2 rounded-md flex items-center justify-center">
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span className="ml-2">Submitting...</span>
                            </>
                        ) : (
                            "Submit Testimonial"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SubmitTestimonial
