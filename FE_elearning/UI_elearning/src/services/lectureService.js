import axiosInstance from './axiosInstance';

export const getAllLectures = () => axiosInstance.get(`/lecture-requests`);

export const addLectureRequest = (data) => axiosInstance.post(`/lecture-requests`, data);

export const updateLecture = (idLecture, data) => axiosInstance.patch(`/lecture-requests/${idLecture}`, data);

export const deleteLecture = (idLecture) => axiosInstance.delete(`/lecture-requests/${idLecture}`);