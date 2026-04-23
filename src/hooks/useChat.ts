import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/types/chat";

export function useConversations(userId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }
    let mounted = true;

    const load = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order("last_message_at", { ascending: false });
      if (mounted) {
        setConversations((data || []) as Conversation[]);
        setLoading(false);
      }
    };
    load();

    const channel = supabase
      .channel(`conv-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => load())
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { conversations, loading };
}

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    let mounted = true;

    const load = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (mounted) {
        setMessages((data || []) as Message[]);
        setLoading(false);
      }
    };
    load();

    const channel = supabase
      .channel(`msg-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const send = useCallback(
    async (senderId: string, body: string) => {
      if (!conversationId || !body.trim()) return;
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: senderId,
        body: body.trim(),
      });
    },
    [conversationId]
  );

  return { messages, loading, send };
}

/** Find or create conversation between buyer and seller for a listing. Returns conversation id. */
export async function getOrCreateConversation(params: {
  listingId: string;
  buyerId: string;
  sellerId: string;
}): Promise<string | null> {
  const { listingId, buyerId, sellerId } = params;
  if (buyerId === sellerId) return null;

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return created.id;
}
