// Everything you'd want to edit lives here.

export type RecordFormat = 'lp' | 'single'

export type Track = {
  title: string
}

export type RecordItem = {
  id: string
  /** Name on the sleeve label and the liner notes title */
  name: string
  /** 'lp' = 12-inch (roles), 'single' = 7-inch (projects) */
  format: RecordFormat
  /** Shown in the liner notes, e.g. "internship" */
  kind: string
  role: string
  /** The 'tracklist' on the back of the sleeve: what you did */
  tracks: Track[]
  /** Placeholder sleeve colour, used until a cover image is added */
  /** key colour picked from the cover art: the liner notes spine, and the
   *  placeholder before the cover loads */
  color: string
  /** 0 to 1: how much extra to quiet this cover at rest. Louder covers (bright
   *  reds, dark blues) get more, so the wall sits at one volume */
  calm?: number
  /** Optional cover art, e.g. 'covers/amazon.jpg' (put the file in public/covers) */
  cover?: string
  /** Album the cover is inspired by */
  album?: { title: string; artist: string }
}

export const records: RecordItem[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    format: 'lp',
    kind: 'internship',
    role: 'Software Developer Intern',
    tracks: [
      { title: 'Full-stack work on the Forecasting team' },
      { title: 'Ask me again in a few months!' },
    ],
    color: '#A8161B',
    calm: 0.7,
    cover: 'covers/amazon.jpg',
    album: { title: 'When the Pawn…', artist: 'Fiona Apple' },
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    format: 'lp',
    kind: 'internship',
    role: 'Software Engineer Intern',
    tracks: [
      { title: 'Temporal service that automates launching new lesson types, saving 5 engineering weeks a year' },
      { title: 'Slack bot with granular options, designed with end users' },
      { title: 'Moved monolith feature flags off legacy Redis in 5 rollback-safe phases' },
    ],
    color: '#6FA33A',
    calm: 0,
    cover: 'covers/duolingo.jpg',
    album: { title: 'Be the Cowboy', artist: 'Mitski' },
  },
  {
    id: 'intuit',
    name: 'Intuit',
    format: 'lp',
    kind: 'internship',
    role: 'Software Developer Intern',
    tracks: [
      { title: 'Modernized TurboTax form import for 50M users' },
      { title: 'Fixed the autofill mismatches behind a 45% drop-off' },
      { title: 'Led A/B experiment and automated test cases' },
    ],
    color: '#6E9CD0',
    calm: 0.25,
    cover: 'covers/intuit.jpg',
    album: { title: 'Enema of the State', artist: 'blink-182' },
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    format: 'lp',
    kind: 'client project',
    role: 'Bye Bye Bias, Client Project',
    tracks: [
      { title: 'Dev tool that scores ML datasets for bias' },
      { title: 'Created a bias evaluation algorithm using 4 statistical metrics' },
      { title: 'Led code reviews on 15+ PRs and set up the CI/CD' },
    ],
    color: '#3E9B52',
    calm: 0.45,
    cover: 'covers/cashapp.jpg',
    album: { title: 'Sweetener', artist: 'Ariana Grande' },
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    format: 'lp',
    kind: 'internship',
    role: 'Software Engineer Intern',
    tracks: [
      { title: '6 APIs serving 15K calls a month, at 90% test coverage' },
      { title: 'AI sourcing tool that cut workflow time by 65%' },
      { title: '8 dashboard features for 1K PMs, growing adoption 20%' },
    ],
    color: '#4A5670',
    calm: 0.3,
    cover: 'covers/microsoft.jpg',
    album: { title: 'Pinkerton', artist: 'Weezer' },
  },
  {
    id: 'rbc',
    name: 'RBC',
    format: 'lp',
    kind: 'internship',
    role: 'Software Developer Intern',
    tracks: [
      { title: 'Fixed data errors behind 3.2K complaints and $50K in payouts' },
      { title: 'Cleaned up 300K records with Scala and Spark' },
      { title: 'Interned 2 high school summers before that, shipping for 15K users' },
    ],
    color: '#1F2C6B',
    calm: 0.6,
    cover: 'covers/rbc.jpg',
    album: { title: 'Melodrama', artist: 'Lorde' },
  },
  {
    id: 'uber',
    name: 'Uber',
    format: 'lp',
    kind: 'fellowship',
    role: 'Software Engineer Fellow',
    tracks: [
      { title: '1 of 50 students selected (1 of 4 Canadians) for a 6 month engineering fellowship' },
      { title: 'Shipped 5 Python assignments, attended biweekly 1-on-1s' },
      { title: 'Received internship return offer at the end!' },
    ],
    color: '#2B2A28',
    calm: 0.4,
    cover: 'covers/uber.jpg',
    album: { title: 'Ultraviolence', artist: 'Lana Del Rey' },
  },
  {
    id: 'amd',
    name: 'AMD',
    format: 'lp',
    kind: 'client project',
    role: 'Tooling for Advanced NPC Patterns, Client Project',
    tracks: [
      { title: 'Multithreaded AI scheduler for big crowds of NPCs' },
      { title: 'Live RL pipeline so NPCs adapt to players' },
    ],
    color: '#D41B3C',
    calm: 0.65,
    cover: 'covers/amd.jpg',
    album: { title: 'Starboy', artist: 'The Weeknd' },
  },
  {
    id: 'wics',
    name: 'UofT WiCS',
    format: 'lp',
    kind: 'leadership',
    role: 'Co-President, UofT Women in Computer Science',
    tracks: [
      { title: 'Planning socials and academic/industry events (including a hackathon!) reaching 500+ students' },
      { title: 'Running a team of ~25 execs and associates' },
      { title: 'Supporting the development of a new club website and members hub' },
    ],
    color: '#7D2C73',
    calm: 0.1,
    cover: 'covers/wics.jpg',
    album: { title: 'Speak Now', artist: 'Taylor Swift' },
  },
]

