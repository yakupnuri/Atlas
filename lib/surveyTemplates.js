// Survey Templates Library
export const surveyTemplates = {
  'seminar-evaluation': {
    id: 'seminar-evaluation',
    name: 'Seminarevaluatie',
    description: 'Evalueer de kwaliteit en inhoud van een seminar',
    category: 'education',
    questions: [
      {
        id: 'q1',
        text: 'Hoe beoordeelt u de kwaliteit van de presentatie?',
        type: 'rating',
        options: [],
        required: true
      },
      {
        id: 'q2',
        text: 'Was de inhoud relevant en informatief?',
        type: 'multiple-choice',
        options: ['Zeer relevant', 'Relevant', 'Neutraal', 'Niet relevant', 'Helemaal niet relevant'],
        required: true
      },
      {
        id: 'q3',
        text: 'Hoe beoordeelt u de spreker?',
        type: 'rating',
        options: [],
        required: true
      },
      {
        id: 'q4',
        text: 'Wat vond u het beste aan dit seminar?',
        type: 'textarea',
        options: [],
        required: false
      },
      {
        id: 'q5',
        text: 'Welke verbeteringen zou u voorstellen?',
        type: 'textarea',
        options: [],
        required: false
      },
      {
        id: 'q6',
        text: 'Zou u dit seminar aanbevelen aan anderen?',
        type: 'yes-no',
        options: [],
        required: true
      }
    ]
  },
  
  'event-feedback': {
    id: 'event-feedback',
    name: 'Evenement Feedback',
    description: 'Verzamel feedback over een evenement',
    category: 'general',
    questions: [
      {
        id: 'q1',
        text: 'Hoe beoordeelt u het evenement in het algemeen?',
        type: 'rating',
        options: [],
        required: true
      },
      {
        id: 'q2',
        text: 'Was de locatie geschikt?',
        type: 'multiple-choice',
        options: ['Uitstekend', 'Goed', 'Voldoende', 'Matig', 'Slecht'],
        required: true
      },
      {
        id: 'q3',
        text: 'Hoe beoordeelt u de organisatie?',
        type: 'rating',
        options: [],
        required: true
      },
      {
        id: 'q4',
        text: 'Was het evenement goed gecommuniceerd?',
        type: 'yes-no',
        options: [],
        required: true
      },
      {
        id: 'q5',
        text: 'Wat vond u het meest positief?',
        type: 'textarea',
        options: [],
        required: false
      },
      {
        id: 'q6',
        text: 'Wat kan er verbeterd worden?',
        type: 'textarea',
        options: [],
        required: false
      }
    ]
  },

  'customer-satisfaction': {
    id: 'customer-satisfaction',
    name: 'Klanttevredenheid',
    description: 'Meet de tevredenheid van uw klanten',
    category: 'general',
    questions: [
      {
        id: 'q1',
        text: 'Hoe tevreden bent u met onze diensten?',
        type: 'rating',
        options: [],
        required: true
      },
      {
        id: 'q2',
        text: 'Hoe waarschijnlijk is het dat u ons aanbeveelt?',
        type: 'rating',
        options: [],
        required: true
      },
      {
        id: 'q3',
        text: 'Hoe beoordeelt u onze klantenservice?',
        type: 'multiple-choice',
        options: ['Uitstekend', 'Goed', 'Voldoende', 'Matig', 'Slecht'],
        required: true
      },
      {
        id: 'q4',
        text: 'Werd uw vraag of probleem opgelost?',
        type: 'yes-no',
        options: [],
        required: true
      },
      {
        id: 'q5',
        text: 'Wat kunnen we verbeteren?',
        type: 'textarea',
        options: [],
        required: false
      }
    ]
  },

  'course-evaluation': {
    id: 'course-evaluation',
    name: 'Cursusevaluatie',
    description: 'Evalueer een cursus of training',
    category: 'education',
    questions: [
      {
        id: 'q1',
        text: 'Hoe beoordeelt u de cursusinhoud?',
        type: 'rating',
        options: [],
        required: true
      },
      {
        id: 'q2',
        text: 'Was het materiaal duidelijk en goed georganiseerd?',
        type: 'multiple-choice',
        options: ['Zeer duidelijk', 'Duidelijk', 'Neutraal', 'Onduidelijk', 'Zeer onduidelijk'],
        required: true
      },
      {
        id: 'q3',
        text: 'Hoe beoordeelt u de docent?',
        type: 'rating',
        options: [],
        required: true
      },
      {
        id: 'q4',
        text: 'Was de moeilijkheidsgraad passend?',
        type: 'multiple-choice',
        options: ['Te makkelijk', 'Makkelijk', 'Precies goed', 'Moeilijk', 'Te moeilijk'],
        required: true
      },
      {
        id: 'q5',
        text: 'Heeft u de leerdoelen bereikt?',
        type: 'yes-no',
        options: [],
        required: true
      },
      {
        id: 'q6',
        text: 'Wat vond u het meest waardevol aan deze cursus?',
        type: 'textarea',
        options: [],
        required: false
      },
      {
        id: 'q7',
        text: 'Welke onderwerpen zouden meer aandacht moeten krijgen?',
        type: 'textarea',
        options: [],
        required: false
      }
    ]
  },

  'volunteer-interest': {
    id: 'volunteer-interest',
    name: 'Vrijwilligersinteresse',
    description: 'Peiling voor vrijwilligersinteresse',
    category: 'projects',
    questions: [
      {
        id: 'q1',
        text: 'Welk type vrijwilligerswerk interesseert u het meest?',
        type: 'multiple-choice',
        options: ['Evenementen organisatie', 'Educatie & Training', 'Administratieve ondersteuning', 'Fondsenwerving', 'Andere'],
        required: true
      },
      {
        id: 'q2',
        text: 'Hoeveel tijd kunt u per maand beschikbaar stellen?',
        type: 'multiple-choice',
        options: ['1-5 uur', '5-10 uur', '10-20 uur', 'Meer dan 20 uur'],
        required: true
      },
      {
        id: 'q3',
        text: 'Heeft u relevante ervaring of vaardigheden?',
        type: 'yes-no',
        options: [],
        required: true
      },
      {
        id: 'q4',
        text: 'Zo ja, welke ervaring of vaardigheden?',
        type: 'textarea',
        options: [],
        required: false
      },
      {
        id: 'q5',
        text: 'Op welke dagen bent u meestal beschikbaar?',
        type: 'multiple-choice',
        options: ['Doordeweeks overdag', 'Doordeweeks avond', 'Weekenden', 'Flexibel'],
        required: true
      }
    ]
  },

  'blank': {
    id: 'blank',
    name: 'Lege enquête',
    description: 'Begin met een lege enquête',
    category: 'general',
    questions: []
  }
}

export const getTemplate = (templateId) => {
  return surveyTemplates[templateId] || surveyTemplates.blank
}

export const getTemplatesByCategory = (category) => {
  if (!category || category === 'all') {
    return Object.values(surveyTemplates)
  }
  return Object.values(surveyTemplates).filter(t => t.category === category)
}
