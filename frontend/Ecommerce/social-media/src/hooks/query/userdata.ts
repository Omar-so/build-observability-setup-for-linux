import { useQuery } from "@tanstack/react-query";

export function useUserDataQuery(id: string) {
  return useQuery({
    queryKey: ["usersdata", id],
    queryFn: async () => {
      const res = await fetch(`/api/user/${id}`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
  });
}
