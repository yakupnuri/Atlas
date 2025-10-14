'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import ShareButtons from '@/components/ShareButtons';

export default function NewsDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [prevNext, setPrevNext] = useState({ prev: null, next: null });
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '', captcha: '' });
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0 });

  useEffect(() => {
    if (params.slug) {
      fetchArticle();
      generateCaptcha();
    }
  }, [params.slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/news/${params.slug}`);
      const data = await response.json();
      setArticle(data.article);
      setPrevNext({ prev: data.prev, next: data.next });
      if (data.article?.commentsEnabled) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2 });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Captcha validation
    const correctAnswer = captchaQuestion.num1 + captchaQuestion.num2;
    if (parseInt(commentForm.captcha) !== correctAnswer) {
      alert('Captcha onjuist! Probeer het opnieuw.');
      generateCaptcha();
      setCommentForm({ ...commentForm, captcha: '' });
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          ...commentForm
        })
      });

      if (response.ok) {
        alert('✅ Uw reactie is verzonden en wacht op goedkeuring!');
        setCommentForm({ name: '', email: '', comment: '', captcha: '' });
        generateCaptcha();
        fetchArticle();
      } else {
        alert('❌ Reactie niet verzonden. Probeer het opnieuw.');
      }
    } catch (error) {
      alert('❌ Reactie niet verzonden. Probeer het opnieuw.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4]"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Artikel niet gevonden</h2>
          <Link href="/nieuws" className="text-[#05B6C4] hover:underline">
            Terug naar nieuws
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/nieuws" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#05B6C4]">
            <ArrowLeft className="w-5 h-5" />
            <span>Terug naar nieuws</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-8 shadow-md mb-8"
          >
            <div className="mb-4">
              <span className="inline-block bg-[#F7941D] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {article.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date || article.publishDate 
                  ? format(new Date(article.date || article.publishDate), 'd MMMM yyyy', { locale: nl })
                  : 'Tarih belirtilmemiş'}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author || 'Stichting Atlas'}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </p>
            </div>
          </motion.div>

          {/* Gallery */}
          {article.gallery && article.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-8 shadow-md mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Galeri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {article.gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Galeri ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Social Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 shadow-md mb-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Paylaş
              </h3>
              <ShareButtons 
                title={article?.title || ''}
                description={article?.excerpt || ''}
                variant="inline"
              />
            </div>
          </motion.div>

          {/* Prev/Next Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {prevNext.prev ? (
              <Link
                href={`/nieuws/${prevNext.prev.slug}`}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4"
              >
                <ChevronLeft className="w-8 h-8 text-[#05B6C4] flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Önceki Haber</p>
                  <p className="font-semibold text-gray-800 line-clamp-2">{prevNext.prev.title}</p>
                </div>
              </Link>
            ) : (
              <div className="bg-gray-100 rounded-lg p-6 opacity-50">
                <p className="text-gray-400">Önceki haber yok</p>
              </div>
            )}

            {prevNext.next ? (
              <Link
                href={`/nieuws/${prevNext.next.slug}`}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4 justify-end text-right"
              >
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sonraki Haber</p>
                  <p className="font-semibold text-gray-800 line-clamp-2">{prevNext.next.title}</p>
                </div>
                <ChevronRight className="w-8 h-8 text-[#05B6C4] flex-shrink-0" />
              </Link>
            ) : (
              <div className="bg-gray-100 rounded-lg p-6 opacity-50 text-right">
                <p className="text-gray-400">Sonraki haber yok</p>
              </div>
            )}
          </motion.div>

          {/* Comments Section */}
          {article.commentsEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-8 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Yorumlar ({comments.length})
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Yorum Yap</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Adınız"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="E-posta"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      required
                    />
                  </div>
                  <textarea
                    rows="4"
                    placeholder="Yorumunuz..."
                    value={commentForm.comment}
                    onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none resize-none"
                    required
                  />
                  
                  {/* Captcha */}
                  <div className="bg-white p-4 rounded-lg border border-gray-300">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Güvenlik Kontrolü: {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                    </label>
                    <input
                      type="number"
                      placeholder="Sonucu girin"
                      value={commentForm.captcha}
                      onChange={(e) => setCommentForm({ ...commentForm, captcha: e.target.value })}
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05B6C4] outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#05B6C4] hover:bg-[#3B87BE] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Yorum Gönder
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Henüz yorum yok. İlk yorumu siz yapın!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#05B6C4] rounded-full flex items-center justify-center text-white font-bold">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{comment.name}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(comment.createdAt), 'd MMM yyyy, HH:mm', { locale: nl })}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-13">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