/**
 * The studio: personal projects, each one an object on the workbench.
 * Point at one to read about it; click to keep it open.
 */
export type Project = {
  id: string
  name: string
  /** short line under the name: what it is, or what it's built with */
  role: string
  /** shipped, in the works, coming soon... */
  status: string
  notes: string[]
  /** the object's main colour (the card's spine) */
  color: string
  /** add a link once there's something to show */
  link?: { label: string; href: string }
}

export const projects: Project[] = [
  {
    id: 'highnotes',
    name: 'Highnotes',
    role: 'React, TypeScript, Go, Python, Redis',
    status: 'built',
    notes: [
      'Turns your study notes into karaoke songs written by Gemini',
      'Grades your singing from audio input',
      'Go microservices with Redis caching',
    ],
    color: '#C96A3F',
  },
  {
    id: 'heart2heart',
    name: 'heart2heart',
    role: 'React, Vite, Tailwind CSS, Flask',
    status: 'UofT Hacks',
    notes: [
      'Helps you work through a conflict with someone you love',
      'Pick from 3 confidants, from logical to emotional',
      "See the other person's side, or an outsider's view",
      'Draft a text, find practical next steps, or save a summary to reflect on',
    ],
    color: '#B85C6E',
  },
  {
    id: 'perfume',
    name: 'Perfume Visualizer',
    role: 'Data visualization + sound generation',
    status: 'in the works',
    notes: ['Visualizes perfumes as data', 'Generates sound for each one', 'Shows where perfumes overlap'],
    color: '#B88AB8',
  },
  {
    id: 'days-better',
    name: 'Days Better Tmr',
    role: 'A DBT app',
    status: 'in the works',
    notes: ['Coming soon'],
    color: '#7FA38A',
  },
  {
    id: 'hardware',
    name: 'Something Small',
    role: 'Maybe a little piece of hardware',
    status: 'coming soon',
    notes: ['Under wraps for now'],
    color: '#A97C50',
  },
]

/**
 * Scrapbook photos, shown two to a spread when you open the scrapbook on the
 * bed. Put the images in public/scrapbook/ and list them here, e.g.
 *   { src: 'scrapbook/wics-hackathon.jpg', caption: 'wics hackathon, 2025' },
 */
export const scrapbook: { src: string; caption: string }[] = []

/** The record that's pulled out when the page loads */
export const defaultRecordId = 'amazon'

// Shown after "currently:", so each one starts with a verb. Keep them to
// about 40 characters so they sit on one line beside the label.
// They show in this order (the spinner always moves to the next one),
// so Schulich stays second.
export const funFacts = [
  'studying efficacy of llm tutors',
  'on a full-ride @ uoft (schulich leader!)',
  'researching music + mental health :)',
  'playing stardew or slay the spire',
  'browsing design twitter/x',
]

export const tv = {
  city: 'Toronto, ON',
  timeZone: 'America/Toronto',
  nowPlaying: {
    title: 'Amazon + UofT WiCS',
    subtitle: 'SWE Intern · WiCS Co-President',
    /** Record ids whose colours/covers make up the little stacked thumbnail */
    recordIds: ['amazon', 'wics'],
  },
  upNext: 'intern / new grad roles',
}

export const contact = {
  // Sits on the floor strip: text + [link →]
  before: 'I love building thoughtful software with others,',
  link: 'say hi',
  email: 'leechloehy@gmail.com',
  linkedin: 'https://www.linkedin.com/in/chloehylee',
}
