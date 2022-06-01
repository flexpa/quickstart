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

      // Store the access token and patient id in the app context for easy access
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
          Flexpa Quickstart
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


const LinkSuccess: NextPage<{ app: AppState }> = ({ app }) => {
  return (
    <div>
      <div className=''>
        Success, your health plan has been linked!
        The access token and patient ID are now stored in the app context.
      </div>
      <div className='app-context'>
        <div className='table-heading'>Patient ID</div>
        <div className='code'>{app.patient}</div>
      </div>
      <div className='app-context'>
        <div className='table-heading'>Access Token</div>
        <div className='code'>{app.flexpaAccessToken}</div>
      </div>
      <div>

      </div>

    </div>
  )
}

export default Home
