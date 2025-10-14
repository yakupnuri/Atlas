// Email utility - Demo mode: logs to console
export async function sendEmail({ to, subject, html }) {
  console.log('\n📧 EMAIL SENT (Demo Mode)');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Body:', html.substring(0, 200) + '...');
  console.log('---\n');
  
  return { success: true, messageId: 'demo-' + Date.now() };
}

export function generateReservationEmail({ name, eventTitle, eventDate, eventLocation, eventAddress, count, reservationId }) {
  return {
    subject: `🎟️ Je ticket voor ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #05B6C4 0%, #0891A0 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 { margin: 0 0 10px 0; font-size: 28px; }
          .header p { margin: 0; opacity: 0.9; font-size: 16px; }
          
          .ticket-container {
            margin: 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            border: 2px dashed #05B6C4;
            padding: 30px;
            position: relative;
          }
          .ticket-title {
            font-size: 24px;
            font-weight: bold;
            color: #05B6C4;
            margin: 0 0 20px 0;
            text-align: center;
          }
          .ticket-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .detail-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-row:last-child { border-bottom: none; }
          .detail-label {
            font-weight: 600;
            color: #666;
            width: 140px;
            flex-shrink: 0;
          }
          .detail-value {
            color: #333;
            flex: 1;
          }
          
          .qr-section {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
          }
          .qr-code {
            width: 150px;
            height: 150px;
            background: white;
            border: 2px solid #05B6C4;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #666;
            margin: 10px 0;
          }
          .reservation-id {
            font-size: 24px;
            font-weight: bold;
            color: #05B6C4;
            letter-spacing: 2px;
            margin: 15px 0;
          }
          
          .info-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 30px;
            border-radius: 4px;
          }
          .info-box p { margin: 5px 0; font-size: 14px; }
          
          .footer { 
            text-align: center; 
            padding: 30px; 
            background: #f8f9fa;
            font-size: 13px; 
            color: #666; 
          }
          .footer a { color: #05B6C4; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>🎉 Reservering Bevestigd!</h1>
            <p>Je ticket is klaar</p>
          </div>
          
          <div style="padding: 30px; text-align: center;">
            <h2 style="color: #333; margin: 0 0 10px 0;">Beste ${name},</h2>
            <p style="color: #666; font-size: 16px;">Geweldig nieuws! Je reservering is bevestigd. Bewaar dit ticket goed.</p>
          </div>

          <div class="ticket-container">
            <div class="ticket-title">🎟️ JE TICKET</div>
            
            <div class="ticket-details">
              <div class="detail-row">
                <div class="detail-label">📅 Evenement</div>
                <div class="detail-value"><strong>${eventTitle}</strong></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">🕒 Datum & Tijd</div>
                <div class="detail-value">${new Date(eventDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">📍 Locatie</div>
                <div class="detail-value">${eventLocation}<br><span style="font-size: 13px; color: #666;">${eventAddress}</span></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">👥 Aantal personen</div>
                <div class="detail-value"><strong>${count} ${count === 1 ? 'persoon' : 'personen'}</strong></div>
              </div>
            </div>

            <div class="qr-section">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Reserveringsnummer</p>
              <div class="reservation-id">#${reservationId.substring(0, 8).toUpperCase()}</div>
              <div class="qr-code">
                <div style="text-align: center;">
                  <div style="font-size: 40px;">■■■</div>
                  <div style="font-size: 10px; margin-top: 5px;">QR Code</div>
                </div>
              </div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Toon dit bij de ingang</p>
            </div>
          </div>

          <div class="info-box">
            <p><strong>💡 Belangrijk om te weten:</strong></p>
            <p>• Kom 15 minuten voor aanvang</p>
            <p>• Toon dit ticket (digitaal of geprint) bij binnenkomst</p>
            <p>• Bij annulering, neem contact op via info@stichtingatlas.nl</p>
          </div>

          <div style="text-align: center; padding: 0 30px 30px 30px;">
            <p style="color: #666; font-size: 14px; margin: 0 0 20px 0;">We kijken ernaar uit je te verwelkomen! Tot snel!</p>
            <p style="color: #666; font-size: 14px; margin: 0;">Met vriendelijke groet,<br><strong style="color: #05B6C4;">Team Stichting Atlas</strong></p>
          </div>

          <div class="footer">
            <p><strong>Stichting Atlas</strong></p>
            <p>Samen bouwen we aan een inclusieve gemeenschap</p>
            <p style="margin-top: 15px;">
              Vragen? Mail ons: <a href="mailto:info@stichtingatlas.nl">info@stichtingatlas.nl</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}
