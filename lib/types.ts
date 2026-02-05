export interface Profile {
  id: string
  twitter_handle: string
  twitter_avatar: string | null
  name: string | null
  created_at: string
}

export interface Project {
  name: string
  url: string
}

export interface Vibecoder {
  id: number
  user_id: string
  bio: string | null
  stack: string | null
  portfolio_url: string | null
  github_url: string | null
  projects: Project[] | null
  created_at: string
  // Joined fields
  twitter_handle?: string
  twitter_avatar?: string | null
  name?: string | null
  endorsement_count?: number
  endorsers?: { handle: string }[]
}

export interface Endorsement {
  id: number
  endorser_id: string
  vibecoder_id: number
  created_at: string
  // Joined fields
  endorser_handle?: string
  endorser_avatar?: string | null
}
