import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../contexts/app';
import Loading from './loading';


interface Props {
    protectedRoutes: string[];
    children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ protectedRoutes, children }) => {
    const router = useRouter();
    const { app, isLoading } = useAppContext();
    const isAuthenticated = app?.flexpaAccessToken && app?.patient;
    const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathIsProtected) {
            // Redirect route, you can point this to /login
            router.push('/');
        }
    }, [router, isLoading, isAuthenticated, pathIsProtected]);

    if ((isLoading || !isAuthenticated) && pathIsProtected) {
        return <Loading />;
    }

    return <>{children}</>;
}


export default PrivateRoute;