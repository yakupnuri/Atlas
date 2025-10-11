// Email utility - Demo mode: logs to console
export async function sendEmail({ to, subject, html }) {
  console.log('\n📧 EMAIL SENT (Demo Mode)');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Body:', html.substring(0, 200) + '...');
  console.log('---\n');
  
  return { success: true, messageId: 'demo-' + Date.now() };
}

export function generateReservationEmail({ name, eventTitle, eventDate, count, reservationId }) {
  return {
    subject: `Reservering bevestiging - ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #05B6C4; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #F7941D; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Stichting Atlas</h1>
          </div>
          <div class="content">
            <h2>Beste ${name},</h2>
            <p>Bedankt voor je reservering! We hebben je aanmelding ontvangen.</p>
            <h3>Reserveringsdetails:</h3>
            <ul>
              <li><strong>Evenement:</strong> ${eventTitle}</li>
              <li><strong>Datum:</strong> ${new Date(eventDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</li>
              <li><strong>Aantal personen:</strong> ${count}</li>
              <li><strong>Reserveringsnummer:</strong> ${reservationId}</li>
            </ul>
            <p>We kijken ernaar uit je te verwelkomen!</p>
          </div>
          <div class="footer">
            <p>Stichting Atlas - Samen bouwen we aan een inclusieve gemeenschap</p>
            <p>Voor vragen: info@stichtingatlas.nl</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}
