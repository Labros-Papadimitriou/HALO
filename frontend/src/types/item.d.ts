export interface Item {
    id?: number
    wow_id: number
    name: string
    icon: string
    quality: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
    inventory_type: string
    item_class: string
    item_subclass: string
    raid: string
    boss: string
  }
  