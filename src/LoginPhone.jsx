import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebase';

export default function LoginPhone() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getArabicError = (error) => {
    const code = error?.code || 'unknown-error';

    const errors = {
      'auth/invalid-phone-number': 'رقم الهاتف غير صحيح. اكتبه هكذا: +9627xxxxxxxx',
      'auth/missing-phone-number': 'اكتب رقم الهاتف أولاً.',
      'auth/too-many-requests': 'تم إرسال طلبات كثيرة. انتظر قليلًا ثم جرّب مرة ثانية.',
      'auth/quota-exceeded': 'تم تجاوز حد رسائل SMS في Firebase.',
      'auth/captcha-check-failed': 'فشل التحقق من reCAPTCHA. أعد تحميل الصفحة وجرب.',
      'auth/network-request-failed': 'مشكلة اتصال بالإنترنت.',
      'auth/operation-not-allowed': 'تسجيل الدخول برقم الهاتف غير مفعّل من Firebase.',
      'auth/unauthorized-domain': 'دومين الموقع غير مضاف في Authorized domains داخل Firebase.',
      'auth/invalid-verification-code': 'رمز التحقق غير صحيح.'
    };

    return `${errors[code] || 'حدث خطأ أثناء العملية.'} (${code})`;
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {
          setMessage('تم التحقق من reCAPTCHA.');
        },
        'expired-callback': () => {
          setMessage('انتهت صلاحية reCAPTCHA. تحقق منها مرة أخرى.');
        }
      });
    }
  };

  const resetRecaptcha = async () => {
    try {
      if (window.recaptchaVerifier) {
        const widgetId = await window.recaptchaVerifier.render();
        window.grecaptcha?.reset(widgetId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      setMessage('');

      if (!phone.trim()) {
        setMessage('اكتب رقم الهاتف أولاً.');
        return;
      }

      if (!phone.startsWith('+')) {
        setMessage('اكتب الرقم بصيغة دولية، مثال: +9627xxxxxxxx');
        return;
      }

      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);

      setConfirmationResult(result);
      setMessage('تم إرسال رمز التحقق بنجاح.');
    } catch (error) {
      console.error(error);
      setMessage(getArabicError(error));
      await resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setMessage('');

      if (!confirmationResult) {
        setMessage('أرسل رمز التحقق أولاً.');
        return;
      }

      await confirmationResult.confirm(otp);
      setMessage('تم تسجيل الدخول بنجاح.');
    } catch (error) {
      console.error(error);
      setMessage(getArabicError(error));
    } finally {
      setLoading(false);
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

        <div id="recaptcha-container"></div>

        <button onClick={sendOtp} disabled={loading}>
          {loading ? 'جاري التنفيذ...' : 'إرسال رمز التحقق'}
        </button>

        {confirmationResult && (
          <>
            <input
              type="text"
              placeholder="رمز التحقق"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtp} disabled={loading}>
              تأكيد الدخول
            </button>
          </>
        )}

        <p>{message}</p>
      </div>
    </div>
  );
}
