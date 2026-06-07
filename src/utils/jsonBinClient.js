const BASE_URL = 'https://api.jsonbin.io/v3/b';

// Helper to clean keys from potential quotes in .env
const clean = (val) => val ? val.replace(/^["']|["']$/g, '') : '';

const CONFIG = {
  Lilia: {
    key: clean(import.meta.env.VITE_JSONBIN_ACCESS_KEY_LILIA),
    id: clean(import.meta.env.VITE_JSONBIN_BIN_ID_LILIA)
  },
  Abdallah: {
    key: clean(import.meta.env.VITE_JSONBIN_ACCESS_KEY_ABDALLAH),
    id: clean(import.meta.env.VITE_JSONBIN_BIN_ID_ABDALLAH)
  }
};

export const jsonBin = {
  fetchData: async (user) => {
    const config = CONFIG[user];
    if (!config.id || !config.key) {
      console.warn(`JSONBin: Missing config for ${user}`);
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}/${config.id}/latest`, {
        headers: { 'X-Access-Key': config.key }
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid API Key");
      }

      if (!response.ok) {
        throw new Error(`Cloud error (${response.status})`);
      }
      
      const data = await response.json();
      return data.record;
    } catch (error) {
      console.error(`JSONBin Fetch [${user}]:`, error.message);
      throw error;
    }
  },

  updateData: async (user, data) => {
    const config = CONFIG[user];
    if (!config.id || !config.key) return null;

    try {
      const response = await fetch(`${BASE_URL}/${config.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': config.key
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Update failed (${response.status})`);
      }
      
      return (await response.json()).record;
    } catch (error) {
      console.error(`JSONBin Update [${user}]:`, error.message);
      throw error;
    }
  }
};
