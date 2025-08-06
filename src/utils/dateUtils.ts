/**
 * Date utility functions for CareSync forum
 */

export const formatRelativeTime = (dateString: string): string => {
  try {
    // Handle Hebrew date format like "15 בינואר 2025"
    if (dateString.includes('בינואר') || dateString.includes('ינואר')) {
      const hebrewMonths: { [key: string]: number } = {
        'ינואר': 0, 'בינואר': 0,
        'פברואר': 1, 'בפברואר': 1,
        'מרץ': 2, 'במרץ': 2,
        'אפריל': 3, 'באפריל': 3,
        'מאי': 4, 'במאי': 4,
        'יוני': 5, 'ביוני': 5,
        'יולי': 6, 'ביולי': 6,
        'אוגוסט': 7, 'באוגוסט': 7,
        'ספטמבר': 8, 'בספטמבר': 8,
        'אוקטובר': 9, 'באוקטובר': 9,
        'נובמבר': 10, 'בנובמבר': 10,
        'דצמבר': 11, 'בדצמבר': 11
      }

      const parts = dateString.split(' ')
      if (parts.length >= 3) {
        const day = parseInt(parts[0])
        const month = hebrewMonths[parts[1]]
        const year = parseInt(parts[2])
        
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
          const date = new Date(year, month, day)
          return getRelativeTime(date)
        }
      }
    }

    // Try parsing as ISO string or other formats
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return getRelativeTime(date)
    }

    // If all else fails, return the original string
    return dateString
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return dateString
  }
}

const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'עכשיו'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `לפני ${diffInMinutes} דקות`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `לפני ${diffInHours} שעות`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `לפני ${diffInDays} ימים`
  }

  // For older dates, show the actual date
  return date.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateForDisplay = (dateString: string): string => {
  try {
    // Handle Hebrew date format
    if (dateString.includes('בינואר') || dateString.includes('ינואר')) {
      return dateString // Return as is for Hebrew dates
    }

    // Try parsing as ISO string
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return dateString
  } catch (error) {
    return dateString
  }
} 