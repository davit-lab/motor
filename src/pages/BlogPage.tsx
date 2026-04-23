import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts } from "@/hooks/useListings";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";

export default function BlogPage() {
  const { posts, loading } = useBlogPosts();

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">ბლოგი</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">რჩევები, შედარებები და სიახლეები მოტო-ინდუსტრიიდან.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[16/10]" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon="question" title="სტატიები ჯერ არ დამატებულა" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Card key={p.id} className="overflow-hidden hover:shadow-elevated transition-all">
              {p.cover_image && (
                <div className="aspect-[16/10] bg-muted overflow-hidden">
                  <img src={p.cover_image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-5 space-y-3">
                {p.category && <Badge variant="secondary">{p.category}</Badge>}
                <h3 className="font-semibold text-lg leading-tight">{p.title}</h3>
                {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  {new Date(p.published_at).toLocaleDateString("ka-GE")} · {p.read_time || "5 წთ"}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
