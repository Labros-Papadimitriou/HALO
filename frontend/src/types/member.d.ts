export interface Member {
  id?: number
  discord_id: string
  name: string
  discord_role_id: string
  class_role_id?: string
  role_name?: string
  class_name?: string
  fullyEnchanted?: boolean
  enchantStatus?: 'tryhard' | 'normal' | 'missing'
  missingEnchantSlots?: number[]
}
