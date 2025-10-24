'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Image,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
  Loader2,
  Save
} from 'lucide-react';

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: 'Lees Meer',
    ctaLink: '/',
    order: 0,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (slide = null) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        image: slide.image,
        ctaText: slide.ctaText || 'Lees Meer',
        ctaLink: slide.ctaLink || '/',
        order: slide.order || 0,
        isActive: slide.isActive !== undefined ? slide.isActive : true
      });
    } else {
      setEditingSlide(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        ctaText: 'Lees Meer',
        ctaLink: '/',
        order: slides.length,
        isActive: true
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      ctaText: 'Lees Meer',
      ctaLink: '/',
      order: 0,
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = '/api/hero-slides';
      const method = editingSlide ? 'PUT' : 'POST';
      const body = editingSlide 
        ? { id: editingSlide.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchSlides();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving slide:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await fetch('/api/hero-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
    }
  };

  const deleteSlide = async (id) => {
    if (!confirm('Weet u zeker dat u deze slide wilt verwijderen?')) return;

    try {
      await fetch(`/api/hero-slides?id=${id}`, {
        method: 'DELETE',
      });
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  const updateOrder = async (id, newOrder) => {
    try {
      await fetch('/api/hero-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, order: newOrder }),
      });
      fetchSlides();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Slides Beheer</h1>
            <p className="text-gray-600">Beheer de slides op de homepage hero section</p>
          </div>
          <Button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Slide
          </Button>
        </div>

        {/* Slides List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          </div>
        ) : slides.length === 0 ? (
          <Card className="p-12 text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen slides gevonden</h3>
            <p className="text-gray-600 mb-6">Begin met het toevoegen van je eerste hero slide</p>
            <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Eerste Slide Toevoegen
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {slides.map((slide, index) => (
              <Card key={slide.id} className="overflow-hidden">
                <div className="flex">
                  {/* Image */}
                  <div className="w-64 h-40 flex-shrink-0">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{slide.title}</h3>
                          <Badge className={slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {slide.isActive ? 'Actief' : 'Inactief'}
                          </Badge>
                          <span className="text-sm text-gray-500">Volgorde: {slide.order}</span>
                        </div>
                        {slide.subtitle && (
                          <p className="text-gray-700 font-medium mb-1">{slide.subtitle}</p>
                        )}
                        {slide.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">{slide.description}</p>
                        )}
                      </div>
                    </div>

                    {/* CTA Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>CTA: <strong>{slide.ctaText}</strong></span>
                      <span>Link: <strong>{slide.ctaLink}</strong></span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => toggleActive(slide.id, slide.isActive)}
                        variant="outline"
                        size="sm"
                      >
                        {slide.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Deactiveer
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Activeer
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => updateOrder(slide.id, slide.order - 1)}
                        variant="outline"
                        size="sm"
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => updateOrder(slide.id, slide.order + 1)}
                        variant="outline"
                        size="sm"
                        disabled={index === slides.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => openModal(slide)}
                        variant="outline"
                        size="sm"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Bewerk
                      </Button>
                      <Button
                        onClick={() => deleteSlide(slide.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Verwijder
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSlide ? 'Slide Bewerken' : 'Nieuwe Slide'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titel *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hoofdtitel van de slide"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitel
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optionele subtitel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beschrijving
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Korte beschrijving"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Afbeelding *
                    </label>
                    {formData.image ? (
                      <div className="relative">
                        <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, image: ''})}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowMediaLibrary(true)}
                        className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2"
                      >
                        <Image className="w-12 h-12 text-gray-400" />
                        <span className="text-sm text-gray-600">Klik om afbeelding te selecteren</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Button Tekst
                      </label>
                      <input
                        type="text"
                        value={formData.ctaText}
                        onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Link
                      </label>
                      <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/academie"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volgorde
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Actief</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={closeModal}
                      variant="outline"
                      className="flex-1"
                      disabled={saving}
                    >
                      Annuleren
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Opslaan...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Opslaan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
