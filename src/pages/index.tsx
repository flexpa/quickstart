import type { NextPage } from 'next'
import FlexpaLink from '@flexpa/link'
import { useAppContext } from '../../contexts/app';
import { useEffect } from 'react';
const Home: NextPage = () => {
  const { setApp } = useAppContext();
  useEffect(() => {
    FlexpaLink.create({
      publishableKey: process.env.NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY as string,
      onSuccess: async (token) => {
        const result = await fetch(`/api/exchange?token=${token}`);
        const json = await result.json();
        setApp({
          flexpaJwt: json.access_token,
          patient: `Patient/${json.patient_id}`,
          fhirBaseURL: process.env.NEXT_PUBLIC_NEXT_PUBLIC_FHIR_BASE_URL as string,
        });
      },
    });
  }, [setApp]);
  return (
    <div>
      <div>
        Flexpa Quickstart
        <div className="launch-btn" onClick={() => FlexpaLink.open()}
        >
          Launch Flexpa
        </div>
      </div>
    </div>
  )
}

export default Home
