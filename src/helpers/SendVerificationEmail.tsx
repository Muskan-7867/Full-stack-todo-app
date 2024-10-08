import { resend } from "src/lib/resend";
import VerificationEmail from "emails/Verificationemail";
import { ApiResponse } from "src/types/ApiResponse";

export async function  SendVerificationEmail(
    email: string[],
    username:string,
    verifyCode: string
):Promise<ApiResponse>{
     try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username,otp:verifyCode})
          });
        return {success:true, message:'Verification email sent successfully'}
    
     } catch (emailerror) {
        console.log('Error sending verification email:', emailerror)
        return {success:false, message:'Error sending verification email'}
        
     }
}

