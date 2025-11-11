import { Resend } from "resend";

// Initialize Resend (you'll need to add RESEND_API_KEY to .env.local)
const resend = new Resend(process.env.RESEND_API_KEY);

interface InterviewEmailData {
  to: string;
  candidateName: string;
  interviewTitle: string;
  interviewDate: string;
  interviewTime: string;
  meetingLink: string;
  interviewerName?: string;
}

// Email template for interview scheduled
export async function sendInterviewScheduledEmail(data: InterviewEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "VideoSync <noreply@videosync.com>", // Replace with your verified domain
      to: data.to,
      subject: `Interview Scheduled: ${data.interviewTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Interview Scheduled!</h1>
              </div>
              <div class="content">
                <p>Hi ${data.candidateName},</p>
                <p>Your interview has been successfully scheduled.</p>
                
                <div class="details">
                  <h3>📋 Interview Details</h3>
                  <p><strong>Title:</strong> ${data.interviewTitle}</p>
                  <p><strong>Date:</strong> ${data.interviewDate}</p>
                  <p><strong>Time:</strong> ${data.interviewTime}</p>
                  ${data.interviewerName ? `<p><strong>Interviewer:</strong> ${data.interviewerName}</p>` : ""}
                </div>

                <div style="text-align: center;">
                  <a href="${data.meetingLink}" class="button">Join Interview</a>
                </div>

                <p><strong>Meeting Link:</strong><br>
                <a href="${data.meetingLink}">${data.meetingLink}</a></p>

                <p><strong>⏰ Reminder:</strong> Please join 5 minutes early to test your camera and microphone.</p>

                <p>Good luck with your interview!</p>
              </div>
              <div class="footer">
                <p>© 2024 VideoSync. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Email template for interview reminder (1 hour before)
export async function sendInterviewReminderEmail(data: InterviewEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "VideoSync <noreply@videosync.com>",
      to: data.to,
      subject: `⏰ Reminder: Interview in 1 hour - ${data.interviewTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Interview Starting Soon!</h1>
              </div>
              <div class="content">
                <p>Hi ${data.candidateName},</p>
                
                <div class="alert">
                  <strong>⏰ Your interview starts in 1 hour!</strong>
                </div>

                <p><strong>Interview:</strong> ${data.interviewTitle}</p>
                <p><strong>Time:</strong> ${data.interviewTime}</p>

                <div style="text-align: center;">
                  <a href="${data.meetingLink}" class="button">Join Now</a>
                </div>

                <p><strong>📝 Quick Checklist:</strong></p>
                <ul>
                  <li>✅ Test your camera and microphone</li>
                  <li>✅ Find a quiet location</li>
                  <li>✅ Have a stable internet connection</li>
                  <li>✅ Keep your resume/notes handy</li>
                </ul>

                <p>Good luck! 🍀</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending reminder:", error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending reminder:", error);
    return { success: false, error };
  }
}

// Email template for feedback received
export async function sendFeedbackReceivedEmail(data: {
  to: string;
  candidateName: string;
  interviewTitle: string;
  rating: number;
}) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "VideoSync <noreply@videosync.com>",
      to: data.to,
      subject: `Feedback Received: ${data.interviewTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .rating { font-size: 24px; color: #f59e0b; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⭐ Feedback Received!</h1>
              </div>
              <div class="content">
                <p>Hi ${data.candidateName},</p>
                <p>Your interviewer has submitted feedback for your interview: <strong>${data.interviewTitle}</strong></p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <div class="rating">${"⭐".repeat(data.rating)}</div>
                  <p>Rating: ${data.rating}/5</p>
                </div>

                <p>Thank you for participating in the interview process!</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending feedback email:", error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending feedback email:", error);
    return { success: false, error };
  }
}
