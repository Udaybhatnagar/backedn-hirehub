const mongoose = require("mongoose")
require("dotenv").config()

const Trainer = require("../models/Trainer.model")

const trainers = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Lead Data Scientist",
    company: "Google DeepMind",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 120,
    students: 4500,
    hourlyRate: 150,
    availability: "Available",
    experience: "10+ Years",
    skills: ["Python", "TensorFlow", "NLP", "Generative AI"],
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Ravi Kumar",
    role: "LLM Engineer",
    company: "OpenAI",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    location: "Remote",
    rating: 5.0,
    reviews: 45,
    students: 800,
    hourlyRate: 200,
    availability: "Weekend Only",
    experience: "5-10 Years",
    skills: ["PyTorch", "Transformers", "LangChain", "Python"],
    socials: { linkedin: "#", website: "#" }
  },
  {
    name: "James Anderson",
    role: "Principal Engineer",
    company: "Netflix",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 85,
    students: 3200,
    hourlyRate: 130,
    availability: "Weekend Only",
    experience: "10+ Years",
    skills: ["Java", "Spring Boot", "Microservices", "AWS"],
    socials: { linkedin: "#", website: "#" }
  }
  // 👉 baaki trainers bhi isi format me add kar sakte ho
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ MongoDB connected")

    await Trainer.deleteMany()
    console.log("🧹 Old trainers removed")

    await Trainer.insertMany(trainers)
    console.log("🚀 Trainers seeded successfully")

    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seed()