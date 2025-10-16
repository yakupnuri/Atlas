'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  CheckCircle,
  MessageSquare,
  X,
  Send,
  Filter,
  Search
} from 'lucide-react';

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/contact?status=${filterStatus}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Weet u zeker dat u dit bericht wilt verwijderen?')) return;

    try {
      await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      });
      fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.new;
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'Nieuw',
      read: 'Gelezen',
      replied: 'Beantwoord',
      archived: 'Gearchiveerd',
    };
    return labels[status] || status;
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Berichten</h1>
          <p className="text-gray-600">Beheer inkomende contact berichten van bezoekers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Totaal</p>
                <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
              </div>
              <Mail className="w-12 h-12 text-gray-400" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nieuw</p>
                <p className="text-3xl font-bold text-blue-600">
                  {messages.filter(m => m.status === 'new').length}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-400" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gelezen</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {messages.filter(m => m.status === 'read').length}
                </p>
              </div>
              <Eye className="w-12 h-12 text-yellow-400" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beantwoord</p>
                <p className="text-3xl font-bold text-green-600">
                  {messages.filter(m => m.status === 'replied').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam, email of onderwerp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle Status</option>
                <option value="new">Nieuw</option>
                <option value="read">Gelezen</option>
                <option value="replied">Beantwoord</option>
                <option value="archived">Gearchiveerd</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Messages List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages */}
          <div className="space-y-4">
            {loading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Laden...</p>
              </Card>
            ) : filteredMessages.length === 0 ? (
              <Card className="p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Geen berichten gevonden</p>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === 'new') {
                      updateStatus(message.id, 'read');
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{message.name}</h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
                    </div>
                    <Badge className={getStatusColor(message.status)}>
                      {getStatusLabel(message.status)}
                    </Badge>
                  </div>

                  <p className="text-sm font-medium text-gray-900 mb-2">{message.subject}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{message.message}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      {message.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {message.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(message.createdAt).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-8 h-fit">
            {selectedMessage ? (
              <Card className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Van:</span> {selectedMessage.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span>{' '}
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                          {selectedMessage.email}
                        </a>
                      </p>
                      {selectedMessage.phone && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Telefoon:</span>{' '}
                          <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                            {selectedMessage.phone}
                          </a>
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Datum:</span>{' '}
                        {new Date(selectedMessage.createdAt).toLocaleString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Message Content */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Bericht</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateStatus(selectedMessage.id, 'read')}
                      disabled={selectedMessage.status === 'read'}
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Markeer als Gelezen
                    </Button>
                    <Button
                      onClick={() => updateStatus(selectedMessage.id, 'replied')}
                      disabled={selectedMessage.status === 'replied'}
                      variant="outline"
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Markeer als Beantwoord
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateStatus(selectedMessage.id, 'archived')}
                      variant="outline"
                      className="flex-1"
                    >
                      Archiveer
                    </Button>
                    <Button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      variant="outline"
                      className="flex-1 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Verwijder
                    </Button>
                  </div>
                  
                  {/* Email Link */}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    <Mail className="w-5 h-5" />
                    Beantwoord via Email
                  </a>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Selecteer een bericht om de details te bekijken
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
