/**
 * Supabase Middleware Helper
 *
 * Refreshes the auth session on every request and writes
 * updated cookies to the response.
 */

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          // Set cookies on the request (for downstream server components)
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )

          // Create a new response with updated request
          supabaseResponse = NextResponse.next({ request })

          // Set cookies on the response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )

          // Set cache-control headers to prevent CDN caching of auth responses
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          )
        },
      },
    },
  )

  // Refresh the session — this must happen before any response is generated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user, supabase }
}
