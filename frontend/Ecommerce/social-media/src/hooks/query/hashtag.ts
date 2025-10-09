import { useQuery } from "@tanstack/react-query";

const fetchTopHashtags = async () => {
  const res = await fetch("/api/posts/hashtag");
  if (!res.ok) throw new Error("Failed to fetch hashtags");
  return res.json();
};

export function useTopHashtags() {
  return useQuery({
    queryKey: ["topHashtags"],
    queryFn: fetchTopHashtags,
    refetchInterval: 5 * 60 * 60 * 1000, 
    staleTime: 5 * 60 * 60 * 1000,   
  });
}
