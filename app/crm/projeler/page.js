'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  FolderOpen,
  Clock,
  Users,
  TrendingUp,
  LogOut
} from 'lucide-react';
import ProjectModal from '@/components/crm/ProjectModal';

export default function ProjelerPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // CRM authentication check
    const crmAuth = localStorage.getItem('crmAuth');
    if (!crmAuth) {
      router.push('/crm/login');
      return;
    }
    
    fetchProjects();
  }, [filterCategory, filterStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = '/api/crm/projects?';
      if (filterCategory !== 'all') url += `category=${filterCategory}&`;
      if (filterStatus !== 'all') url += `status=${filterStatus}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/crm/projects?id=${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.error || 'Proje silinemedi');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProject(null);
    fetchProjects();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'egitim': 'bg-blue-500',
      'kultur': 'bg-purple-500',
      'sosyal': 'bg-green-500',
      'diger': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'planlama': 'bg-yellow-500',
      'devam': 'bg-blue-500',
      'tamamlandi': 'bg-green-500',
      'beklemede': 'bg-orange-500',
      'iptal': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const texts = {
      'planlama': 'Planlama',
      'devam': 'Devam Ediyor',
      'tamamlandi': 'Tamamlandı',
      'beklemede': 'Beklemede',
      'iptal': 'İptal'
    };
    return texts[status] || status;
  };

  const getCategoryText = (category) => {
    const texts = {
      'egitim': 'Eğitim',
      'kultur': 'Kültür',
      'sosyal': 'Sosyal',
      'diger': 'Diğer'
    };
    return texts[category] || category;
  };

  const handleLogout = () => {
    localStorage.removeItem('crmAuth');
    localStorage.removeItem('crmLoginTime');
    router.push('/crm/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRM - Proje Yönetimi</h1>
              <p className="text-sm text-gray-600">Stichting Atlas</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Projeler</h2>
            <p className="text-gray-600 mt-1">Tüm projeleri yönetin ve takip edin</p>
          </div>
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Proje
          </Button>
        </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Kategori
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">Tümü</option>
              <option value="egitim">Eğitim</option>
              <option value="kultur">Kültür</option>
              <option value="sosyal">Sosyal</option>
              <option value="diger">Diğer</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Durum
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">Tümü</option>
              <option value="planlama">Planlama</option>
              <option value="devam">Devam Ediyor</option>
              <option value="tamamlandi">Tamamlandı</option>
              <option value="beklemede">Beklemede</option>
              <option value="iptal">İptal</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Proje</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Devam Eden</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'devam').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'tamamlandi').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Herkese Açık</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.public).length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Projects Table */}
      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Yükleniyor...</p>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="p-8 text-center">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Henüz proje yok</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İlerleme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ekip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Görünürlük
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {project.image && (
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-10 h-10 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {project.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getCategoryColor(project.category)} text-white`}>
                        {getCategoryText(project.category)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {getStatusText(project.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {project.team?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.public ? (
                        <div className="flex items-center text-green-600">
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="text-sm">Herkese Açık</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600">
                          <EyeOff className="w-4 h-4 mr-1" />
                          <span className="text-sm">Gizli</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="mr-2"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Project Modal */}
      {modalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
