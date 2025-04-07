import axios from "axios";
import { BASE_URL } from "./config";

export const getAllCategories = async () => {
  try {
    console.log("Fetching categories from:", `${BASE_URL}/categories`);

    const response = await axios.get(`${BASE_URL}/categories`, {
      timeout: 5000, // 5 seconds timeout
    });

    console.log("Categories fetched:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error Fetching Categories:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }
    return [];
  }
};


export const getProductByCategoryId = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${id}`); // ✅ Use GET instead of POST
    return response.data;
  } catch (error) {
    console.log("Error Fetching Products:", error );
    return [];
  }
};
