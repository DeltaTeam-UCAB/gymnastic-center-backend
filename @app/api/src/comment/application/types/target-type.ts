export const targetTypes = ['BLOG', 'LESSON'] as const

export type TargetType = (typeof targetTypes)[number]
