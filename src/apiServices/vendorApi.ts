import axios from 'axios';

const BASE_URL = 'https://milkywayapi.beatsacademy.in'; 

// POST: Register a new vendor
export const addVendorRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/registration/addvendorbusinessregistration/`, payload);

// GET: Get all vendors
export const getAllVendors = () =>
  axios.get(`${BASE_URL}/registration/allvendorbusinessregistration/`);

// PUT: Update a vendor by ID
export const updateVendor = (id: string, payload: any) =>
  axios.put(`${BASE_URL}/registration/updatevendorbusinessregistration/${id}/`, payload);

// DELETE: Delete a vendor by ID
export const deleteVendor = (id: string) =>
  axios.delete(`${BASE_URL}/registration/deletevendorbusinessregistration/${id}/`);

