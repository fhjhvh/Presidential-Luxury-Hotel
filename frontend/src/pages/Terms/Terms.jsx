import React from 'react';
import { motion } from 'framer-motion';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page">
      <motion.div
        className="terms-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>Terms & Conditions</h1>
        <p>Please read these terms carefully before using our services</p>
      </motion.div>

      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Reservation Policy</h2>
          <p>
            All reservations are subject to availability. We recommend booking in advance
            to ensure room availability. A valid credit card is required to guarantee your reservation.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Cancellation Policy</h2>
          <p>
            Cancellations must be made at least 48 hours prior to arrival to avoid charges.
            Late cancellations or no-shows will result in a charge equivalent to one night's stay.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Check-in/Check-out</h2>
          <p>
            Standard check-in time is 3:00 PM and check-out time is 12:00 PM.
            Early check-in and late check-out are subject to availability and may incur additional charges.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Payment Terms</h2>
          <p>
            Full payment is required at check-in unless other arrangements have been made.
            We accept major credit cards and cash. All prices are subject to applicable taxes.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Guest Conduct</h2>
          <p>
            Guests are expected to conduct themselves in a manner that respects other guests
            and hotel property. The hotel reserves the right to refuse service or ask guests
            to leave if conduct is deemed inappropriate.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Liability</h2>
          <p>
            The hotel is not responsible for loss or damage to personal belongings.
            We recommend using the in-room safe for valuables.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Modifications</h2>
          <p>
            The hotel reserves the right to modify these terms and conditions at any time.
            Changes will be effective immediately upon posting on our website.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
