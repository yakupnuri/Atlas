'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';

export default function ProjectDetailModal({ project, onClose }) {
  const getCategoryColor = (category) => {
    const colors = {
      'egitim': 'bg-blue-100 text-blue-800',
      'kultur': 'bg-purple-100 text-purple-800',
      'sosyal': 'bg-green-100 text-green-800',
      'diger': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'planlama': 'bg-yellow-100 text-yellow-800',
      'devam': 'bg-blue-100 text-blue-800',
      'tamamlandi': 'bg-green-100 text-green-800',
      'beklemede': 'bg-orange-100 text-orange-800',
      'iptal': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryText = (category) => {
    const texts = {
      'egitim': 'Onderwijs',
      'kultur': 'Cultuur',
      'sosyal': 'Sociaal',
      'diger': 'Overig'
    };
    return texts[category] || category;
  };

  const getStatusText = (status) => {
    const texts = {
      'planlama': 'Planning',
      'devam': 'Actief',
      'tamamlandi': 'Voltooid',
      'beklemede': 'In afwachting',
      'iptal': 'Geannuleerd'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Niet vastgesteld';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Niet vastgesteld';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-500">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-24 h-24 text-white opacity-50" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-900"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title & Badges */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <Badge className={getCategoryColor(project.category)}>
                  {getCategoryText(project.category)}
                </Badge>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {project.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">Voortgang</span>
                <span className="font-bold text-lg">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Start Date */}
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Startdatum</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(project.startDate)}
                  </p>
                </div>
              </div>

              {/* End Date */}
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-lg p-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Einddatum</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(project.endDate)}
                  </p>
                </div>
              </div>

              {/* Budget */}
              {project.budget > 0 && (
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-lg p-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Budget</p>
                    <p className="font-semibold text-gray-900">
                      €{project.budget.toLocaleString('nl-NL')}
                    </p>
                  </div>
                </div>
              )}

              {/* Team */}
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 rounded-lg p-3">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Team</p>
                  <p className="font-semibold text-gray-900">
                    {project.team?.length || 0} leden
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            {project.team && project.team.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Teamleden
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.team.map((member, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                    >
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                onClick={onClose}
                variant="outline"
                className="px-8"
              >
                Sluiten
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
