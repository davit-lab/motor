import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { timeAgo } from "@/lib/format";
import type { Profile } from "@/types";

interface ConvMeta {
  id: string;
  partnerId: string;
  partnerName: string;
  listingTitle: string;
  last_message_at: string;
}

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { conversations, loading } = useConversations(user?.id);
  const [params, setParams] = useSearchParams();
  const [meta, setMeta] = useState<Record<string, ConvMeta>>({});
  const [partnerProfiles, setPartnerProfiles] = useState<Record<string, Profile>>({});

  const selectedId = params.get("c") || conversations[0]?.id;

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || conversations.length === 0) return;
    (async () => {
      const partnerIds = Array.from(
        new Set(conversations.map((c) => (c.buyer_id === user.id ? c.seller_id : c.buyer_id)))
      );
      const listingIds = Array.from(new Set(conversations.map((c) => c.listing_id).filter(Boolean) as string[]));

      const [{ data: profs }, { data: lst }] = await Promise.all([
        supabase.from("profiles").select("*").in("id", partnerIds),
        listingIds.length
          ? supabase.from("listings").select("id,make,model").in("id", listingIds)
          : Promise.resolve({ data: [] as { id: string; make: string; model: string }[] }),
      ]);

      const profMap: Record<string, Profile> = {};
      (profs as Profile[] | null)?.forEach((p) => (profMap[p.id] = p));
      setPartnerProfiles(profMap);

      const lstMap: Record<string, string> = {};
      (lst as { id: string; make: string; model: string }[] | null)?.forEach(
        (l) => (lstMap[l.id] = `${l.make} ${l.model}`)
      );

      const m: Record<string, ConvMeta> = {};
      conversations.forEach((c) => {
        const partnerId = c.buyer_id === user.id ? c.seller_id : c.buyer_id;
        m[c.id] = {
          id: c.id,
          partnerId,
          partnerName: profMap[partnerId]?.display_name || "მომხმარებელი",
          listingTitle: c.listing_id ? lstMap[c.listing_id] || "განცხადება" : "ჩატი",
          last_message_at: c.last_message_at,
        };
      });
      setMeta(m);
    })();
  }, [conversations, user]);

  const selectedMeta = selectedId ? meta[selectedId] : undefined;
  const selectedPartner = selectedMeta ? partnerProfiles[selectedMeta.partnerId] : undefined;

  if (!user) return <div className="container py-20" />;

  return (
    <div className="container py-6">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">შეტყობინებები</h1>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">იტვირთება...</div>
      ) : conversations.length === 0 ? (
        <EmptyState icon="search" title="ჯერ არ გაქვს საუბრები" description="დაიწყე ჩატი განცხადებიდან." />
      ) : (
        <Card className="grid md:grid-cols-[300px_1fr] h-[70vh] overflow-hidden">
          <div className="border-r overflow-y-auto">
            {conversations.map((c) => {
              const m = meta[c.id];
              if (!m) return null;
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => setParams({ c: c.id })}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b hover:bg-secondary/40 transition-colors",
                    active && "bg-secondary"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm truncate">{m.partnerName}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {timeAgo(m.last_message_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{m.listingTitle}</p>
                </button>
              );
            })}
          </div>
          <div className="min-h-0">
            {selectedId ? (
              <ChatWindow conversationId={selectedId} partner={selectedPartner} />
            ) : (
              <div className="grid h-full place-items-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p>აირჩიე საუბარი</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
