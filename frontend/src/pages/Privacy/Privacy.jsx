import React from 'react';
import { motion } from 'framer-motion';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <motion.div
        className="privacy-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us</p>
      </motion.div>

      <div className="privacy-content">
        <section className="privacy-section">
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information that you provide to us when making a reservation,
            including your name, email address, phone number, and payment information.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to process reservations, provide services, communicate
            with you about your stay, and improve our services. We do not sell your personal
            information to third parties.
          </p>
        </section>

        <section className="privacy-section">
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="privacy-section">
          <h2>4. Cookies</h2>
          <p>
            Our website uses cookies to enhance your browsing experience and analyze site traffic.
            You can choose to disable cookies through your browser settings.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. Third-Party Services</h2>
          <p>
            We may use third-party service providers to facilitate our services. These parties
            have access to your personal information only to perform tasks on our behalf.
          </p>
        </section>

        <section className="privacy-section">
          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information.
            Contact us at privacy@plhms.luxury to exercise these rights.
          </p>
        </section>

        <section className="privacy-section">
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any
            changes by posting the new policy on this page.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at
            privacy@plhms.luxury or call +1 (555) 123-4567.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
