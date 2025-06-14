import axios from "axios";
import axiosInstance from "./axiosInstance";

export const getSlideById = (id) =>axiosInstance.get(`/slides/${id}`);

export const createSlides = (id, dataSlide) => axiosInstance.post(`/slides/createSlide/${id}`, dataSlide);

export const updateSlides = (dataSlide) => axiosInstance.put(`/slides/updateSlides`, dataSlide);

export const deleteSlide = (id) => axiosInstance.delete(`/slides/${id}`);

