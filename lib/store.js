// Simple file-free in-memory store that persists for the lifetime of the server.
// For a production app you'd swap this for a real DB (Postgres / Mongo / Supabase etc.)

// ----- Seed data -----
const seedBeats = [
  {
    id: 'b1',
    title: 'Midnight Dreams',
    genre: 'Trap',
    bpm: 140,
    key: 'F# min',
    price: 29.99,
    duration: '3:24',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    producer: 'DJ Pulse',
    tags: ['dark', 'melodic', 'hard-hitting'],
    description: 'A cinematic trap beat with haunting piano melodies and heavy 808s.',
    plays: 12400,
    previewUrl: '/samples/midnight.mp3',
  },
  {
    id: 'b2',
    title: 'Golden Hour',
    genre: 'Afrobeats',
    bpm: 102,
    key: 'C maj',
    price: 34.99,
    duration: '2:58',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
    producer: 'DJ Pulse',
    tags: ['summer', 'vibes', 'afro-swing'],
    description: 'Smooth afrobeat groove perfect for melodic hooks and summer vibes.',
    plays: 9800,
    previewUrl: '/samples/golden.mp3',
  },
  {
    id: 'b3',
    title: 'Neon Lights',
    genre: 'Hip-Hop',
    bpm: 92,
    key: 'D min',
    price: 24.99,
    duration: '3:10',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80',
    producer: 'DJ Pulse',
    tags: ['boom-bap', 'soulful', 'sample'],
    description: 'Boom-bap style hip-hop with warm soul samples and crisp drums.',
    plays: 7200,
    previewUrl: '/samples/neon.mp3',
  },
  {
    id: 'b4',
    title: 'Crown Royal',
    genre: 'Drill',
    bpm: 144,
    key: 'A min',
    price: 39.99,
    duration: '3:02',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    producer: 'DJ Pulse',
    tags: ['uk-drill', 'aggressive', 'slide 808'],
    description: 'Aggressive UK drill beat with sliding 808s and menacing synths.',
    plays: 15300,
    previewUrl: '/samples/crown.mp3',
  },
  {
    id: 'b5',
    title: 'Ocean Waves',
    genre: 'R&B',
    bpm: 78,
    key: 'G min',
    price: 27.99,
    duration: '3:45',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80',
    producer: 'DJ Pulse',
    tags: ['smooth', 'love', 'chill'],
    description: 'Silky R&B beat with lush chords, perfect for love songs.',
    plays: 8600,
    previewUrl: '/samples/ocean.mp3',
  },
  {
    id: 'b6',
    title: 'Fire Storm',
    genre: 'Dancehall',
    bpm: 108,
    key: 'E min',
    price: 32.99,
    duration: '3:15',
    cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&q=80',
    producer: 'DJ Pulse',
    tags: ['energy', 'club', 'caribbean'],
    description: 'High-energy dancehall riddim built for clubs and festivals.',
    plays: 11100,
    previewUrl: '/samples/fire.mp3',
  },
]

const seedVideos = [
  {
    id: 'v1',
    title: 'Beat Making Breakdown: Midnight Dreams',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    duration: '12:34',
    views: 45000,
    date: '2025-02-10',
  },
  {
    id: 'v2',
    title: 'Studio Session: Crafting Afrobeat Grooves',
    thumbnail: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80',
    duration: '18:05',
    views: 32000,
    date: '2025-03-02',
  },
  {
    id: 'v3',
    title: 'Producer Tips: Mixing 808s Like a Pro',
    thumbnail: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80',
    duration: '09:48',
    views: 67000,
    date: '2025-03-20',
  },
]

const state = {
  beats: [...seedBeats],
  videos: [...seedVideos],
  users: [], // {id, name, email, password, role, purchases:[]}
  purchases: [],
  sessions: new Map(), // token -> userId
}

// admin seed account
state.users.push({
  id: 'admin-1',
  name: 'DJ Pulse',
  email: 'admin@beatforge.com',
  password: 'admin123',
  role: 'admin',
  purchases: [],
})

export function getBeats() { return state.beats }
export function getBeat(id) { return state.beats.find(b => b.id === id) }
export function addBeat(beat) {
  const id = 'b' + (state.beats.length + 1) + '-' + Date.now().toString(36)
  const newBeat = { id, plays: 0, producer: 'DJ Pulse', ...beat }
  state.beats.unshift(newBeat)
  return newBeat
}
export function deleteBeat(id) {
  state.beats = state.beats.filter(b => b.id !== id)
}

export function getVideos() { return state.videos }
export function addVideo(video) {
  const id = 'v' + (state.videos.length + 1) + '-' + Date.now().toString(36)
  const newVideo = { id, views: 0, date: new Date().toISOString().slice(0, 10), ...video }
  state.videos.unshift(newVideo)
  return newVideo
}

export function getUserByEmail(email) {
  return state.users.find(u => u.email.toLowerCase() === email.toLowerCase())
}
export function getUserById(id) { return state.users.find(u => u.id === id) }
export function createUser({ name, email, password }) {
  if (getUserByEmail(email)) throw new Error('Email already registered')
  const user = {
    id: 'u-' + Date.now().toString(36),
    name, email, password, role: 'artist',
    purchases: [],
    createdAt: new Date().toISOString(),
  }
  state.users.push(user)
  return user
}
export function setSession(token, userId) { state.sessions.set(token, userId) }
export function getSession(token) {
  if (!token) return null
  const userId = state.sessions.get(token)
  if (!userId) return null
  return getUserById(userId)
}
export function clearSession(token) { state.sessions.delete(token) }

export function addPurchase(userId, beatId, paymentMethod, reference) {
  const beat = getBeat(beatId)
  const user = getUserById(userId)
  if (!beat || !user) throw new Error('Invalid purchase')
  const purchase = {
    id: 'p-' + Date.now().toString(36),
    beatId,
    beatTitle: beat.title,
    price: beat.price,
    paymentMethod,
    reference,
    date: new Date().toISOString(),
    downloadUrl: `/downloads/${beat.id}.zip`,
  }
  user.purchases.push(purchase)
  state.purchases.push(purchase)
  return purchase
}

export function getPurchases(userId) {
  const user = getUserById(userId)
  return user ? user.purchases : []
}
