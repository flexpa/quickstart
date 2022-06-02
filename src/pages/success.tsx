import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppContext } from '../contexts/app';

const LinkSuccess: NextPage = () => {
    const { app } = useAppContext();
    const router = useRouter();
    useEffect(() => {
        if (!(app?.patient && app?.flexpaAccessToken)) {
            router.replace("/");
        }
    }, [router, app]);

    return (
        <div className='page-container'>
            <div className='section-container'>
                <h1>
                    Success, your health plan has been linked!
                </h1>
                <div>
                    The access token and patient ID are now stored in the AppContext.
                    The application is ready to start making FHIR resource requests.
                </div>
            </div>
            <div>
                <div className='app-context'>
                    <div className='table-heading'>Patient ID</div>
                    <div className='code'>{app?.patient}</div>
                </div>
                <div className='app-context'>
                    <div className='table-heading'>Access Token</div>
                    <div className='code'>{app?.flexpaAccessToken}</div>
                </div>
            </div>
        </div>
    )
}

export default LinkSuccess;