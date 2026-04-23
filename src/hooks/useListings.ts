import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Listing, ServiceListing, BlogPost } from "@/types";

export function useListings(type?: "sale" | "rent") {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      let q = supabase
        .from("listings")
        .select("*")
        .eq("is_active", true)
        .order("tier", { ascending: false })
        .order("created_at", { ascending: false });
      if (type) q = q.eq("listing_type", type);
      const { data } = await q;
      if (mounted) {
        setListings((data || []) as unknown as Listing[]);
        setLoading(false);
      }
    };

    load();

    const channel = supabase
      .channel("listings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "listings" },
        () => load()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [type]);

  return { listings, loading };
}

export function useServiceListings() {
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("service_listings")
      .select("*")
      .eq("is_active", true)
      .order("tier", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (mounted) {
          setServices((data || []) as unknown as ServiceListing[]);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { services, loading };
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (mounted) {
          setPosts((data || []) as unknown as BlogPost[]);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { posts, loading };
}

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      return;
    }
    supabase
      .from("favorites")
      .select("listing_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        setFavorites((data || []).map((d) => d.listing_id));
      });
  }, [userId]);

  const toggle = async (listingId: string) => {
    if (!userId) return;
    if (favorites.includes(listingId)) {
      setFavorites((f) => f.filter((id) => id !== listingId));
      await supabase.from("favorites").delete().eq("user_id", userId).eq("listing_id", listingId);
    } else {
      setFavorites((f) => [...f, listingId]);
      await supabase.from("favorites").insert({ user_id: userId, listing_id: listingId });
    }
  };

  return { favorites, toggle };
}
