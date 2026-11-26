import { ObjectId } from 'mongodb'
import { mkdir, writeFile, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { gallery, galleryCategories } from './db.js'

export const galleryUploadDir = () => join(process.cwd(), 'public', 'uploads', 'gallery')
export const galleryUploadPath = (filename) => join(process.cwd(), 'public', 'uploads', 'gallery', filename)

export const DEFAULT_CATEGORIES = [
  { name: 'Life at Appzeto', slug: 'life-at-appzeto', description: 'Office energy, coding jams, and team moments at Indore HQ', icon: '🚀', order: 1 },
  { name: 'Diwali Celebration', slug: 'diwali-celebration', description: 'Festive lights, ethnic wear, rangoli, and sweets', icon: '🪔', order: 2 },
  { name: 'Birthday Celebration', slug: 'birthday-celebration', description: 'Cake cuttings, team cheers, and birthday surprises', icon: '🎂', order: 3 },
  { name: 'Milestones & Events', slug: 'milestones-events', description: 'Product launches, hackathons, and company gatherings', icon: '🏆', order: 4 },
]

export const DEFAULT_PHOTOS = [
  {
    title: 'Diwali Lights & Rangoli',
    caption: 'Traditional celebrations and office illumination at Appzeto HQ',
    category: 'Diwali Celebration',
    categorySlug: 'diwali-celebration',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    createdAt: new Date('2025-11-01T12:00:00Z'),
    sortOrder: 1,
  },
  {
    title: 'Team Diwali Pooja & Festivities',
    caption: 'Celebrating light and togetherness with the whole Appzeto team',
    category: 'Diwali Celebration',
    categorySlug: 'diwali-celebration',
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    createdAt: new Date('2025-11-01T14:30:00Z'),
    sortOrder: 2,
  },
  {
    title: 'Engineering Jam Session',
    caption: 'Brainstorming architecture and whiteboard wireframing in the lounge',
    category: 'Life at Appzeto',
    categorySlug: 'life-at-appzeto',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    createdAt: new Date('2025-10-15T10:00:00Z'),
    sortOrder: 3,
  },
  {
    title: 'Coffee, Code & Smiles',
    caption: 'Everyday high-octane development from our Indore workspace',
    category: 'Life at Appzeto',
    categorySlug: 'life-at-appzeto',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    createdAt: new Date('2025-10-12T11:00:00Z'),
    sortOrder: 4,
  },
  {
    title: 'Birthday Bash & Cake Cutting',
    caption: 'Sweet moments, surprise birthday cakes, and joyful cheers',
    category: 'Birthday Celebration',
    categorySlug: 'birthday-celebration',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    createdAt: new Date('2025-09-20T16:00:00Z'),
    sortOrder: 5,
  },
  {
    title: 'Midnight Release Celebration',
    caption: 'Popping confetti when a major client app hit 100k+ downloads',
    category: 'Milestones & Events',
    categorySlug: 'milestones-events',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    createdAt: new Date('2025-08-10T18:00:00Z'),
    sortOrder: 6,
  },
]

// Ensures default categories and initial seed exist if collection is empty
export async function ensureSeed() {
  const catCol = await galleryCategories()
  const galCol = await gallery()

  const catCount = await catCol.countDocuments()
  if (catCount === 0) {
    await catCol.insertMany(DEFAULT_CATEGORIES)
  }

  const galCount = await galCol.countDocuments()
  if (galCount === 0) {
    await galCol.insertMany(DEFAULT_PHOTOS)
  }
}

export function toSlug(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function toOid(id) {
  try {
    return new ObjectId(String(id))
  } catch {
    return null
  }
}
