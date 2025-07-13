import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { db } from "../../utils/firebase"

// Experiences
export const getExperiences = async () => {
  const querySnapshot = await getDocs(query(collection(db, "experiences"), orderBy("startDate", "desc")))
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const addExperience = async (experience) => {
  return await addDoc(collection(db, "experiences"), experience)
}

export const updateExperience = async (id, experience) => {
  return await updateDoc(doc(db, "experiences", id), experience)
}

export const deleteExperience = async (id) => {
  return await deleteDoc(doc(db, "experiences", id))
}

// Projects
export const getProjects = async () => {
  const querySnapshot = await getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc")))
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const addProject = async (project) => {
  return await addDoc(collection(db, "projects"), {
    ...project,
    createdAt: new Date(),
  })
}

export const updateProject = async (id, project) => {
  return await updateDoc(doc(db, "projects", id), project)
}

export const deleteProject = async (id) => {
  return await deleteDoc(doc(db, "projects", id))
}

// Testimonials
export const getTestimonials = async (status = null) => {
  let q = collection(db, "testimonials")

  if (status) {
    q = query(q, where("status", "==", status))
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const addTestimonial = async (testimonial) => {
  return await addDoc(collection(db, "testimonials"), {
    ...testimonial,
    status: "pending",
    createdAt: new Date(),
  })
}

export const updateTestimonial = async (id, testimonial) => {
  return await updateDoc(doc(db, "testimonials", id), testimonial)
}

export const deleteTestimonial = async (id) => {
  return await deleteDoc(doc(db, "testimonials", id))
}

export const approveTestimonial = async (id) => {
  return await updateDoc(doc(db, "testimonials", id), { status: "approved" })
}
