'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

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
      alert('Captcha yanlış! Lütfen tekrar deneyin.');
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
        alert('Yorumunuz başarıyla gönderildi!');
        setCommentForm({ name: '', email: '', comment: '', captcha: '' });
        generateCaptcha();
        fetchArticle();
      }
    } catch (error) {
      alert('Yorum gönderilemedi.');
    }
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      instagram: null // Instagram doesn't support direct sharing
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else if (platform === 'instagram') {
      alert('Instagram link paylaşımı desteklemiyor. Lütfen manuel olarak paylaşın.');
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Haber bulunamadı</h2>
          <Link href="/news" className="text-[#05B6C4] hover:underline">
            Haberlere dön
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
          <Link href="/news" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#05B6C4]">
            <ArrowLeft className="w-5 h-5" />
            <span>Haberlere dön</span>
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
                {format(new Date(article.date), 'd MMMM yyyy', { locale: nl })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
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
                <Share2 className="w-5 h-5" />
                Paylaş
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => shareOnSocial('facebook')}
                  className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  title="Facebook'ta paylaş"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                <button
                  onClick={() => shareOnSocial('whatsapp')}
                  className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  title="WhatsApp'ta paylaş"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>

                <button
                  onClick={() => shareOnSocial('linkedin')}
                  className="w-10 h-10 bg-[#0A66C2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  title="LinkedIn'de paylaş"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>

                <button
                  onClick={() => shareOnSocial('instagram')}
                  className="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  title="Instagram'da paylaş"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </button>
              </div>
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
