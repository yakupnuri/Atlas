'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Power, Clock, MessageSquare, Save, Loader } from 'lucide-react';

export default function MaintenanceSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    message: 'Deze website is momenteel in onderhoud. We zijn binnenkort terug!',
    estimatedTime: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/maintenance');
      const data = await response.json();
      if (data.success) {
        setSettings({
          enabled: data.enabled,
          message: data.message,
          estimatedTime: data.estimatedTime || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Instellingen opgeslagen!');
      } else {
        alert('❌ Fout bij opslaan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Fout bij opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-[#05B6C4]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#05B6C4]" />
          Onderhoudsmodus
        </h1>
        <p className="text-gray-600">
          Zet de website in onderhoudsmodus. Alleen ingelogde admins kunnen de site zien.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        {/* Toggle Switch */}
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${settings.enabled ? 'bg-red-500' : 'bg-gray-400'}`}>
                <Power className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Onderhoudsmodus Status
                </h3>
                <p className="text-sm text-gray-600">
                  {settings.enabled ? '🔴 Actief - Site is offline voor bezoekers' : '🟢 Inactief - Site is online'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                  settings.enabled ? 'translate-x-12' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4" />
            Onderhoudsbericht
          </label>
          <textarea
            value={settings.message}
            onChange={(e) => setSettings({ ...settings, message: e.target.value })}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none resize-none"
            placeholder="Typ hier uw bericht voor bezoekers..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Dit bericht wordt getoond aan bezoekers wanneer de site in onderhoud is.
          </p>
        </div>

        {/* Estimated Time */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            Geschatte terugkeertijd (optioneel)
          </label>
          <input
            type="text"
            value={settings.estimatedTime}
            onChange={(e) => setSettings({ ...settings, estimatedTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] focus:border-transparent outline-none"
            placeholder="Bijv: Over 2 uur, Morgen om 10:00, enz."
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Instellingen Opslaan
              </>
            )}
          </button>
          
          {settings.enabled && (
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Site is momenteel in onderhoud
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Let op:</strong> Wanneer de onderhoudsmodus actief is, kunnen alleen ingelogde administrators de website zien. Alle andere bezoekers zien het onderhoudsbericht.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
