'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Check, X, Flag, Trash2, Eye, MessageCircle, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function CommentsManagement() {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, spam, rejected
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    spam: 0,
    rejected: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchComments();
    fetchStats();
  }, [activeTab, router]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments?all=true&status=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [pending, approved, spam, rejected] = await Promise.all([
        fetch('/api/comments?all=true&status=pending').then(r => r.json()),
        fetch('/api/comments?all=true&status=approved').then(r => r.json()),
        fetch('/api/comments?all=true&status=spam').then(r => r.json()),
        fetch('/api/comments?all=true&status=rejected').then(r => r.json()),
      ]);

      setStats({
        pending: pending.comments?.length || 0,
        approved: approved.comments?.length || 0,
        spam: spam.comments?.length || 0,
        rejected: rejected.comments?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAction = async (commentId, action) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, action })
      });

      if (response.ok) {
        alert(`✅ Reactie ${action === 'approve' ? 'goedgekeurd' : action === 'reject' ? 'afgewezen' : 'als spam gemarkeerd'}!`);
        fetchComments();
        fetchStats();
      } else {
        alert('❌ Actie mislukt!');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('❌ Actie mislukt!');
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Weet u zeker dat u deze reactie wilt verwijderen?')) return;

    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('✅ Reactie verwijderd!');
        fetchComments();
        fetchStats();
      } else {
        alert('❌ Verwijderen mislukt!');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('❌ Verwijderen mislukt!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'spam': return 'text-red-600 bg-red-100';
      case 'rejected': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'spam': return <AlertTriangle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'pending', label: 'In afwachting', count: stats.pending, icon: <Clock className="w-4 h-4" />, color: 'yellow' },
    { id: 'approved', label: 'Goedgekeurd', count: stats.approved, icon: <CheckCircle className="w-4 h-4" />, color: 'green' },
    { id: 'spam', label: 'Spam', count: stats.spam, icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
    { id: 'rejected', label: 'Afgewezen', count: stats.rejected, icon: <XCircle className="w-4 h-4" />, color: 'gray' },
  ];

  if (loading && comments.length === 0) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reacties Beheer</h1>
          <p className="text-gray-600">Beheer alle reacties op uw nieuwsartikelen</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#05B6C4] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : `bg-${tab.color}-100 text-${tab.color}-600`
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#05B6C4] to-[#3B87BE] rounded-full flex items-center justify-center text-white font-bold">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{comment.name}</h3>
                        <p className="text-sm text-gray-500">{comment.email}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(comment.status)}`}>
                        {getStatusIcon(comment.status)}
                        {comment.status === 'pending' && 'In afwachting'}
                        {comment.status === 'approved' && 'Goedgekeurd'}
                        {comment.status === 'spam' && 'Spam'}
                        {comment.status === 'rejected' && 'Afgewezen'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(comment.createdAt).toLocaleDateString('nl-NL', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                    {comment.articleId && (
                      <p className="text-xs text-gray-400 mt-2">Artikel ID: {comment.articleId}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(comment.id, 'approve')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                      >
                        <Check className="w-4 h-4" />
                        Goedkeuren
                      </button>
                      <button
                        onClick={() => handleAction(comment.id, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold"
                      >
                        <X className="w-4 h-4" />
                        Afwijzen
                      </button>
                      <button
                        onClick={() => handleAction(comment.id, 'spam')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                      >
                        <Flag className="w-4 h-4" />
                        Spam
                      </button>
                    </>
                  )}
                  {comment.status === 'approved' && (
                    <>
                      <button
                        onClick={() => handleAction(comment.id, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold"
                      >
                        <X className="w-4 h-4" />
                        Afwijzen
                      </button>
                      <button
                        onClick={() => handleAction(comment.id, 'spam')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                      >
                        <Flag className="w-4 h-4" />
                        Spam
                      </button>
                    </>
                  )}
                  {(comment.status === 'spam' || comment.status === 'rejected') && (
                    <button
                      onClick={() => handleAction(comment.id, 'approve')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                    >
                      <Check className="w-4 h-4" />
                      Goedkeuren
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Geen reacties in deze categorie</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
