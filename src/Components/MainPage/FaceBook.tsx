import { Facebook } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useEffect } from 'react';

declare global {
  interface Window {
    FB: any;
  }
}

const FacebookLoginButton: React.FC = () => {
  useEffect(() => {
    // Load the Facebook SDK asynchronously
    const loadFacebookSDK = () => {
      // Replace 'your-app-id' with your Facebook App ID
      const appId = '1134224098017589';
      const script = document.createElement('script');
      script.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0&appId=${appId}&autoLogAppEvents=1`;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      script.onload = () => {
        // Initialize the Facebook SDK
        if (window.FB) {
          window.FB.init({
            appId,
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v19.0'
          });
        }
      };
    };

    loadFacebookSDK();
  }, []);

  const handleFacebookLogin = () => {
    // Trigger Facebook login process
    if (window.FB) {
      window.FB.login((response: { authResponse: any; }) => {
        if (response.authResponse) {
          // User successfully logged in
          console.log('User logged in:', response.authResponse);
          window.alert('Account Added SuccessFully');
        } else {
          // User canceled the login or something went wrong
          console.log('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'email' }); // Add additional permissions as needed
    }
  };

  return (
    <div>
      <Button onClick={() => handleFacebookLogin()}>
            <Facebook />
          </Button>
    </div>
  );
};

export default FacebookLoginButton;
