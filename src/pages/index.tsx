import type { NextPage } from 'next'
import FlexpaLink from '@flexpa/link'
import { AppState, useAppContext } from '../../contexts/app';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const { setApp, app } = useAppContext();
  useEffect(() => {
    async function exchangeToken(publicToken: string) {
      const result = await fetch(`/api/exchange?public_token=${publicToken}`);
      const json = await result.json();

      // Store the 
      setApp({
        flexpaAccessToken: json.access_token,
        patient: `Patient/${json.patient_id}`,
        fhirBaseURL: process.env.NEXT_PUBLIC_NEXT_PUBLIC_FHIR_BASE_URL as string,
      });
    }

    // Configure FlexpaLink with your publishable key and a success callback.
    FlexpaLink.create({
      publishableKey: process.env.NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY as string,
      onSuccess: exchangeToken,
    });
  }, [setApp]);

  return (
    <div className='page-container'>
      <div className='section-container'>
        <h1>
          Welcome to Flexpa!
        </h1>
      </div>
      <div className='section-container'>
        {app?.flexpaAccessToken ?
          <LinkSuccess app={app} />
          :
          <LinkHealthButton />
        }
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
        Link your health plan
      </div>
    </div>
  )
}


const LinkSuccess: NextPage<{ app: AppState }> = ({ app }) => {
  return (
    <div>
      Success!
      Your health plan has been linked and the access token is stored in the app context.
      Access token {app.flexpaAccessToken}
    </div>
  )
}

export default Home
