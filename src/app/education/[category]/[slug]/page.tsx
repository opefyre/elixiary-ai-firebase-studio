import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleReader } from '@/components/education/article-reader';
import { StructuredData } from '@/components/education/structured-data';
import { initializeFirebaseServer } from '@/firebase/server';
import { EducationArticle } from '@/types/education';
import { getCanonicalUrl } from '@/lib/config';

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');
    
    const querySnapshot = await articlesRef
      .where('slug', '==', params.slug)
      .where('category', '==', params.category)
      .where('status', '==', 'published')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return {
        title: 'Article Not Found | Elixiary Education',
        description: 'The requested article could not be found.',
      };
    }

    const doc = querySnapshot.docs[0];
    const article = doc.data() as EducationArticle;

    const canonicalUrl = getCanonicalUrl(`/education/${params.category}/${params.slug}`);

    return {
      title: `${article.title} | Elixiary Education`,
      description: article.seo.metaDescription || article.excerpt,
      keywords: article.seo.keywords || article.tags,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: article.title,
        description: article.seo.metaDescription || article.excerpt,
        type: 'article',
        url: canonicalUrl,
        images: article.featuredImage ? [
          {
            url: article.featuredImage,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ] : undefined,
        publishedTime: article.publishedAt.toISOString(),
        modifiedTime: article.updatedAt.toISOString(),
        authors: [article.author.name],
        section: article.category,
        tags: article.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.seo.metaDescription || article.excerpt,
        images: article.featuredImage ? [article.featuredImage] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for article:', error);
    return {
      title: 'Article | Elixiary Education',
      description: 'Read this article on Elixiary Education Center.',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');
    
    const querySnapshot = await articlesRef
      .where('slug', '==', params.slug)
      .where('category', '==', params.category)
      .where('status', '==', 'published')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      notFound();
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    const article: EducationArticle = {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      category: data.category,
      difficulty: data.difficulty,
      readingTime: data.readingTime,
      tags: data.tags || [],
      author: data.author,
      publishedAt: data.publishedAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      status: data.status,
      seo: data.seo,
      stats: data.stats || { views: 0, likes: 0, shares: 0 },
    };

    return (
      <>
        <StructuredData type="article" data={article} />
        <ArticleReader article={article} />
      </>
    );
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
}
