'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut,
  UserPlus,
  Heart,
  Handshake,
  Eye,
  Filter,
  Search,
  Mail,
  Phone,
  Calendar,
  Euro,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import ApplicationDetailModal from '@/components/crm/ApplicationDetailModal';

export default function BasvurularPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // CRM authentication check
    const crmAuth = localStorage.getItem('crmAuth');
    const adminToken = localStorage.getItem('adminToken');
    
    // Allow access if either CRM auth or admin auth exists
    if (!crmAuth && !adminToken) {
      router.push('/crm/login');
      return;
    }
    
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Fetch all types
      const [volunteersRes, donationsRes, sponsorsRes] = await Promise.all([
        fetch('/api/crm/volunteers'),
        fetch('/api/crm/donations'),
        fetch('/api/crm/sponsors')
      ]);

      const volunteersData = await volunteersRes.json();
      const donationsData = await donationsRes.json();
      const sponsorsData = await sponsorsRes.json();

      const allApplications = [
        ...(volunteersData.applications || []),
        ...(donationsData.donations || []),
        ...(sponsorsData.sponsorships || [])
      ];

      // Sort by date
      allApplications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setApplications(allApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crmAuth');
    localStorage.removeItem('crmLoginTime');
    router.push('/crm/login');
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'volunteer': return <UserPlus className="w-5 h-5" />;
      case 'donation': return <Heart className="w-5 h-5" />;
      case 'sponsor': return <Handshake className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'volunteer': return 'bg-blue-100 text-blue-800';
      case 'donation': return 'bg-green-100 text-green-800';
      case 'sponsor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'volunteer': return 'Gönüllü';
      case 'donation': return 'Bağış';
      case 'sponsor': return 'Sponsor';
      default: return type;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'new': return 'Yeni';
      case 'pending': return 'Beklemede';
      case 'reviewing': return 'İnceleniyor';
      case 'accepted': return 'Kabul';
      case 'rejected': return 'Red';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    // Type filter
    if (filterType !== 'all' && app.type !== filterType) return false;
    
    // Status filter
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchFields = [
        app.fullName,
        app.contactPerson,
        app.companyName,
        app.email,
        app.projectTitle
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchFields.includes(query)) return false;
    }
    
    return true;
  });

  // Stats
  const stats = {
    total: applications.length,
    volunteers: applications.filter(a => a.type === 'volunteer').length,
    donations: applications.filter(a => a.type === 'donation').length,
    sponsors: applications.filter(a => a.type === 'sponsor').length,
    new: applications.filter(a => a.status === 'new').length,
    totalDonations: applications
      .filter(a => a.type === 'donation' && a.amount)
      .reduce((sum, a) => sum + a.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRM - Başvuru Yönetimi</h1>
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
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => router.push('/crm/projeler')}
            variant="outline"
          >
            Projeler
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Başvurular
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Başvuru</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yeni</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.new}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gönüllüler</p>
                <p className="text-3xl font-bold text-blue-600">{stats.volunteers}</p>
              </div>
              <UserPlus className="w-10 h-10 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Bağış</p>
                <p className="text-2xl font-bold text-green-600">
                  €{stats.totalDonations.toLocaleString('nl-NL')}
                </p>
              </div>
              <Heart className="w-10 h-10 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="İsim, email veya proje ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Tipler</option>
                <option value="volunteer">Gönüllü</option>
                <option value="donation">Bağış</option>
                <option value="sponsor">Sponsor</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="new">Yeni</option>
                <option value="pending">Beklemede</option>
                <option value="reviewing">İnceleniyor</option>
                <option value="accepted">Kabul</option>
                <option value="rejected">Red</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredApplications.length} başvuru gösteriliyor
          </div>
        </Card>

        {/* Applications Table */}
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">Yükleniyor...</p>
          </Card>
        ) : filteredApplications.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Başvuru bulunamadı</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Başvuran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      İletişim
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Proje
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getTypeColor(app.type)}>
                          <span className="flex items-center gap-1">
                            {getTypeIcon(app.type)}
                            {getTypeText(app.type)}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {app.fullName || app.contactPerson || app.companyName}
                        </div>
                        {app.companyName && app.contactPerson && (
                          <div className="text-sm text-gray-500">{app.contactPerson}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <Mail className="w-4 h-4" />
                          {app.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {app.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                          {app.projectTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.amount ? (
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <Euro className="w-4 h-4" />
                            {app.amount.toLocaleString('nl-NL')}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(app.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(app.status)}
                            {getStatusText(app.status)}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(app.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Detay
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={fetchApplications}
        />
      )}
    </div>
  );
}
