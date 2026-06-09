export type Rating = 'again' | 'hard' | 'easy'

interface SM2State {
  repetitions: number
  easeFactor: number
  lastReviewDate: Date | null
}

interface SM2Result {
  nextReviewDate: Date
  newRepetitions: number
  newEaseFactor: number
}

/**
 * SM-2 spaced repetition algorithm implementation.
 * Calculates the next review date based on the user's rating.
 */
export function calculateNextReview(state: SM2State, rating: Rating): SM2Result {
  let { repetitions, easeFactor } = state
  const today = new Date()

  switch (rating) {
    case 'again':
      repetitions = 0
      easeFactor = Math.max(1.3, easeFactor - 0.2)
      return {
        nextReviewDate: addDays(today, 1),
        newRepetitions: repetitions,
        newEaseFactor: easeFactor,
      }

    case 'hard':
      repetitions = Math.floor(repetitions * 0.5)
      easeFactor = Math.max(1.3, easeFactor - 0.15)
      const hardInterval = Math.max(1, Math.ceil(Math.pow(2, repetitions)))
      return {
        nextReviewDate: addDays(today, Math.min(hardInterval, 14)),
        newRepetitions: repetitions,
        newEaseFactor: easeFactor,
      }

    case 'easy':
      repetitions = repetitions + 1
      easeFactor = easeFactor + 0.15
      const easyInterval = Math.ceil(Math.pow(easeFactor, repetitions - 1))
      return {
        nextReviewDate: addDays(today, Math.min(easyInterval, 60)),
        newRepetitions: repetitions,
        newEaseFactor: easeFactor,
      }
  }
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + Math.ceil(days))
  return result
}

/**
 * Returns true if the flashcard is due for review today or earlier.
 */
export function isDueForReview(nextReviewDate: Date | string | null): boolean {
  if (!nextReviewDate) return true
  const reviewDate = new Date(nextReviewDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return reviewDate <= today
}
