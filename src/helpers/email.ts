export const sendEmail = (pdfData:HTMLElement) => {
    const emailServiceEndpoint = 'YOUR_EMAIL_SERVICE_ENDPOINT';
    const apiKey = 'YOUR_API_KEY';

    fetch(emailServiceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: 'nisha6895540@example.com',
        subject: 'PDF Attachment',
        body: 'Please find the attached PDF.',
        attachment: pdfData,
      }),
    })
      .then(response => response.json())
      .then(data => console.log('Email sent:', data))
      .catch(error => console.error('Error sending email:', error));

  }