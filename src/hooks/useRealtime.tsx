
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useRealtimeData = <T,>(
  table: string,
  initialData: T[] = []
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error(`Error fetching ${table}:`, error);
        } else {
          setData(fetchedData || []);
        }
      } catch (error) {
        console.error(`Error fetching ${table}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const setupRealtime = () => {
      channel = supabase
        .channel(`${table}-changes`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: table,
          },
          (payload) => {
            console.log(`${table} change:`, payload);
            
            if (payload.eventType === "INSERT") {
              setData((current) => [payload.new as T, ...current]);
            } else if (payload.eventType === "UPDATE") {
              setData((current) =>
                current.map((item: any) =>
                  item.id === payload.new.id ? payload.new as T : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setData((current) =>
                current.filter((item: any) => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    fetchData();
    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table]);

  return { data, loading, setData };
};

export const useRealtimeNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    let channel: RealtimeChannel;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notifications:", error);
        } else {
          setNotifications(data || []);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    const setupRealtime = () => {
      channel = supabase
        .channel("notifications-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Notification change:", payload);
            
            if (payload.eventType === "INSERT") {
              setNotifications((current) => [payload.new, ...current]);
            } else if (payload.eventType === "UPDATE") {
              setNotifications((current) =>
                current.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setNotifications((current) =>
                current.filter((item) => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    fetchNotifications();
    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  return { notifications, loading, setNotifications };
};
