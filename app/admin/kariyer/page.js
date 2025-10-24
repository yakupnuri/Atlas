'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { FileText, ClipboardList, Calendar, Briefcase } from 'lucide-react'
import AnnouncementsTab from '@/components/admin/career/AnnouncementsTab'
import SurveysTab from '@/components/admin/career/SurveysTab'
import SeminarsTab from '@/components/admin/career/SeminarsTab'
import JobsTab from '@/components/admin/career/JobsTab'

export default function KariyerAdminPage() {
  const [activeTab, setActiveTab] = useState('announcements')
  const [loading, setLoading] = useState(false)
  
  // Data states
  const [announcements, setAnnouncements] = useState([])
  const [surveys, setSurveys] = useState([])
  const [seminars, setSeminars] = useState([])
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      let response, result;
      
      if (activeTab === 'surveys') {
        // Use global surveys API
        response = await fetch(`/api/surveys?module=career&includeExpired=true`)
        result = await response.json()
        if (result.success) {
          setSurveys(result.data || [])
        }
      } else {
        // Use career API for other tabs
        response = await fetch(`/api/career?type=${activeTab}&includeExpired=true`)
        result = await response.json()
        
        if (result.success) {
          switch (activeTab) {
            case 'announcements':
              setAnnouncements(result.data || [])
              break
            case 'seminars':
              setSeminars(result.data || [])
              break
            case 'jobs':
              setJobs(result.data || [])
              break
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'announcements', label: 'Duyurular', icon: FileText },
    { id: 'surveys', label: 'Anketler', icon: ClipboardList },
    { id: 'seminars', label: 'Seminerler', icon: Calendar },
    { id: 'jobs', label: 'İş İlanları', icon: Briefcase },
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">💼 Kariyer Merkezi Yönetimi</h1>
          <p className="text-gray-600 mt-1">İş ilanları, anketler, seminerler ve duyuruları yönetin</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'announcements' && (
            <AnnouncementsTab announcements={announcements} onRefresh={fetchData} />
          )}
          {activeTab === 'surveys' && (
            <SurveysTab surveys={surveys} onRefresh={fetchData} />
          )}
          {activeTab === 'seminars' && (
            <SeminarsTab seminars={seminars} onRefresh={fetchData} />
          )}
          {activeTab === 'jobs' && (
            <JobsTab jobs={jobs} onRefresh={fetchData} />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
