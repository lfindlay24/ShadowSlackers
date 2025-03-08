const API_URL = 'https://rpq5ewwiy6.execute-api.us-east-2.amazonaws.com/dev';

export const signup = async (email, password) => {

    const response = await fetch(`${API_URL}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    return response.json();
}

export const login = async (email, password) => {
    const body = {
        email: email,
        password: password
    }

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    return response.json();
}