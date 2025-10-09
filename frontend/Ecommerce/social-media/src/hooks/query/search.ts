import { useQuery } from "@tanstack/react-query";
import useDebounce from "../usedebounce";

export function useSearchQuery(text: string) {
  const debouncedSearch = useDebounce(text, 400);

  return useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/user/search?q=${debouncedSearch}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: !!debouncedSearch, 
  });
}
