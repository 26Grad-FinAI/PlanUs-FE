import { useAuthStore } from '@/store/useAuthStore';
import type { AuthResponse } from '@/types/auth';

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '');

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: T;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | undefined,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!baseUrl) throw new Error('API 주소가 설정되지 않았어요.');

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(baseUrl + path, { ...options, headers });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new Error('서버에 연결할 수 없어요. 인터넷 연결을 확인하고 다시 시도해주세요.');
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || payload?.isSuccess !== true) {
    throw new ApiError(
      response.status,
      payload?.code,
      response.status < 500 && payload?.message
        ? payload.message
        : '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.',
    );
  }

  return payload.result as T;
}

type Session = NonNullable<ReturnType<typeof useAuthStore.getState>['session']>;
let refreshInFlight: { sessionId: symbol; promise: Promise<Session> } | undefined;

function requireSession(sessionId?: symbol): Session {
  const { session } = useAuthStore.getState();
  if (!session || (sessionId && session.id !== sessionId)) {
    throw new Error('다시 로그인해주세요.');
  }
  return session;
}

export async function refreshSession(): Promise<Session> {
  const session = requireSession();
  if (refreshInFlight?.sessionId === session.id) return refreshInFlight.promise;

  const promise = request<AuthResponse>('/auth/reissue', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  })
    .then(({ accessToken, refreshToken }) => {
      const current = requireSession(session.id);
      const updated = { ...current, accessToken, refreshToken };
      useAuthStore.setState({ session: updated });
      return updated;
    })
    .catch((error: unknown) => {
      const current = useAuthStore.getState();
      if (error instanceof ApiError && error.status === 401 && current.session?.id === session.id) {
        current.signOut();
      }
      throw error;
    })
    .finally(() => {
      if (refreshInFlight?.sessionId === session.id) refreshInFlight = undefined;
    });

  refreshInFlight = { sessionId: session.id, promise };
  return promise;
}

export async function authenticatedRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = requireSession();
  const headers = new Headers(options.headers);
  headers.set('Authorization', 'Bearer ' + session.accessToken);

  try {
    return await request<T>(path, { ...options, headers });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || options.signal?.aborted) {
      throw error;
    }
  }

  const current = requireSession(session.id);
  // 먼저 끝난 요청이 이미 토큰을 교체했다면 그 토큰으로 재시도한다.
  if (current === session) await refreshSession();
  headers.set('Authorization', 'Bearer ' + requireSession(session.id).accessToken);
  return request<T>(path, { ...options, headers });
}
