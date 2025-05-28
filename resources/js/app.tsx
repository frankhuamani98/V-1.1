import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import WelcomeAlert from '@/Components/WelcomeAlert';
import WhatsAppButton from '@/Components/WhatsAppButton';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster 
                    position="top-center" 
                    richColors 
                    expand={true}
                    className="!top-[3.5rem] sm:!top-[4rem]"
                />
                <WhatsAppButton />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
