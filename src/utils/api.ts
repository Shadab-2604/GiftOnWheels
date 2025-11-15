const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async getCars() {
    const response = await fetch(`${BASE_URL}/cars`);
    return response.json();
  },

  async getSettings() {
    const response = await fetch(`${BASE_URL}/settings`);
    return response.json();
  },

  async adminLogin(password: string) {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return response.json();
  },

  async saveSettings(whatsapp: string, token: string) {
    const response = await fetch(`${BASE_URL}/settings/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ whatsapp }),
    });
    return response.json();
  },

  async addCar(formData: FormData, token: string) {
    const response = await fetch(`${BASE_URL}/cars/add`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },

  async updateCar(id: string, formData: FormData, token: string) {
    const response = await fetch(`${BASE_URL}/cars/edit/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },

  async deleteCar(id: string, token: string) {
    const response = await fetch(`${BASE_URL}/cars/delete/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async changePassword(oldPassword: string, newPassword: string, token: string) {
    const response = await fetch(`${BASE_URL}/admin/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return response;
  },
};
