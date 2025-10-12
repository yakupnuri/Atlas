'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, ArrowLeft, Users as UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminAboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [content, setContent] = useState({
    whoWeAre: { title: '', content: '' },
    mission: { title: '', content: '', items: [] },
    vision: { title: '', content: '' },
    values: []
  });
  
  const [team, setTeam] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    category: 'management',
    image: '',
    order: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/about');
      const data = await response.json();
      
      if (data.content) {
        setContent(data.content);
      }
      if (data.team) {
        setTeam(data.team);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        setSuccessMessage('✅ İçerik başarıyla kaydedildi! Veritabanına kaydedildi.');
        setTimeout(() => setSuccessMessage(''), 5000);
        // Refresh data to confirm
        await fetchData();
      } else {
        setSuccessMessage('❌ Kaydetme hatası! Er is een fout opgetreden bij het opslaan.');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Kaydetme hatası! Er is een fout opgetreden bij het opslaan.');
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    if (content.values.length >= 5) {
      alert('Maximum 5 waarden toegestaan');
      return;
    }
    
    setContent({
      ...content,
      values: [...content.values, { id: Date.now().toString(), title: '', description: '' }]
    });
  };

  const removeValue = (id) => {
    if (content.values.length <= 2) {
      alert('Minimum 2 waarden vereist');
      return;
    }
    
    setContent({
      ...content,
      values: content.values.filter(v => v.id !== id)
    });
  };

  const updateValue = (id, field, value) => {
    setContent({
      ...content,
      values: content.values.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    });
  };

  // Mission items functions
  const addMissionItem = () => {
    const currentItems = content.mission?.items || [];
    setContent({
      ...content,
      mission: {
        ...content.mission,
        items: [...currentItems, '']
      }
    });
  };

  const removeMissionItem = (index) => {
    const newItems = [...(content.mission?.items || [])];
    newItems.splice(index, 1);
    setContent({
      ...content,
      mission: {
        ...content.mission,
        items: newItems
      }
    });
  };

  const updateMissionItem = (index, value) => {
    const newItems = [...(content.mission?.items || [])];
    newItems[index] = value;
    setContent({
      ...content,
      mission: {
        ...content.mission,
        items: newItems
      }
    });
  };

  const addTeamMember = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newMember)
      });

      if (response.ok) {
        await fetchData();
        setNewMember({ name: '', role: '', category: 'management', image: '', order: 0 });
        alert('Teamlid toegevoegd!');
      }
    } catch (error) {
      alert('Fout bij toevoegen');
    }
  };

  const deleteTeamMember = async (id) => {
    if (!confirm('Weet u zeker dat u dit teamlid wilt verwijderen?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/team?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchData();
        alert('Teamlid verwijderd!');
      }
    } catch (error) {
      alert('Fout bij verwijderen');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <Image src="/web-logo.png" alt="Logo" width={100} height={40} className="h-8 w-auto" />
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-bold text-gray-800">Over Ons Beheer</h1>
            </div>
            
            <button
              onClick={saveContent}
              disabled={saving}
              className="flex items-center gap-2 bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Bezig...' : 'Opslaan'}
            </button>
          </div>
          
          {/* Success Message */}
          {successMessage && (
            <div className={`mt-4 p-4 rounded-lg ${
              successMessage.includes('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <p className="font-semibold text-center">{successMessage}</p>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'content'
                  ? 'border-[#05B6C4] text-[#05B6C4]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'team'
                  ? 'border-[#05B6C4] text-[#05B6C4]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Team
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Wie zijn wij */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Wie zijn wij</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                  <input
                    type="text"
                    value={content.whoWeAre?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      whoWeAre: { ...content.whoWeAre, title: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inhoud</label>
                  <textarea
                    rows="4"
                    value={content.whoWeAre?.content || ''}
                    onChange={(e) => setContent({
                      ...content,
                      whoWeAre: { ...content.whoWeAre, content: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Missie */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Onze Missie</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                  <input
                    type="text"
                    value={content.mission?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      mission: { ...content.mission, title: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (İsteğe bağlı)</label>
                  <textarea
                    rows="2"
                    value={content.mission?.content || ''}
                    onChange={(e) => setContent({
                      ...content,
                      mission: { ...content.mission, content: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none resize-none"
                    placeholder="Missie tanımı (opsiyonel)"
                  />
                </div>
                
                {/* Mission Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Missie Punten</label>
                    <button
                      onClick={addMissionItem}
                      className="flex items-center gap-2 bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Punt Toevoegen
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(content.mission?.items || []).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateMissionItem(index, e.target.value)}
                          placeholder={`Missie punt ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                        />
                        <button
                          onClick={() => removeMissionItem(index)}
                          className="flex-shrink-0 text-red-600 hover:text-red-700 px-3"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    
                    {(!content.mission?.items || content.mission.items.length === 0) && (
                      <p className="text-sm text-gray-500 italic py-2">Nog geen missie punten toegevoegd. Klik op "Punt Toevoegen" om te beginnen.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visie */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Onze Visie</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                  <input
                    type="text"
                    value={content.vision?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      vision: { ...content.vision, title: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inhoud</label>
                  <textarea
                    rows="3"
                    value={content.vision?.content || ''}
                    onChange={(e) => setContent({
                      ...content,
                      vision: { ...content.vision, content: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Waarden */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Onze Waarden (2-5)</h2>
                <button
                  onClick={addValue}
                  disabled={content.values?.length >= 5}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Waarde Toevoegen
                </button>
              </div>
              
              <div className="space-y-4">
                {content.values?.map((value, index) => (
                  <div key={value.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">Waarde {index + 1}</span>
                      <button
                        onClick={() => removeValue(value.id)}
                        disabled={content.values.length <= 2}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                        <input
                          type="text"
                          value={value.title}
                          onChange={(e) => updateValue(value.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                        <input
                          type="text"
                          value={value.description}
                          onChange={(e) => updateValue(value.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-8">
            {/* Add Team Member */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Nieuw Teamlid Toevoegen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <input
                    type="text"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                  <select
                    value={newMember.category}
                    onChange={(e) => setNewMember({ ...newMember, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  >
                    <option value="management">Bestuur</option>
                    <option value="project">Project Team</option>
                    <option value="communication">Communicatie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
                  <input
                    type="text"
                    value={newMember.image}
                    onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
                    placeholder="https://i.pravatar.cc/300?img=1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  />
                </div>
              </div>
              <button
                onClick={addTeamMember}
                className="flex items-center gap-2 bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-2 rounded-lg font-semibold"
              >
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>

            {/* Team List */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Team Leden</h2>
              
              {['management', 'project', 'communication'].map(category => {
                const categoryMembers = team.filter(m => m.category === category);
                const categoryNames = {
                  management: 'Bestuur',
                  project: 'Project Team',
                  communication: 'Communicatie'
                };
                
                if (categoryMembers.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">{categoryNames[category]}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryMembers.map(member => (
                        <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                              {member.image ? (
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <UsersIcon className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                            <button
                              onClick={() => deleteTeamMember(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
