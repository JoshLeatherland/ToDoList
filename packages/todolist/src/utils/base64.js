export const encodeData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  } catch (error) {
    console.error("Error encoding data:", error);
    return "";
  }
};

export const decodeData = (base64String) => {
  try {
    const jsonString = atob(base64String);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error decoding data:", error);
    return null;
  }
};
