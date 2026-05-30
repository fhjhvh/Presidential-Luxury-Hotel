// PDF Export Utility for Bookings
// Uses browser print functionality for PDF generation

export const generateBookingPDF = (booking, type = 'room') => {
  const printWindow = window.open('', '_blank');
  
  let content = '';
  
  if (type === 'room') {
    content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Confirmation - ${booking.bookingNumber}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: #fff;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #c9a44c;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .hotel-name {
            font-size: 28px;
            color: #1a1a2e;
            margin: 0;
            letter-spacing: 2px;
          }
          .hotel-tagline {
            color: #c9a44c;
            font-style: italic;
            margin-top: 5px;
          }
          .booking-title {
            text-align: center;
            font-size: 22px;
            color: #1a1a2e;
            margin: 20px 0;
          }
          .booking-number {
            text-align: center;
            font-size: 18px;
            color: #c9a44c;
            margin-bottom: 30px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .detail-box {
            background: #f8f8f8;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #c9a44c;
          }
          .detail-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .detail-value {
            font-size: 16px;
            color: #1a1a2e;
            font-weight: bold;
          }
          .price-section {
            background: #1a1a2e;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          .total-price {
            font-size: 32px;
            color: #c9a44c;
            margin: 10px 0;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
          }
          .status-confirmed { background: #4CAF50; color: white; }
          .status-pending { background: #FF9800; color: white; }
          .status-cancelled { background: #F44336; color: white; }
          .status-rescheduled { background: #2196F3; color: white; }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="hotel-name">PALACE LUXURY HOTEL</h1>
          <p class="hotel-tagline">Where Luxury Meets Excellence</p>
        </div>
        
        <h2 class="booking-title">Room Booking Confirmation</h2>
        <p class="booking-number">#${booking.bookingNumber}</p>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span>
        </div>
        
        <div class="details-grid">
          <div class="detail-box">
            <div class="detail-label">Guest Name</div>
            <div class="detail-value">${booking.user?.firstName || ''} ${booking.user?.lastName || ''}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Email</div>
            <div class="detail-value">${booking.user?.email || ''}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Room Number</div>
            <div class="detail-value">${booking.room?.roomNumber || 'N/A'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Room Type</div>
            <div class="detail-value">${booking.room?.type || 'N/A'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Check-In Date</div>
            <div class="detail-value">${new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Check-Out Date</div>
            <div class="detail-value">${new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Number of Guests</div>
            <div class="detail-value">${booking.numberOfGuests || 1}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Booking Date</div>
            <div class="detail-value">${new Date(booking.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        
        <div class="price-section">
          <div class="detail-label" style="color: #999;">Total Amount</div>
          <div class="total-price">$${(booking.finalPrice || booking.totalPrice || 0).toFixed(2)}</div>
          ${booking.discountApplied > 0 ? `<div style="color: #4CAF50;">Discount Applied: $${booking.discountApplied.toFixed(2)}</div>` : ''}
        </div>
        
        ${booking.specialRequests ? `
        <div class="detail-box" style="margin-bottom: 20px;">
          <div class="detail-label">Special Requests</div>
          <div class="detail-value">${booking.specialRequests}</div>
        </div>
        ` : ''}
        
        <div class="footer">
          <p>Thank you for choosing Palace Luxury Hotel</p>
          <p>For inquiries, please contact: reservations@palacehotel.com | +1 (555) 123-4567</p>
          <p>Printed on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  } else if (type === 'service') {
    const serviceNames = {
      spa: '💆 Spa & Massage',
      gym: '🏋️ Gym Access',
      pool: '🏊 Pool Access',
      driver: '🚗 Driver Service',
      butler: '🎩 Butler Service'
    };
    
    content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Service Booking - ${booking.bookingNumber}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: #fff;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #c9a44c;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .hotel-name {
            font-size: 28px;
            color: #1a1a2e;
            margin: 0;
            letter-spacing: 2px;
          }
          .booking-title {
            text-align: center;
            font-size: 22px;
            color: #1a1a2e;
            margin: 20px 0;
          }
          .booking-number {
            text-align: center;
            font-size: 18px;
            color: #c9a44c;
            margin-bottom: 30px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .detail-box {
            background: #f8f8f8;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #c9a44c;
          }
          .detail-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .detail-value {
            font-size: 16px;
            color: #1a1a2e;
            font-weight: bold;
          }
          .price-section {
            background: #1a1a2e;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          .total-price {
            font-size: 32px;
            color: #c9a44c;
            margin: 10px 0;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
            background: #4CAF50;
            color: white;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="hotel-name">PALACE LUXURY HOTEL</h1>
        </div>
        
        <h2 class="booking-title">${serviceNames[booking.serviceType] || booking.serviceType} Booking</h2>
        <p class="booking-number">#${booking.bookingNumber}</p>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="status-badge">${booking.status}</span>
        </div>
        
        <div class="details-grid">
          <div class="detail-box">
            <div class="detail-label">Guest Name</div>
            <div class="detail-value">${booking.guestName || ''}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Email</div>
            <div class="detail-value">${booking.guestEmail || ''}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Service Type</div>
            <div class="detail-value">${booking.serviceType?.toUpperCase() || 'N/A'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Date</div>
            <div class="detail-value">${new Date(booking.bookingDate).toLocaleDateString()}</div>
          </div>
          ${booking.startTime ? `
          <div class="detail-box">
            <div class="detail-label">Time</div>
            <div class="detail-value">${booking.startTime}</div>
          </div>
          ` : ''}
          ${booking.duration ? `
          <div class="detail-box">
            <div class="detail-label">Duration</div>
            <div class="detail-value">${booking.duration}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="price-section">
          <div class="detail-label" style="color: #999;">Total Amount</div>
          <div class="total-price">$${(booking.totalPrice || 0).toFixed(2)}</div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Palace Luxury Hotel Services</p>
          <p>Printed on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  }
  
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

export const generateServicePDF = (service) => {
  const printWindow = window.open('', '_blank');
  
  const serviceNames = {
    spa: '💆 Spa & Massage',
    gym: '🏋️ Gym Access',
    pool: '🏊 Pool Access',
    driver: '🚗 Driver Service',
    butler: '🎩 Butler Service'
  };
  
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Service Booking - ${service.bookingNumber}</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: #fff;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #c9a44c;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .hotel-name {
          font-size: 28px;
          color: #1a1a2e;
          margin: 0;
          letter-spacing: 2px;
        }
        .hotel-tagline {
          color: #c9a44c;
          font-style: italic;
          margin-top: 5px;
        }
        .booking-title {
          text-align: center;
          font-size: 22px;
          color: #1a1a2e;
          margin: 20px 0;
        }
        .booking-number {
          text-align: center;
          font-size: 18px;
          color: #c9a44c;
          margin-bottom: 30px;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .details-table th,
        .details-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .details-table th {
          background: #f9f9f9;
          font-weight: bold;
          width: 40%;
        }
        .total-row {
          background: #1a1a2e;
          color: #c9a44c;
          font-size: 18px;
        }
        .total-row th,
        .total-row td {
          padding: 15px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #888;
          font-size: 12px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .status {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }
        .status-confirmed { background: #e8f5e9; color: #2e7d32; }
        .status-pending { background: #fff3e0; color: #ef6c00; }
        .status-cancelled { background: #ffebee; color: #c62828; }
        .status-completed { background: #e3f2fd; color: #1565c0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="hotel-name">PLHMS HOTEL</h1>
        <p class="hotel-tagline">Premium Luxury Hotel Management</p>
      </div>
      
      <h2 class="booking-title">Service Booking Confirmation</h2>
      <p class="booking-number">Booking #${service.bookingNumber}</p>
      
      <table class="details-table">
        <tr>
          <th>Service</th>
          <td>${serviceNames[service.serviceType] || service.serviceType}</td>
        </tr>
        <tr>
          <th>Guest Name</th>
          <td>${service.guestName || 'N/A'}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>${new Date(service.bookingDate).toLocaleDateString()}</td>
        </tr>
        <tr>
          <th>Time</th>
          <td>${service.startTime || 'N/A'} - ${service.endTime || 'N/A'}</td>
        </tr>
        <tr>
          <th>Duration</th>
          <td>${service.duration || 'N/A'} minutes</td>
        </tr>
        <tr>
          <th>Status</th>
          <td><span class="status status-${service.status?.toLowerCase()}">${service.status}</span></td>
        </tr>
        <tr class="total-row">
          <th>Total Price</th>
          <td>$${(service.totalPrice || 0).toFixed(2)}</td>
        </tr>
      </table>
      
      <div class="footer">
        <p>Thank you for choosing PLHMS Hotel</p>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

export const generateButlerPDF = (booking, formData, user, activeRoom) => {
  const printWindow = window.open('', '_blank');

  const serviceLabels = { basic: 'Basic Butler', premium: 'Premium Butler', exclusive: 'Exclusive Butler' };
  const durationLabels = { '2hours': '2 Hours', '4hours': '4 Hours', half_day: 'Half Day', full_day: 'Full Day' };
  const interactionLabels = {
    interactionMinimal: 'Minimal — Quiet & Discreet',
    interactionModerate: 'Moderate — Available on Request',
    interactionVerbose: 'Verbose — Proactive & Engaging'
  };
  const styleLabels = {
    styleFormal: 'Formal',
    styleCasual: 'Casual',
    styleDiscrete: 'Discrete'
  };

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Butler Service Confirmation — ${booking.bookingNumber}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; max-width: 820px; margin: 0 auto; padding: 48px 40px; background: #fff; color: #222; }
        .header { text-align: center; border-bottom: 3px solid #c9a44c; padding-bottom: 24px; margin-bottom: 32px; }
        .hotel-name { font-size: 26px; color: #1a1a2e; letter-spacing: 3px; font-weight: bold; }
        .hotel-tagline { color: #c9a44c; font-style: italic; margin-top: 6px; font-size: 14px; }
        .doc-title { text-align: center; font-size: 20px; color: #1a1a2e; margin: 18px 0 6px; }
        .booking-number { text-align: center; font-size: 17px; color: #c9a44c; margin-bottom: 8px; font-weight: bold; }
        .status-badge { display: inline-block; padding: 6px 20px; border-radius: 20px; background: #4CAF50; color: #fff; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .badge-center { text-align: center; margin-bottom: 28px; }
        .section { margin-bottom: 28px; }
        .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #c9a44c; border-bottom: 1px solid #e8e0d0; padding-bottom: 6px; margin-bottom: 14px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .detail-box { background: #f9f6f0; padding: 12px 16px; border-radius: 6px; border-left: 3px solid #c9a44c; }
        .detail-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .detail-value { font-size: 15px; color: #1a1a2e; font-weight: bold; }
        .price-band { background: #1a1a2e; color: #fff; padding: 20px 24px; border-radius: 8px; text-align: center; margin: 28px 0; }
        .price-label { font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; }
        .price-value { font-size: 36px; color: #c9a44c; font-weight: bold; margin: 6px 0; }
        .tasks-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .task-tag { background: #f0ead8; color: #5a4a20; border: 1px solid #c9a44c33; padding: 4px 12px; border-radius: 14px; font-size: 13px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px; line-height: 1.7; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="hotel-name">PALACE LUXURY HOTEL</h1>
        <p class="hotel-tagline">Where Luxury Meets Excellence</p>
      </div>

      <h2 class="doc-title">🎩 Personal Butler Booking Confirmation</h2>
      <p class="booking-number">#${booking.bookingNumber}</p>
      <div class="badge-center">
        <span class="status-badge">${booking.status || 'CONFIRMED'}</span>
      </div>

      <!-- Guest Details -->
      <div class="section">
        <div class="section-title">Guest Details</div>
        <div class="grid-2">
          <div class="detail-box">
            <div class="detail-label">Full Name</div>
            <div class="detail-value">${user?.firstName || ''} ${user?.lastName || ''}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Email Address</div>
            <div class="detail-value">${user?.email || '—'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Phone Number</div>
            <div class="detail-value">${user?.phone || '—'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Personal ID Number</div>
            <div class="detail-value">${user?.idNumber || '—'}</div>
          </div>
          ${activeRoom ? `
          <div class="detail-box">
            <div class="detail-label">Room Number</div>
            <div class="detail-value">Room ${activeRoom}</div>
          </div>` : ''}
        </div>
      </div>

      <!-- Service Details -->
      <div class="section">
        <div class="section-title">Service Details</div>
        <div class="grid-2">
          <div class="detail-box">
            <div class="detail-label">Service Package</div>
            <div class="detail-value">${serviceLabels[formData.serviceType] || formData.serviceType}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Duration</div>
            <div class="detail-value">${durationLabels[formData.duration] || formData.duration}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Date</div>
            <div class="detail-value">${formData.date ? new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Time</div>
            <div class="detail-value">${formData.time || '—'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Language</div>
            <div class="detail-value">${formData.language || '—'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Interaction Style</div>
            <div class="detail-value">${interactionLabels[formData.interactionLevel] || formData.interactionLevel || '—'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Service Style</div>
            <div class="detail-value">${styleLabels[formData.serviceStyle] || formData.serviceStyle || '—'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Leaving Hotel</div>
            <div class="detail-value">${formData.leavingHotel === 'leavingYes' ? 'Yes' : formData.leavingHotel === 'leavingNo' ? 'No' : 'Maybe'}</div>
          </div>
        </div>
      </div>

      ${formData.tasks?.length > 0 ? `
      <div class="section">
        <div class="section-title">Requested Tasks (${formData.tasks.length})</div>
        <div class="tasks-list">
          ${formData.tasks.map(t => `<span class="task-tag">${t}</span>`).join('')}
        </div>
      </div>` : ''}

      ${formData.notes ? `
      <div class="section">
        <div class="section-title">Special Notes</div>
        <p style="color: #555; font-style: italic; padding: 12px 16px; background: #f9f6f0; border-radius: 6px;">${formData.notes}</p>
      </div>` : ''}

      <div class="price-band">
        <div class="price-label">Total Amount</div>
        <div class="price-value">$${(booking.totalPrice || 0).toFixed(2)}</div>
        <div style="color: #aaa; font-size: 13px; margin-top: 4px;">Charged to your account · No advance payment required</div>
      </div>

      <div class="footer">
        <p><strong>Palace Luxury Hotel</strong> · Personal Butler Services</p>
        <p>reservations@palacehotel.com &nbsp;|&nbsp; +1 (555) 123-4567</p>
        <p>Booked: ${new Date(booking.createdAt || Date.now()).toLocaleString()} &nbsp;|&nbsp; Printed: ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); }, 250);
};

export const generateReportPDF = (data, range = 'monthly') => {
  const printWindow = window.open('', '_blank');
  const rangeLabel = range === 'daily' ? 'Daily Report — Today' : range === 'yearly' ? 'Annual Report — This Year' : 'Monthly Report — This Month';
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hotel Report — ${rangeLabel}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; max-width: 820px; margin: 0 auto; padding: 48px 40px; background: #fff; color: #222; }
        .header { text-align: center; border-bottom: 3px solid #c9a44c; padding-bottom: 24px; margin-bottom: 32px; }
        .hotel-name { font-size: 26px; color: #1a1a2e; letter-spacing: 3px; font-weight: bold; }
        .hotel-tagline { color: #c9a44c; font-style: italic; margin-top: 6px; font-size: 14px; }
        .report-title { text-align: center; font-size: 20px; color: #1a1a2e; margin: 18px 0 4px; }
        .report-date { text-align: center; color: #888; font-size: 13px; margin-bottom: 28px; }
        .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #c9a44c; border-bottom: 1px solid #e8e0d0; padding-bottom: 6px; margin: 24px 0 14px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
        .metric-box { background: #f9f6f0; padding: 14px 16px; border-radius: 6px; border-left: 3px solid #c9a44c; }
        .metric-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .metric-value { font-size: 20px; color: #1a1a2e; font-weight: bold; }
        .metric-sub { font-size: 11px; color: #aaa; margin-top: 2px; }
        .revenue-band { background: #1a1a2e; color: #fff; padding: 20px 24px; border-radius: 8px; text-align: center; margin: 24px 0; }
        .revenue-label { font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; }
        .revenue-value { font-size: 40px; color: #c9a44c; font-weight: bold; margin: 6px 0; }
        .breakdown-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0ead8; }
        .breakdown-row:last-child { border-bottom: none; font-weight: bold; font-size: 15px; }
        .breakdown-label { color: #555; }
        .breakdown-value { color: #1a1a2e; font-weight: bold; }
        .status-row { display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap; }
        .status-chip { padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .chip-confirmed { background: #D1FAE5; color: #065F46; }
        .chip-completed { background: #DBEAFE; color: #1E40AF; }
        .chip-cancelled { background: #FEE2E2; color: #991B1B; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px; line-height: 1.8; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="hotel-name">PALACE LUXURY HOTEL</h1>
        <p class="hotel-tagline">Where Luxury Meets Excellence</p>
      </div>

      <h2 class="report-title">📈 ${rangeLabel}</h2>
      <p class="report-date">Generated: ${dateStr}</p>

      <div class="revenue-band">
        <div class="revenue-label">Total Revenue</div>
        <div class="revenue-value">$${(data.totalRevenue || 0).toFixed(2)}</div>
        <div style="color:#aaa; font-size:13px;">All revenue sources combined</div>
      </div>

      <div class="section-title">Revenue Breakdown</div>
      <div class="breakdown-row"><span class="breakdown-label">Room Bookings (${data.totalBookings || 0} bookings)</span><span class="breakdown-value">$${(data.bookingRevenue || 0).toFixed(2)}</span></div>
      <div class="breakdown-row"><span class="breakdown-label">Store Orders (${data.totalOrders || 0} orders)</span><span class="breakdown-value">$${(data.orderRevenue || 0).toFixed(2)}</span></div>
      <div class="breakdown-row"><span class="breakdown-label">Services (${data.totalServices || 0} bookings)</span><span class="breakdown-value">$${(data.serviceRevenue || 0).toFixed(2)}</span></div>
      <div class="breakdown-row"><span class="breakdown-label">Grand Total</span><span class="breakdown-value" style="color:#c9a44c;">$${(data.totalRevenue || 0).toFixed(2)}</span></div>

      <div class="section-title">Occupancy & Rooms</div>
      <div class="grid-3">
        <div class="metric-box"><div class="metric-label">Total Rooms</div><div class="metric-value">${data.totalRooms || 0}</div></div>
        <div class="metric-box"><div class="metric-label">Available Now</div><div class="metric-value">${data.availableRooms || 0}</div></div>
        <div class="metric-box"><div class="metric-label">Occupancy Rate</div><div class="metric-value">${data.occupancyRate || 0}%</div></div>
      </div>

      <div class="section-title">Booking Status</div>
      <div class="status-row">
        <span class="status-chip chip-confirmed">✓ Confirmed / Active: ${data.confirmedBookings || 0}</span>
        <span class="status-chip chip-completed">✔ Completed: ${data.completedBookings || 0}</span>
        <span class="status-chip chip-cancelled">✗ Cancelled: ${data.cancelledBookings || 0}</span>
      </div>

      <div class="section-title">Guests</div>
      <div class="grid-3">
        <div class="metric-box"><div class="metric-label">Total Guests</div><div class="metric-value">${data.totalUsers || 0}</div></div>
        <div class="metric-box"><div class="metric-label">New This Period</div><div class="metric-value">${data.newUsers || 0}</div><div class="metric-sub">Registered</div></div>
      </div>

      <div class="footer">
        <p><strong>Palace Luxury Hotel</strong> · Management Report</p>
        <p>Printed: ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); }, 250);
};

export const generateOrderPDF = (order) => {
  const printWindow = window.open('', '_blank');
  
  const itemsList = order.items?.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.item?.name || 'Item'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price || 0).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${((item.price || 0) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('') || '';
  
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Receipt - ${order.orderNumber}</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: #fff;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #c9a44c;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .hotel-name {
          font-size: 28px;
          color: #1a1a2e;
          margin: 0;
        }
        .order-title {
          text-align: center;
          font-size: 22px;
          margin: 20px 0;
        }
        .order-number {
          text-align: center;
          font-size: 18px;
          color: #c9a44c;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background: #1a1a2e;
          color: #fff;
          padding: 12px;
          text-align: left;
        }
        .total-row {
          font-size: 18px;
          font-weight: bold;
          background: #f8f8f8;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="hotel-name">PALACE LUXURY HOTEL</h1>
      </div>
      
      <h2 class="order-title">${order.orderType === 'MARKET' ? '🛍️ Market Order' : '🍽️ Restaurant Order'}</h2>
      <p class="order-number">#${order.orderNumber}</p>
      
      <p><strong>Customer:</strong> ${order.clientName || 'Guest'}</p>
      <p><strong>Room:</strong> ${order.roomNumber || 'N/A'}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
          <tr class="total-row">
            <td colspan="3" style="padding: 15px; text-align: right;">Total:</td>
            <td style="padding: 15px; text-align: right; color: #c9a44c;">$${(order.totalPrice || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
      
      <div class="footer">
        <p>Thank you for your order!</p>
        <p>Printed on: ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
