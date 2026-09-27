import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getHotels = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getHotelById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const addHotel = async (hotelData) => {
  const response = await axios.post(API_URL, hotelData);
  return response.data;
};

export const updateHotel = async (id, hotelData) => {
  const response = await axios.put(`${API_URL}/${id}`, hotelData);
  return response.data;
};

export const deleteHotel = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
