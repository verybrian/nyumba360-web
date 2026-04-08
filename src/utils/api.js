export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getCSRFToken() {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1]
}

export async function apiFetch(path, options = {}) {
  const headers = { ...options.headers }

  if (options.method && options.method !== 'GET') {
    headers['X-CSRFToken'] = getCSRFToken()
  }

  return fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  })
}
