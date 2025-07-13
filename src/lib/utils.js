
export const formatDate = (date) => {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : "Present"
  return `${start} - ${end}`
}
