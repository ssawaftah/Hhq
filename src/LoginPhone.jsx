import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebase';

export default function LoginPhone() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState('');

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const sendOtp = async () => {
    try {
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);

      setConfirmationResult(result);
      setMessage('تم إرسال رمز التحقق');
    } catch (error) {
      console.error(error);
      setMessage('حدث خطأ أثناء إرسال الرمز');
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      setMessage('تم تسجيل الدخول بنجاح');
    } catch (error) {
      console.error(error);
      setMessage('رمز التحقق غير صحيح');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>تسجيل الدخول</h1>

        <input
          type="tel"
          placeholder="+9627xxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={sendOtp}>إرسال رمز التحقق</button>

        {confirmationResult && (
          <>
            <input
              type="text"
              placeholder="رمز التحقق"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtp}>تأكيد الدخول</button>
          </>
        )}

        <div id="recaptcha-container"></div>

        <p>{message}</p>
      </div>
    </div>
  );
}
