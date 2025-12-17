from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from applications.models import NewsArticle, BlogPost, GalleryImage


class Command(BaseCommand):
    help = 'Create sample content for News, Blog, and Gallery'

    def handle(self, *args, **kwargs):
        # Get or create admin user
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            admin_user = User.objects.filter(is_staff=True).first()
        if not admin_user:
            self.stdout.write(self.style.ERROR('No admin user found. Please create an admin user first.'))
            return

        # Create News Articles
        news_data = [
            {
                'title': 'New Online Passport Service Launched',
                'title_ar': 'إطلاق خدمة جواز السفر الإلكتروني الجديدة',
                'excerpt': 'Apply for your passport from anywhere in South Sudan with our new online service.',
                'excerpt_ar': 'تقدم بطلب للحصول على جواز سفرك من أي مكان في جنوب السودان باستخدام خدمتنا الإلكترونية الجديدة.',
                'content': 'We are excited to announce the launch of our new online passport application service. Citizens can now apply for passports from the comfort of their homes, offices, or anywhere with internet access. This service aims to reduce waiting times and make the process more convenient for all South Sudanese citizens.',
                'content_ar': 'يسعدنا أن نعلن عن إطلاق خدمة طلب جواز السفر الإلكتروني الجديدة. يمكن للمواطنين الآن التقدم بطلب للحصول على جوازات السفر من منازلهم أو مكاتبهم أو في أي مكان متصل بالإنترنت. تهدف هذه الخدمة إلى تقليل أوقات الانتظار وجعل العملية أكثر ملاءمة لجميع مواطني جنوب السودان.',
            },
            {
                'title': 'Immigration Office Hours Extended',
                'title_ar': 'تمديد ساعات عمل مكتب الهجرة',
                'excerpt': 'We are now open longer hours to serve you better.',
                'excerpt_ar': 'نحن الآن مفتوحون لساعات أطول لخدمتك بشكل أفضل.',
                'content': 'To better serve our citizens, the Immigration Department has extended its operating hours. We are now open from 8:00 AM to 6:00 PM, Monday through Friday. This extension will help reduce congestion and provide more flexibility for applicants.',
                'content_ar': 'لخدمة مواطنينا بشكل أفضل، قامت إدارة الهجرة بتمديد ساعات عملها. نحن الآن مفتوحون من الساعة 8:00 صباحًا حتى 6:00 مساءً، من الاثنين إلى الجمعة. سيساعد هذا التمديد في تقليل الازدحام وتوفير مزيد من المرونة للمتقدمين.',
            },
            {
                'title': 'National ID Registration Drive',
                'title_ar': 'حملة تسجيل الهوية الوطنية',
                'excerpt': 'Special registration campaign for National ID cards across all states.',
                'excerpt_ar': 'حملة تسجيل خاصة لبطاقات الهوية الوطنية في جميع الولايات.',
                'content': 'The government has launched a nationwide National ID registration drive. Mobile registration units will visit all states to make it easier for citizens to obtain their National ID cards. Check our website for the schedule in your area.',
                'content_ar': 'أطلقت الحكومة حملة تسجيل وطنية للهوية الوطنية. ستزور وحدات التسجيل المتنقلة جميع الولايات لتسهيل حصول المواطنين على بطاقات الهوية الوطنية. تحقق من موقعنا للحصول على الجدول الزمني في منطقتك.',
            },
        ]

        for data in news_data:
            article, created = NewsArticle.objects.get_or_create(
                title=data['title'],
                defaults={
                    **data,
                    'author': admin_user,
                    'published': True,
                    'featured': True,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created news article: {article.title}'))
            else:
                self.stdout.write(self.style.WARNING(f'News article already exists: {article.title}'))

        # Create Blog Posts
        blog_data = [
            {
                'title': '5 Tips for Faster Passport Processing',
                'title_ar': '5 نصائح لمعالجة جواز السفر بشكل أسرع',
                'excerpt': 'Follow these simple steps to speed up your passport application.',
                'excerpt_ar': 'اتبع هذه الخطوات البسيطة لتسريع طلب جواز السفر الخاص بك.',
                'content': '1. Ensure all documents are clear and readable\n2. Double-check your information before submitting\n3. Upload high-quality photos\n4. Complete payment promptly\n5. Respond quickly to any requests for additional information',
                'content_ar': '1. تأكد من أن جميع المستندات واضحة وقابلة للقراءة\n2. تحقق مرة أخرى من معلوماتك قبل الإرسال\n3. قم بتحميل صور عالية الجودة\n4. أكمل الدفع على الفور\n5. استجب بسرعة لأي طلبات للحصول على معلومات إضافية',
                'category': 'Tips',
            },
            {
                'title': 'Understanding the National ID Application Process',
                'title_ar': 'فهم عملية طلب الهوية الوطنية',
                'excerpt': 'A complete guide to applying for your National ID card.',
                'excerpt_ar': 'دليل كامل للتقدم بطلب للحصول على بطاقة الهوية الوطنية الخاصة بك.',
                'content': 'The National ID is an essential document for all South Sudanese citizens. This guide walks you through the entire application process, from gathering required documents to collecting your ID card. Learn about eligibility requirements, fees, and processing times.',
                'content_ar': 'الهوية الوطنية هي وثيقة أساسية لجميع مواطني جنوب السودان. يرشدك هذا الدليل خلال عملية التقديم بأكملها، من جمع المستندات المطلوبة إلى استلام بطاقة الهوية الخاصة بك. تعرف على متطلبات الأهلية والرسوم وأوقات المعالجة.',
                'category': 'Guides',
            },
            {
                'title': 'Common Mistakes to Avoid When Applying',
                'title_ar': 'الأخطاء الشائعة التي يجب تجنبها عند التقديم',
                'excerpt': 'Learn from others and avoid these common application errors.',
                'excerpt_ar': 'تعلم من الآخرين وتجنب هذه الأخطاء الشائعة في التطبيق.',
                'content': 'Many applications are delayed due to simple mistakes that can be easily avoided. This post highlights the most common errors applicants make and how to prevent them. Save time and frustration by getting it right the first time.',
                'content_ar': 'يتم تأخير العديد من الطلبات بسبب أخطاء بسيطة يمكن تجنبها بسهولة. يسلط هذا المنشور الضوء على الأخطاء الأكثر شيوعًا التي يرتكبها المتقدمون وكيفية منعها. وفر الوقت والإحباط من خلال القيام بذلك بشكل صحيح من المرة الأولى.',
                'category': 'Tips',
            },
        ]

        for data in blog_data:
            post, created = BlogPost.objects.get_or_create(
                title=data['title'],
                defaults={
                    **data,
                    'author': admin_user,
                    'published': True,
                    'featured': True,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created blog post: {post.title}'))
            else:
                self.stdout.write(self.style.WARNING(f'Blog post already exists: {post.title}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Sample content created successfully!'))
        self.stdout.write(self.style.SUCCESS('Note: Gallery images require actual image files and should be added through the admin panel.'))
        self.stdout.write(self.style.SUCCESS('\nTo add gallery images:'))
        self.stdout.write(self.style.SUCCESS('1. Go to: https://southsudan-e-services.onrender.com/admin/'))
        self.stdout.write(self.style.SUCCESS('2. Click "Gallery Images" → "Add Gallery Image"'))
        self.stdout.write(self.style.SUCCESS('3. Upload images and mark as "Published" and "Featured"'))
