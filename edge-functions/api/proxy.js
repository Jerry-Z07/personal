const ALLOWED_TARGET_HOSTS = new Set([
  'uapis.cn',
  'v1.jinrishici.com',
  'blog.078465.xyz',
])

const ALLOWED_ORIGINS = new Set([
  'https://078465.xyz',
  'https://www.078465.xyz',
  'http://localhost:5173',
])

const TTL_BY_HOST = {
  'uapis.cn': 60,
  'v1.jinrishici.com': 300,
  'blog.078465.xyz': 300,
}

export function onRequestOptions(context) {
  const requestUrl = new URL(context.request.url)
  const requestOrigin = context.request.headers.get('Origin')
  const allowOrigin = resolveAllowOrigin(requestUrl, requestOrigin)

  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(allowOrigin),
  })
}

export async function onRequestGet(context) {
  const request = context.request
  const requestUrl = new URL(request.url)
  const requestOrigin = request.headers.get('Origin')
  const allowOrigin = resolveAllowOrigin(requestUrl, requestOrigin)

  const rawTarget = requestUrl.searchParams.get('quest')
  if (!rawTarget) {
    return createErrorResponse(400, 'Missing quest query parameter', allowOrigin)
  }

  let targetUrl
  try {
    targetUrl = new URL(rawTarget)
  } catch {
    return createErrorResponse(400, 'Invalid quest URL', allowOrigin)
  }

  if (targetUrl.protocol !== 'https:') {
    return createErrorResponse(400, 'Only HTTPS target is allowed', allowOrigin)
  }

  if (!ALLOWED_TARGET_HOSTS.has(targetUrl.hostname)) {
    return createErrorResponse(403, 'Target host not allowed', allowOrigin)
  }

  try {
    const upstreamResponse = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: request.headers.get('Accept') || '*/*',
      },
    })

    const responseHeaders = new Headers(upstreamResponse.headers)
    applyCorsHeaders(responseHeaders, allowOrigin)
    setPublicCacheControl(responseHeaders, targetUrl.hostname)

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Pages proxy request failed', {
      target: targetUrl.toString(),
      message: error instanceof Error ? error.message : String(error),
    })

    return createErrorResponse(502, 'Upstream request failed', allowOrigin)
  }
}

function createErrorResponse(status, message, allowOrigin) {
  const headers = buildCorsHeaders(allowOrigin)
  return new Response(message, { status, headers })
}

function resolveAllowOrigin(requestUrl, requestOrigin) {
  if (requestOrigin && ALLOWED_ORIGINS.has(requestOrigin)) {
    return requestOrigin
  }

  if (requestOrigin === requestUrl.origin) {
    return requestOrigin
  }

  return requestUrl.origin
}

function buildCorsHeaders(allowOrigin) {
  const headers = new Headers()
  applyCorsHeaders(headers, allowOrigin)
  return headers
}

function applyCorsHeaders(headers, allowOrigin) {
  headers.set('Access-Control-Allow-Origin', allowOrigin)
  headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Accept,Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  headers.set('Vary', appendVary(headers.get('Vary'), 'Origin'))
}

function appendVary(currentValue, key) {
  if (!currentValue) {
    return key
  }

  const values = currentValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (!values.includes(key)) {
    values.push(key)
  }

  return values.join(', ')
}

function setPublicCacheControl(headers, host) {
  if (headers.has('Cache-Control')) {
    return
  }

  const maxAge = TTL_BY_HOST[host] || 60
  headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`)
}
