import { useEffect, useState } from 'react';
import api, { BACKEND_URL } from '../lib/api';
import { useTranslation } from '../hooks/useTranslation';

interface NewsArticle {
  id: number;
  title: string;
  title_ar: string;
  excerpt: string;
  excerpt_ar: string;
  image: string;
  created_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  title_ar: string;
  excerpt: string;
  excerpt_ar: string;
  image: string;
  category: string;
  created_at: string;
}

interface GalleryImage {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  image: string;
  category: string;
}

export default function ContentSection() {
  const { language } = useTranslation();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'blog' | 'gallery'>('news');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [newsRes, blogsRes, galleryRes] = await Promise.all([
        api.get('/news/?featured=true'),
        api.get('/blog/?featured=true'),
        api.get('/gallery/?featured=true'),
      ]);
      
      // Handle both paginated and non-paginated responses
      const newsData = Array.isArray(newsRes.data) ? newsRes.data : (newsRes.data.results || []);
      const blogsData = Array.isArray(blogsRes.data) ? blogsRes.data : (blogsRes.data.results || []);
      const galleryData = Array.isArray(galleryRes.data) ? galleryRes.data : (galleryRes.data.results || []);
      
      setNews(newsData.slice(0, 3)); // Show only 3 latest
      setBlogs(blogsData.slice(0, 3));
      setGallery(galleryData.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (item: any) => {
    return language === 'ar' && item.title_ar ? item.title_ar : item.title;
  };

  const getExcerpt = (item: any) => {
    return language === 'ar' && item.excerpt_ar ? item.excerpt_ar : item.excerpt;
  };

  const getImageUrl = (imageUrl: string) => {
    // If URL already starts with http/https (Cloudinary), use it as-is
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    }
    // Otherwise, prepend BACKEND_URL for local storage
    return `${BACKEND_URL}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  // Show message if no content
  if (news.length === 0 && blogs.length === 0 && gallery.length === 0) {
    return (
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-blue-900">
            {language === 'ar' ? 'الأخبار والتحديثات' : 'News & Updates'}
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {language === 'ar' ? 'لا يوجد محتوى متاح حاليًا' : 'No Content Available Yet'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar' 
                ? 'سيتم إضافة الأخبار والتحديثات قريبًا. يرجى التحقق مرة أخرى لاحقًا.'
                : 'News and updates will be added soon. Please check back later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-blue-900">
          {language === 'ar' ? 'الأخبار والتحديثات' : 'News & Updates'}
        </h2>
        <div className="w-20 sm:w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {news.length > 0 && (
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'news'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language === 'ar' ? 'الأخبار' : 'News'}
            </button>
          )}
          {blogs.length > 0 && (
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'blog'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language === 'ar' ? 'المدونة' : 'Blog'}
            </button>
          )}
          {gallery.length > 0 && (
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'gallery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language === 'ar' ? 'المعرض' : 'Gallery'}
            </button>
          )}
        </div>

        {/* News Section */}
        {activeTab === 'news' && news.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <div
                key={article.id}
                onClick={() => window.open(`/news/${article.id}`, '_blank')}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                {article.image && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(article.image)}
                      alt={getTitle(article)}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {language === 'ar' ? 'خبر' : 'News'}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-gray-500">
                      {new Date(article.created_at).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-blue-900 line-clamp-2">
                    {getTitle(article)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{getExcerpt(article)}</p>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2">
                    {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Section */}
        {activeTab === 'blog' && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <div
                key={post.id}
                onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-green-100"
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(post.image)}
                      alt={getTitle(post)}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                    {post.category && (
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <p className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-green-900 line-clamp-2">
                    {getTitle(post)}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{getExcerpt(post)}</p>
                  <button className="text-green-600 hover:text-green-800 font-semibold text-sm flex items-center gap-2">
                    {language === 'ar' ? 'اقرأ المقال' : 'Read Article'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Section */}
        {activeTab === 'gallery' && gallery.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((image) => (
              <div
                key={image.id}
                onClick={() => window.open(getImageUrl(image.image), '_blank')}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-56 bg-gray-100">
                  <img
                    src={getImageUrl(image.image)}
                    alt={getTitle(image)}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-sm mb-1">
                        {getTitle(image)}
                      </p>
                      {image.category && (
                        <span className="inline-block bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded">
                          {image.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
