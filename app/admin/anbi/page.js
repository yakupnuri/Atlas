'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Check, X, Loader2 } from 'lucide-react'

export default function AdminANBIPage() {
  const [documents, setDocuments] = useState({
    beloningsbeleid: null,
    beleidsplan: null,
    jaarrekening: null
  })
  const [uploading, setUploading] = useState({
    beloningsbeleid: false,
    beleidsplan: false,
    jaarrekening: false
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/anbi')
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents || {})
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      setMessage('Fout bij het ophalen van documenten')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (type, file) => {
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      setMessage(`Alleen PDF bestanden zijn toegestaan voor ${type}`)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage(`Bestand is te groot. Maximale grootte is 10MB`)
      return
    }

    setUploading(prev => ({ ...prev, [type]: true }))
    setMessage('')

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)

      const response = await fetch('/api/anbi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          fileName: file.name,
          fileData: base64,
          fileSize: file.size
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`${getDocumentName(type)} succesvol geüpload!`)
        await fetchDocuments()
      } else {
        setMessage(data.message || 'Upload mislukt')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage('Fout bij uploaden. Probeer opnieuw.')
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = error => reject(error)
    })
  }

  const getDocumentName = (type) => {
    const names = {
      beleidsplan: 'Beleidsplan',
      huisstijl: 'Huisstijl',
      jaarrekening: 'Jaarrekening'
    }
    return names[type] || type
  }

  const documentTypes = [
    { id: 'beloningsbeleid', name: 'Beloningsbeleid', description: 'Upload het beloningsbeleid document' },
    { id: 'beleidsplan', name: 'Beleidsplan', description: 'Upload het beleidsplan document' },
    { id: 'jaarrekening', name: 'Jaarrekening', description: 'Upload de jaarrekening' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4] mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ANBI Documenten Beheren</h1>
          <p className="text-gray-600 mb-8">Upload en beheer de ANBI documenten voor de publieke pagina</p>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('succesvol') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            {documentTypes.map((docType) => (
              <div key={docType.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#05B6C4]" />
                      {docType.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{docType.description}</p>
                  </div>
                  {documents[docType.id] && (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      Geüpload
                    </span>
                  )}
                </div>

                {documents[docType.id] && (
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Huidige bestand:</strong> {documents[docType.id].fileName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Geüpload op: {new Date(documents[docType.id].uploadedAt).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id={`file-${docType.id}`}
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(docType.id, file)
                    }}
                    className="hidden"
                    disabled={uploading[docType.id]}
                  />
                  <label
                    htmlFor={`file-${docType.id}`}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-all ${
                      uploading[docType.id]
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#05B6C4] hover:bg-[#0891A0] text-white'
                    }`}
                  >
                    {uploading[docType.id] ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploaden...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        {documents[docType.id] ? 'Vervangen' : 'Uploaden'}
                      </>
                    )}
                  </label>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Alleen PDF bestanden, maximaal 10MB
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Belangrijk:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Upload alleen PDF bestanden</li>
              <li>• Maximale bestandsgrootte: 10MB</li>
              <li>• Documenten zijn direct zichtbaar op de publieke ANBI pagina</li>
              <li>• Verouderde documenten worden automatisch vervangen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
