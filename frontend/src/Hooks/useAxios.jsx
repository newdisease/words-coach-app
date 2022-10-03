import axios from "axios";
import { useCallback, useState } from "react";

export const useAxios = (method, url, data = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback((method, url, data) => {
    setIsLoading(true);
    return axios({ method, url, data })
      .then((res) => {
        setIsLoading(false);
        return res.data;
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
        throw new Error(e.message);
      });
  }, []);

  const clearError = () => {
    setError(null);
  };

  return { request, isLoading, error, clearError };
};
