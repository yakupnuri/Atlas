'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Filter,
  Lock,
  TrendingUp,
  Users,
  Calendar,
  Eye
} from 'lucide-react';
import ProjectDetailModal from '@/components/public/ProjectDetailModal';
import CRMAccessCard from '@/components/public/CRMAccessCard';

export default function ProjectgroepPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [filterCategory, filterStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = '/api/crm/projects?publicOnly=true';
      if (filterCategory !== 'all') url += `&category=${filterCategory}`;
      if (filterStatus !== 'all') url += `&status=${filterStatus}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

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
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Onze Projecten
            </h1>
            <p className="text-xl text-blue-100">
              Ontdek de projecten die we uitvoeren voor de gemeenschap. 
              Van onderwijs tot cultuur, van sociale activiteiten tot meer.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* CRM Access Card (visible to everyone, requires password) */}
        <CRMAccessCard />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Totaal Projecten</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <FolderOpen className="w-12 h-12 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actieve Projecten</p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'devam').length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Voltooide Projecten</p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'tamamlandi').length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-4 flex-wrap flex-1">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle Categorieën</option>
                <option value="egitim">Onderwijs</option>
                <option value="kultur">Cultuur</option>
                <option value="sosyal">Sociaal</option>
                <option value="diger">Overig</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle Status</option>
                <option value="planlama">Planning</option>
                <option value="devam">Actief</option>
                <option value="tamamlandi">Voltooid</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Projects Grid */}
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">Projecten laden...</p>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Geen projecten gevonden
            </h3>
            <p className="text-gray-600">
              Er zijn momenteel geen openbare projecten beschikbaar.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              // Create slug from title or use ID
              const slug = project.title
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') || project.id;
              
              return (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => window.location.href = `/academie/projectgroep/${slug}`}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Category */}
                  <div className="mb-4">
                    <Badge className={getCategoryColor(project.category)}>
                      {getCategoryText(project.category)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Voortgang</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Team & Dates */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{project.team?.length || 0} leden</span>
                    </div>
                    {project.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Button
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setSelectedProject(project)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Details bekijken
                  </Button>
                </div>
              </Card>
            );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
