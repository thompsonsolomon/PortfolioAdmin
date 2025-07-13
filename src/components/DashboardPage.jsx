import { useState, useEffect } from "react"
import { BarChart3, Briefcase, FolderOpen, MessageSquare } from "lucide-react"
import { fetchAnalyticsData } from "../lib/analytics"
import { getExperiences, getProjects, getTestimonials } from "./contexts/firestore"
import LoadingSpinner from "../utils/ui"
import GitHubCalendar from "react-github-calendar"


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    experiences: 0,
    projects: 0,
    testimonials: 0,
    pendingTestimonials: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [analytics, experiences, projects, testimonials, pendingTestimonials] = await Promise.all([
        fetchAnalyticsData(),
        getExperiences(),
        getProjects(),
        getTestimonials(),
        getTestimonials("pending"),
      ])

      setStats({
        totalVisitors: analytics.totalVisitors,
        experiences: experiences.length,
        projects: projects.length,
        testimonials: testimonials.length,
        pendingTestimonials: pendingTestimonials.length,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  const statCards = [
    {
      title: "Total Visitors",
      value: stats.totalVisitors,
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      title: "Experiences",
      value: stats.experiences,
      icon: Briefcase,
      color: "bg-green-500",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      color: "bg-purple-500",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquare,
      color: "bg-orange-500",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {stats.pendingTestimonials > 0 && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <MessageSquare className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Pending Testimonials</h3>
              <p className="text-yellow-700">
                You have {stats.pendingTestimonials} testimonial{stats.pendingTestimonials !== 1 ? "s" : ""} waiting for
                approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* <div
        style={{ background: '#0d1117', padding: '20px', borderRadius: '8px' }}
      >
        <GitHubCalendar
          colorScheme="dark"
          blockSize={15}
          blockMargin={4}
          fontSize={14}
          username="thompsonsolomon"
        />
      </div> */}
    </div>
  )
}

export default Dashboard
