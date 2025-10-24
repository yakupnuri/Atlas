'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Image as ImageIcon, X } from 'lucide-react'
import MediaLibraryModal from '@/components/MediaLibraryModal'

export default function SurveyBuilder({ survey, module, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    endDate: '',
    image: '',
    questions: []
  })
  const [saving, setSaving] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)

  useEffect(() => {
    if (survey) {
      const { _id, ...surveyData } = survey
      setFormData(surveyData)
    }
  }, [survey])

  const addQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      text: '',
      type: 'text',
      options: [],
      required: true
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    })
  }

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, questions: updated })
  }

  const deleteQuestion = (index) => {
    const updated = formData.questions.filter((_, i) => i !== index)
    setFormData({ ...formData, questions: updated })
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(formData.questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFormData({ ...formData, questions: items })
  }

  const addOption = (questionIndex) => {
    const updated = [...formData.questions]
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = []
    }
    updated[questionIndex].options.push('')
    setFormData({ ...formData, questions: updated })
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...formData.questions]
    updated[questionIndex].options[optionIndex] = value
    setFormData({ ...formData, questions: updated })
  }

  const deleteOption = (questionIndex, optionIndex) => {
    const updated = [...formData.questions]
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex)
    setFormData({ ...formData, questions: updated })
  }

  const handleSave = async () => {
    if (!formData.title || formData.questions.length === 0) {
      alert('Vul tenminste de titel en één vraag in')
      return
    }

    setSaving(true)
    try {
      const method = survey ? 'PUT' : 'POST'
      const payload = {
        ...formData,
        module,
        ...(survey && { id: survey.id })
      }

      const response = await fetch('/api/surveys', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (result.success) {
        alert(survey ? 'Enquête bijgewerkt!' : 'Enquête aangemaakt!')
        onSave()
      } else {
        alert('Fout: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving survey:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {survey ? 'Enquête Bewerken' : 'Nieuwe Enquête'}
            </h2>
            <p className="text-sm text-gray-600">
              Maak een enquête voor {module === 'career' ? 'Carrière' : module === 'education' ? 'Educatie' : 'Projecten'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Basis Informatie</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Bijv: Seminarevaluatie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Korte beschrijving van de enquête..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Einddatum
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Afbeelding
              </label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Survey"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowMediaLibrary(true)}
                  className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2"
                >
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                  <span className="text-sm text-gray-600">Afbeelding toevoegen</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Vragen ({formData.questions.length})
            </h3>
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Vraag Toevoegen
            </button>
          </div>

          {formData.questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nog geen vragen. Klik op "Vraag Toevoegen" om te beginnen.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {formData.questions.map((question, qIndex) => (
                      <Draggable key={question.id} draggableId={question.id} index={qIndex}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border-2 rounded-lg p-4 transition-all ${
                              snapshot.isDragging
                                ? 'border-blue-500 shadow-2xl bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-3 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="w-5 h-5 text-gray-400" />
                              </div>
                              
                              <div className="flex-1 space-y-3">
                      {/* Question Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vraag {qIndex + 1}
                        </label>
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Vraag tekst..."
                        />
                      </div>

                      {/* Question Type */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="text">Kort Antwoord</option>
                            <option value="textarea">Lang Antwoord</option>
                            <option value="multiple-choice">Meerkeuzevraag</option>
                            <option value="rating">Beoordeling (1-5)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Verplicht?
                          </label>
                          <select
                            value={question.required ? 'true' : 'false'}
                            onChange={(e) => updateQuestion(qIndex, 'required', e.target.value === 'true')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="true">Ja</option>
                            <option value="false">Nee</option>
                          </select>
                        </div>
                      </div>

                      {/* Options for Multiple Choice */}
                      {question.type === 'multiple-choice' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opties
                          </label>
                          <div className="space-y-2">
                            {(question.options || []).map((option, oIndex) => (
                              <div key={oIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder={`Optie ${oIndex + 1}`}
                                />
                                <button
                                  onClick={() => deleteOption(qIndex, oIndex)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addOption(qIndex)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              + Optie Toevoegen
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => deleteQuestion(qIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media) => {
          setFormData({ ...formData, image: media.url })
        }}
        allowMultiple={false}
        category="surveys"
      />
    </div>
  )
}
