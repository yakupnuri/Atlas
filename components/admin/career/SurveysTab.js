'use client'

import SurveyManager from '@/components/surveys/SurveyManager'

export default function SurveysTab({ surveys, onRefresh }) {
  // Use global SurveyManager with career module filter
  return (
    <div>
      <SurveyManager module="career" />
    </div>
  )
}
