import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SITE_KEY = '6LeaJ3QsAAAAAPcabDrp5x_ua6XITF-58xPgfF14';

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      render: (container: string | HTMLElement, params: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; size?: string; theme?: string }) => number;
      reset: (widgetId: number) => void;
      execute: (widgetId: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadRecaptchaScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  
  return new Promise((resolve) => {
    if (scriptLoading) {
      loadCallbacks.push(resolve);
      return;
    }
    scriptLoading = true;
    
    window.onRecaptchaLoad = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      loadCallbacks.forEach(cb => cb());
      loadCallbacks.length = 0;
    };

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=he';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export const useRecaptcha = (containerId: string) => {
  const widgetIdRef = useRef<number | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    loadRecaptchaScript().then(() => {
      if (!mounted) return;
      const container = document.getElementById(containerId);
      if (!container || widgetIdRef.current !== null) return;

      window.grecaptcha.ready(() => {
        if (!mounted) return;
        widgetIdRef.current = window.grecaptcha.render(containerId, {
          sitekey: SITE_KEY,
          callback: (token: string) => { tokenRef.current = token; },
          'expired-callback': () => { tokenRef.current = null; },
          size: 'normal',
          theme: 'light',
        });
      });
    });

    return () => { mounted = false; };
  }, [containerId]);

  const verify = useCallback(async (): Promise<boolean> => {
    if (!tokenRef.current) return false;

    try {
      const { data, error } = await supabase.functions.invoke('verify-recaptcha', {
        body: { token: tokenRef.current },
      });

      if (error || !data?.success) return false;
      return true;
    } catch {
      return false;
    } finally {
      tokenRef.current = null;
      if (widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    }
  }, []);

  const hasToken = useCallback(() => !!tokenRef.current, []);

  return { verify, hasToken };
};
