// Declare gtag variable or import it from the appropriate source
let gtag

export const trackPageView = (path) => {
  if (typeof gtag !== "undefined") {
    gtag("config", "GA_MEASUREMENT_ID", {
      page_path: path,
    })
  }
}

export const trackEvent = (action, category, label, value) => {
  if (typeof gtag !== "undefined") {
    gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Function to fetch analytics data (requires Google Analytics Reporting API)
export const fetchAnalyticsData = async () => {
  try {
    // This would require setting up Google Analytics Reporting API
    // For now, returning mock data
    const res = await fetch("https://thompsonsolomonmailserver.onrender.com/analytics");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return { totalVisitors: 0, visitsOverTime: [] }
  }
}
