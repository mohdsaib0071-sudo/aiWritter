export const API_BASE_URL = "http://10.0.2.2:4000";

export async function registerApi(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginApi(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Check if response exists and is JSON
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // If data is null, the server might be down
      throw new Error(data?.message || "Server connection failed");
    }

    return data; 
  } catch (error) {
    // If you see this in terminal, it's a network issue
    console.error("Network Error:", error.message);
    throw error;
  }
}

export async function generateEssayApi(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/essay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Essay generation failed");
    }

    return data;
  } catch (error) {
    console.error("Essay API Error:", error.message);
    throw error;
  }
}

export async function generatePoemApi(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/poem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Poem generation failed");
    }

    return data;
  } catch (error) {
    console.error("Poem API Error:", error.message);
    throw error;
  }
}