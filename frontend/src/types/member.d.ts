export interface Member {
    id: number
    name: string
    class: string
    spec: string
    role: 'social' | 'raider' | 'council' | 'master'
  }
  