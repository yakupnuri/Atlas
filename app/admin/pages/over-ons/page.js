'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, Users as UsersIcon, Eye } from 'lucide-react';

export default function OverOnsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    whoWeAre: {
      title: 'Over Stichting Atlas',
      content: ''
    },
    mission: {
      content: '',
      items: ['']
    },
    vision: {
      content: ''
    },
    values: [
      { title: '', description: '' }
    ],
    team: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/about');
      const data = await response.json();
      if (data.content) {
        setFormData({
          whoWeAre: data.content.whoWeAre || { title: 'Over Stichting Atlas', content: '' },
          mission: data.content.mission || { content: '', items: [''] },
          vision: data.content.vision || { content: '' },
          values: data.content.values || [{ title: '', description: '' }],
          team: data.team || []
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: {
            whoWeAre: formData.whoWeAre,
            mission: formData.mission,
            vision: formData.vision,
            values: formData.values
          },
          team: formData.team
        })
      });

      if (response.ok) {
        alert('✅ Opgeslagen!');
      } else {
        alert('❌ Fout bij opslaan');
      }
    } catch (error) {
      alert('❌ Fout: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Mission Items
  const addMissionItem = () => {
    setFormData({
      ...formData,
      mission: {
        ...formData.mission,
        items: [...formData.mission.items, '']
      }
    });
  };

  const removeMissionItem = (index) => {
    const newItems = formData.mission.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      mission: {
        ...formData.mission,
        items: newItems.length > 0 ? newItems : ['']
      }
    });
  };

  const updateMissionItem = (index, value) => {
    const newItems = [...formData.mission.items];
    newItems[index] = value;
    setFormData({
      ...formData,
      mission: { ...formData.mission, items: newItems }
    });
  };

  // Values
  const addValue = () => {
    setFormData({
      ...formData,
      values: [...formData.values, { title: '', description: '' }]
    });
  };

  const removeValue = (index) => {
    const newValues = formData.values.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      values: newValues.length > 0 ? newValues : [{ title: '', description: '' }]
    });
  };

  const updateValue = (index, field, value) => {
    const newValues = [...formData.values];
    newValues[index][field] = value;
    setFormData({ ...formData, values: newValues });
  };

  // Team
  const addTeamMember = () => {
    setFormData({
      ...formData,
      team: [...formData.team, { name: '', role: '', category: '', photo: '' }]
    });
  };

  const removeTeamMember = (index) => {
    const newTeam = formData.team.filter((_, i) => i !== index);
    setFormData({ ...formData, team: newTeam });
  };

  const updateTeamMember = (index, field, value) => {
    const newTeam = [...formData.team];
    newTeam[index][field] = value;
    setFormData({ ...formData, team: newTeam });
  };

  const handleMediaSelect = (selectedItem) => {
    console.log('MediaLibrary callback - selectedItem:', selectedItem);
    
    if (selectedTeamIndex !== null) {
      // selectedItem can be an object with url/path, or a string URL
      const imageUrl = typeof selectedItem === 'string' 
        ? selectedItem 
        : (selectedItem?.url || selectedItem?.path || selectedItem?.thumb || '');
      
      console.log('Extracted imageUrl:', imageUrl);
      console.log('Team index:', selectedTeamIndex);
      
      if (imageUrl) {
        updateTeamMember(selectedTeamIndex, 'photo', imageUrl);
        console.log('Photo updated for team member', selectedTeamIndex);
      } else {
        console.error('No valid image URL found in selectedItem:', selectedItem);
      }
    } else {
      console.error('selectedTeamIndex is null!');
    }
    
    setShowMediaLibrary(false);
    setSelectedTeamIndex(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📄 Over Ons Pagina</h1>
            <p className="text-gray-600 mt-1">Beheer de inhoud van de Over Ons pagina</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/over"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-5 h-5" />
              Voorvertoning
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Bezig...' : 'Alles Opslaan'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Who We Are */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1️⃣ Wie Zijn Wij</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={formData.whoWeAre.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    whoWeAre: { ...formData.whoWeAre, title: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                  placeholder="Bijv: Over Stichting Atlas"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Inhoud
                </label>
                <textarea
                  rows="8"
                  value={formData.whoWeAre.content}
                  onChange={(e) => setFormData({
                    ...formData,
                    whoWeAre: { ...formData.whoWeAre, content: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none resize-none"
                  placeholder="Beschrijving van de organisatie..."
                />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2️⃣ Onze Missie</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Missie Beschrijving (optioneel)
                </label>
                <textarea
                  rows="4"
                  value={formData.mission.content}
                  onChange={(e) => setFormData({
                    ...formData,
                    mission: { ...formData.mission, content: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none resize-none"
                  placeholder="Algemene missie beschrijving"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Missie Punten
                  </label>
                  <button
                    onClick={addMissionItem}
                    className="flex items-center gap-1 text-sm text-[#05B6C4] hover:text-[#3B87BE] font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Punt Toevoegen
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.mission.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateMissionItem(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                        placeholder={`Missie punt ${index + 1}`}
                      />
                      {formData.mission.items.length > 1 && (
                        <button
                          onClick={() => removeMissionItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3️⃣ Onze Visie</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Visie Inhoud
              </label>
              <textarea
                rows="6"
                value={formData.vision.content}
                onChange={(e) => setFormData({
                  ...formData,
                  vision: { ...formData.vision, content: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none resize-none"
                placeholder="Beschrijving van de visie..."
              />
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">4️⃣ Onze Waarden</h2>
              <button
                onClick={addValue}
                className="flex items-center gap-2 text-sm bg-[#05B6C4] text-white px-4 py-2 rounded-lg hover:bg-[#3B87BE] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Waarde Toevoegen
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.values.map((value, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#05B6C4] transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-gray-600">Waarde {index + 1}</span>
                    {formData.values.length > 1 && (
                      <button
                        onClick={() => removeValue(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => updateValue(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      placeholder="Titel (bijv: Inclusiviteit)"
                    />
                    <textarea
                      rows="3"
                      value={value.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none resize-none"
                      placeholder="Beschrijving..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">5️⃣ Ons Team</h2>
              <button
                onClick={addTeamMember}
                className="flex items-center gap-2 text-sm bg-[#05B6C4] text-white px-4 py-2 rounded-lg hover:bg-[#3B87BE] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Teamlid Toevoegen
              </button>
            </div>

            {formData.team.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <UsersIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Nog geen teamleden toegevoegd</p>
                <p className="text-sm text-gray-400 mt-2">Klik op "Teamlid Toevoegen" om te beginnen</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.team.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#05B6C4] transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-semibold text-gray-600">Lid {index + 1}</span>
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Photo */}
                      <div>
                        {member.photo && (
                          <img
                            src={member.photo}
                            alt={member.name || 'Team member'}
                            className="w-full h-40 object-cover rounded-lg mb-2"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'Team')}&size=200&background=05B6C4&color=fff`;
                            }}
                          />
                        )}
                        <button
                          onClick={() => {
                            setSelectedTeamIndex(index);
                            setShowMediaLibrary(true);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#05B6C4] hover:bg-gray-50 text-sm transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          {member.photo ? 'Foto Wijzigen' : 'Foto Toevoegen'}
                        </button>
                      </div>

                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                        placeholder="Naam"
                      />
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                        placeholder="Rol (bijv: Voorzitter)"
                      />
                      <input
                        type="text"
                        value={member.category}
                        onChange={(e) => updateTeamMember(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                        placeholder="Categorie (bijv: Bestuur)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button (Bottom) */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 shadow-lg"
            >
              <Save className="w-6 h-6" />
              {saving ? 'Bezig met Opslaan...' : 'Alles Opslaan'}
            </button>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibraryModal
          isOpen={showMediaLibrary}
          onSelect={handleMediaSelect}
          onClose={() => {
            setShowMediaLibrary(false);
            setSelectedTeamIndex(null);
          }}
          category="team"
        />
      )}
    </AdminLayout>
  );
}
