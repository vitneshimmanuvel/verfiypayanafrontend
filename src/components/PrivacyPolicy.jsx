import React, { useEffect } from 'react';
//dggsg
const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - Payana Overseas";
    window.scrollTo(0, 0);
  }, []);

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '60px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#333',
      lineHeight: '1.8',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '30px',
      textAlign: 'center',
      color: '#1a1a1a'
    },
    subtitle: {
      fontSize: '1.8rem',
      fontWeight: '600',
      marginTop: '40px',
      marginBottom: '20px',
      color: '#222'
    },
    paragraph: {
      marginBottom: '20px',
      fontSize: '1.1rem'
    },
    list: {
      paddingLeft: '30px',
      marginBottom: '30px',
      fontSize: '1.1rem'
    },
    listItem: {
      marginBottom: '15px'
    },
    link: {
      color: '#0066cc',
      textDecoration: 'none'
    },
    footerText: {
      marginTop: '40px',
      fontSize: '0.9rem',
      color: '#666',
      borderTop: '1px solid #eee',
      paddingTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Privacy Policy</h1>
      
      <p style={styles.paragraph}>
        Payana Overseas recognizes the importance of preserving complete confidentiality. Any personal information and/or business proprietary material that you might disclose to us is treated with strict confidence.
      </p>

      <p style={styles.paragraph}>
        All information given to Payana Overseas by its prospective clients is kept strictly confidential and on a need-to-know basis and is protected. We will only record your personal details if you send us a message. You can be assured that your personal information is used only by our trained staff for the purpose of the work you have engaged our office to do.
      </p>

      <p style={styles.paragraph}>
        We will not use your e-mail address for any other purpose, and will not disclose it, without your consent. Your information is never used for marketing or solicitation and is never sold or given to anyone for these purposes.
      </p>

      <p style={styles.paragraph}>
        Payana Overseas never supplies any other person or organization with your information except those government agencies involved in your immigration process (e.g. Australian Immigration Authorities, DIAC or the Home Office, UK, etc.).
      </p>

      <p style={styles.paragraph}>
        You can register with our website if you would like to receive our newsletter, catalog or updates on our new products and services. The information you submit on our website will not be used for this purpose unless you have given us your specific consent to do so.
      </p>

      <p style={styles.paragraph}>
        The website has security measures in place to protect against the loss, misuse and alteration of the information under our control. We encrypt all of your personal and financial information and use our best efforts to prevent it from being read or intercepted as the information travels over the Internet. While we are committed to protecting your information, we cannot ensure or warrant the security of any information you transmit to us.
      </p>

      <p style={styles.paragraph}>
        The Site provides links to websites and access to content, products and services from third parties, including users, advertisers, affiliates and sponsors of the Site. You agree that Payana Overseas is not responsible for the availability of, and content provided on, third party websites. The User is requested to peruse the policies posted by other websites regarding privacy and other topics before use. Payana Overseas is not responsible for third party content accessible through the Site, including opinions, advice, statements and advertisements, and User shall bear all risks associated with the use of such content. Payana Overseas is not responsible for any loss or damage of any sort User may incur from dealing with any third party.
      </p>

      <p style={styles.paragraph}>
        Our Privacy Policy and the Terms and Conditions may change from time to time. Clients should check our website frequently to see any recent changes. Our current Privacy Policy applies to all information that we have about you and your account, unless stated otherwise.
      </p>

      <h2 style={styles.subtitle}>Mobile Apps</h2>
      <p style={styles.paragraph}>We will request the following permissions when you install our Applications:</p>

      <ol style={styles.list}>
        <li style={styles.listItem}>We ask for the access of Location which allows users to share location to show nearby Centres/Institutes. If the user allows sharing his/her location, the nearby Centres/Institutes will be shown; otherwise, the default view will be shown.</li>
        <li style={styles.listItem}>We ask for the access of Storage because we allow users to store Test Sheets, Answer Sheets and Performance Reports to view their test analysis.</li>
        <li style={styles.listItem}>We ask for the access of Device Camera because it is used to get the user profile image to display on the Profile page; to get the same in the User listings on the different analytics displayed on the website; or to get the Subjective Test Sheets captured, which will then be shared with the tutor to evaluate the sheets.</li>
        <li style={styles.listItem}>We ask for the access of Device’s Microphone which is used to record the audio for the Speaking Tests.</li>
        <li style={styles.listItem}>We ask for the access of Identity to auto-fill the Gmail account on the device in order to provide the user a fast sign up process.</li>
        <li style={styles.listItem}>We ask for the access of Photos/Media/Files which helps the user to select profile picture from device’s gallery.</li>
        <li style={styles.listItem}>We ask for the access of SMS for auto-filling of OTP through SMS in order to provide the user a fast sign up process.</li>
        <li style={styles.listItem}>We ask for the access of Device ID & Call Information for getting Device ID of user’s device, so we can find and fix bugs appearing on a specific device in order to provide better UX.</li>
      </ol>

      <p style={styles.paragraph}>
        For further details, please Talk to an expert or you can e-mail us on <a href="mailto:info@payanaoverseas.com" style={styles.link}>info@payanaoverseas.com</a>. One of our representatives will get back to you at the earliest.
      </p>

      <p style={styles.footerText}>
        We are License Recruitment Agent in India (B-0553/AP/COM/1000+/5/8968/2013).
      </p>
    </div>
  );
};

export default PrivacyPolicy;
