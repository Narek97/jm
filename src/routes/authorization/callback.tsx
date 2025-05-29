import { useEffect } from 'react';

import { createRoute, redirect, useNavigate } from '@tanstack/react-router';
import axios from 'axios';

import { rootRoute } from '../__root';

import CustomLoader from '@/Components/Shared/CustomLoader';
import { TOKEN_NAME } from '@/constants';
import { setCookie } from '@/utils/cookieHelper.ts';

// Define the expected response shape for the token API
interface TokenResponse {
  access_token: string;
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/authorization/callback',
  beforeLoad: async ({ search }: { search: Record<string, string | undefined> }) => {
    const code = search.code;

    // Check if code is missing
    if (!code) {
      throw redirect({
        to: '/error',
        search: { message: 'Authorization code is missing' },
        replace: true,
      });
    }

    try {
      // Make the API call to generate the token
      const response = await axios.get<TokenResponse>(
        `${import.meta.env.VITE_BASE_URL}/auth/generate-token?code=${encodeURIComponent(code)}`,
      );

      // Set the token in a cookie
      setCookie(TOKEN_NAME, response.data.access_token);
    } catch (error) {
      console.error(error, 'Error generating token');
      // Handle API errors by redirecting to an error page
      throw redirect({
        to: '/error',
        search: { message: 'Failed to generate token' },
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: '/workspaces', replace: true }).then();
  }, [navigate]);

  return <CustomLoader />;
}
