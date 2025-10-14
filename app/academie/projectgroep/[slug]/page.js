'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Heart,
  UserPlus,
  Handshake,
  Share2,
  MapPin,
  Clock
} from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';
import VolunteerModal from '@/components/public/VolunteerModal';
import DonationModal from '@/components/public/DonationModal';
import SponsorModal from '@/components/public/SponsorModal';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchProject();
    }
  }, [params.slug]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crm/projects/${params.slug}`);
      const data = await res.json();
      
      if (res.ok && data.project) {
        setProject(data.project);
      } else {
        router.push('/academie/projectgroep');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/academie/projectgroep');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Project laden...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-600 to-cyan-500 animate-fade-in">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp className="w-32 h-32 text-white opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Back Button */}
        <Button
          onClick={() => router.push('/academie/projectgroep')}
          variant="outline"
          className="absolute top-8 left-8 bg-white hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar projecten
        </Button>

        {/* Title & Badges */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex gap-2 mb-4">
              <Badge className={getCategoryColor(project.category)}>
                {getCategoryText(project.category)}
              </Badge>
              <Badge className={getStatusColor(project.status)}>
                {getStatusText(project.status)}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Over dit project
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </Card>

            {/* Progress */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Voortgang
              </h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">Projectvoortgang</span>
                  <span className="font-bold text-2xl text-blue-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              
              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Startdatum</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Einddatum</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(project.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Team Members */}
            {project.team && project.team.length > 0 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Ons Team
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.team.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member}</p>
                        <p className="text-sm text-gray-500">Teamlid</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Support Options */}
          <div className="space-y-6">
            {/* Support Card */}
            <Card className="p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Steun dit project
              </h3>
              <p className="text-gray-600 mb-6">
                Help ons dit project succesvol te maken!
              </p>

              {/* Support Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => setVolunteerModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Word Vrijwilliger
                </Button>

                <Button
                  onClick={() => setDonationModalOpen(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Doneer Nu
                </Button>

                <Button
                  onClick={() => setSponsorModalOpen(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Handshake className="w-5 h-5 mr-2" />
                  Word Sponsor
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t space-y-3">
                {project.budget > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="font-bold text-gray-900">
                      €{project.budget.toLocaleString('nl-NL')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Teamleden</span>
                  <span className="font-bold text-gray-900">
                    {project.team?.length || 0}
                  </span>
                </div>
              </div>

              {/* Share */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">Deel dit project:</p>
                <ShareButtons
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={project.title}
                  variant="inline"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {volunteerModalOpen && (
        <VolunteerModal
          project={project}
          onClose={() => setVolunteerModalOpen(false)}
        />
      )}

      {donationModalOpen && (
        <DonationModal
          project={project}
          onClose={() => setDonationModalOpen(false)}
        />
      )}

      {sponsorModalOpen && (
        <SponsorModal
          project={project}
          onClose={() => setSponsorModalOpen(false)}
        />
      )}
    </div>
  );
}
