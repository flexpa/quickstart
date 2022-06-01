import type { NextPage } from 'next'
import FlexpaLink from '@flexpa/link'
import { AppState, useAppContext } from '../contexts/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { setApp, setIsLoading } = useAppContext();
  const router = useRouter();
  useEffect(() => {
    async function exchangeToken(publicToken: string) {
      setIsLoading(true);
      const result = await fetch(`/api/exchange?public_token=${publicToken}`);
      const json = await result.json();

      // Store the access token and patient id in the app context for easy access
      setApp(() => {
        setIsLoading(false);
        return {
          flexpaAccessToken: json.access_token,
          patient: `Patient/${json.patient_id}`,
          fhirBaseURL: process.env.NEXT_PUBLIC_NEXT_PUBLIC_FHIR_BASE_URL as string,
        } as AppState;
      });
      router.push("/success");
    }

    // Configure FlexpaLink with your publishable key and a success callback.
    FlexpaLink.create({
      publishableKey: process.env.NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY as string,
      onSuccess: exchangeToken,
    });
  }, [setApp, router, setIsLoading]);

  return (
    <div className='page-container'>
      <div className='section-container'>
        <h1>
          Flexpa Quickstart
        </h1>
      </div>
      <div className='section-container'>
        <LinkHealthButton />
      </div>
    </div>
  )
}

const LinkHealthButton: NextPage = () => {
  return (
    <div className="link-section">
      Click the button below to link your health plan.
      <div className="launch-btn" onClick={() => FlexpaLink.open()}
      >
        <span className="icon-container">
          <svg aria-hidden="true" className="lock-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </span>
        Link your health plan
      </div>
    </div>
  )
}


export default Home
