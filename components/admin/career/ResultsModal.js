'use client'

import { ClipboardList, Trash2 } from 'lucide-react'

export default function ResultsModal({ results, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Anket Sonuçları</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-1">Toplam {results?.length || 0} katılımcı</p>
        </div>
        <div className="p-6">
          {!results || results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Henüz yanıt yok</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((response, index) => (
                <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-semibold text-gray-900">Katılımcı {index + 1}</span>
                      <span className="text-sm text-gray-500 ml-3">{response.userName}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(response.submittedAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {response.answers.map((answer, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-gray-900 mb-1">{answer.question}</p>
                        <p className="text-gray-700">{answer.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
