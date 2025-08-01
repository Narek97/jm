import { useEffect } from 'react';

import { useNavigate, createFileRoute } from '@tanstack/react-router';
import axios from 'axios';

import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import { TOKEN_NAME } from '@/Constants';
import { setCookie } from '@/utils/cookieHelper.ts';

// Define the expected response shape for the token API
interface TokenResponse {
  access_token: string;
}

export const Route = createFileRoute('/authorization/callback')({
  beforeLoad: async ({ search }: { search: Record<string, string | undefined> }) => {
    const code = search.code;

    // Check if code is missing
    if (!code) {
      window.location.href = `${import.meta.env.VITE_AUTHORIZATION_URL}/?state=null&redirect_uri=${import.meta.env.VITE_CALLBACK_URL}&response_type=code&client_id=${import.meta.env.VITE_CLIENT_ID}`;
    } else {
      try {
        // Make the API call to generate the token
        const response = await axios.get<TokenResponse>(
          `${import.meta.env.VITE_API_URL}/auth/generate-token?code=${encodeURIComponent(code)}`,
        );

        // Set the token in a cookie
        setCookie(TOKEN_NAME, response.data.access_token);
      } catch (error) {
        console.error(error, 'Error generating token');
        // Handle API errors by redirecting to an error page
        window.location.href = `${import.meta.env.VITE_AUTHORIZATION_URL}/?state=null&redirect_uri=${import.meta.env.VITE_CALLBACK_URL}&response_type=code&client_id=${import.meta.env.VITE_CLIENT_ID}`;
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: '/workspaces', replace: true }).then();
  }, [navigate]);

  return <BaseWuLoader />;
}
