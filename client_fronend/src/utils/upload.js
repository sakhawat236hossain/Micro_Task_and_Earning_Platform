import axios from 'axios';

const IMG_BB_KEY = import.meta.env.VITE_IMG_BB_KEY || '';

export const uploadToImgBB = async (file) => {
  if (!file) return '';

  // Fallback if no key is configured
  if (!IMG_BB_KEY || IMG_BB_KEY === 'your_imgbb_key_here') {
    console.warn("No imgBB key found, using a mock upload fallback.");
    return new Promise((resolve) => {
      // Simulate file upload and return a nice mockup image from Unsplash
      setTimeout(() => {
        resolve("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80");
      }, 1000);
    });
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMG_BB_KEY}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.data && response.data.data.url) {
      return response.data.data.url;
    }
    throw new Error('Invalid response from imgBB');
  } catch (error) {
    console.error("imgBB upload failed:", error);
    throw new Error('Image upload failed. Please try again.');
  }
};
