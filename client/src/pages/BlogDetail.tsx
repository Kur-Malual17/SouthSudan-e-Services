import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BACKEND_URL } from '../lib/api';
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast';

interface BlogPost {
  id: number;
  title: string;
  title_ar: string;
  content: string;
  content_ar: string;
  excerpt: string;
  excerpt_ar: string;
  image: string;
  category: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/blog/${id}/`);
      setPost(response.data);
    } catch (error) {
      toast.error('Failed to load blog post');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return language === 'ar' && post?.title_ar ? post.title_ar : post?.title;
  };

  const getContent = () => {
    return language === 'ar' && post?.content_ar ? post.content_ar : post?.content;
  };

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    }
    return `${BACKEND_URL}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
        </button>

        {/* Blog Post Card */}
        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Featured Image */}
          {post.image && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={getImageUrl(post.image)}
                alt={getTitle()}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {post.category && (
                  <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {post.category}
                  </span>
                )}
                <h1 className="text-4xl font-bold text-white mb-4">{getTitle()}</h1>
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div className="p-8 md:p-12">
            {!post.image && (
              <div className="mb-8">
                {post.category && (
                  <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {post.category}
                  </span>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTitle()}</h1>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b-2 border-green-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{post.author_name || (language === 'ar' ? 'المسؤول' : 'Admin')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="font-medium">
                  {new Date(post.created_at).toLocaleDateString(
                    language === 'ar' ? 'ar-SA' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              </div>
            </div>

            {/* Blog Body */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                {getContent()}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
              <h3 className="text-xl font-bold mb-2 text-green-900">
                {language === 'ar' ? 'هل كان هذا المقال مفيدًا؟' : 'Was this article helpful?'}
              </h3>
              <p className="text-gray-700 mb-4">
                {language === 'ar' 
                  ? 'شارك تجربتك مع الآخرين أو اتصل بنا للحصول على مزيد من المعلومات.'
                  : 'Share your experience with others or contact us for more information.'}
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="mt-8 pt-8 border-t-2 border-green-100">
              <h3 className="text-lg font-semibold mb-4 text-green-900">
                {language === 'ar' ? 'شارك هذا المقال' : 'Share this article'}
              </h3>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
