export const getErrorMessage = (error: any): string => {
  if (error.response) {
    return error.response.data?.message || "Request failed";
  }

  if (error.request) {
    return "Unable to reach server";
  }

  return error.message || "Something went wrong";
};
