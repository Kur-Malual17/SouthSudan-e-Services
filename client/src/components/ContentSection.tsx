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
      
      setNews(newsRes.data.slice(0, 3)); // Show only 3 latest
      setBlogs(blogsRes.data.slice(0, 3));
      setGallery(galleryRes.data.slice(0, 6));
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {article.image && (
                  <img
                    src={`${BACKEND_URL}${article.image}`}
                    alt={getTitle(article)}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-blue-900">
                    {getTitle(article)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{getExcerpt(article)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(article.created_at).toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Section */}
        {activeTab === 'blog' && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {post.image && (
                  <img
                    src={`${BACKEND_URL}${post.image}`}
                    alt={getTitle(post)}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-blue-900">
                    {getTitle(post)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{getExcerpt(post)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Section */}
        {activeTab === 'gallery' && gallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`${BACKEND_URL}${image.image}`}
                    alt={getTitle(image)}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">
                      {getTitle(image)}
                    </p>
                  </div>
                </div>
                {image.category && (
                  <div className="p-2 text-center">
                    <span className="text-xs text-gray-600">{image.category}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
