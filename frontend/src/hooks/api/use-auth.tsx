import { getCurrentUserQueryFn } from "@/lib/api/auth.api";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
  });
  return query;
};

export default useAuth;
