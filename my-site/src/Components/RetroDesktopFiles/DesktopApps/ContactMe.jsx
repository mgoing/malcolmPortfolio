import React, {useState, useRef} from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './ContactMe.css';

const HCAPTCHA_SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";


export default function ContactMe() {
  const [result, setResult] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  async function onSubmit(event) {
    event.preventDefault();

    if (!captchaToken) {
      setResult("Please complete the captcha.");
      return;
    }

    const form = event.target;

    const payload = {
      access_key: ACCESS_KEY,
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      "h-captcha-response": captchaToken,
    };

    setResult("Sending...");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Web3Forms response:", data);

      if (data.success) {
        setResult("Message sent! Thank you.");
        form.reset();
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      } else {
        setResult(data.message || "Something went wrong.");
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      }
    } catch (err) {
      console.error(err);
      setResult("Network error. Please try again.");
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Name" required /><br />
        <input type="email" name="email" placeholder="Email" required /><br />
        <textarea name="message" placeholder="Message" required /><br />

        <HCaptcha
          sitekey={HCAPTCHA_SITE_KEY}
          onVerify={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken(null)}
          ref={captchaRef}
        />

        <button type="submit">Send</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}


/*
export default function ContactMe(){
const [result, setResult] = useState("");
const [status, setStatus]   = useState("idle"); // idle | sending | success | error
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  function onCaptchaVerify(token) {
    setCaptchaToken(token);
  }

  function onCaptchaExpire() {
    setCaptchaToken(null);
  }



  async function onSubmit(event) {
    event.preventDefault();
      
    if (!captchaToken) {
      setResult("Please complete the captcha.");
      setStatus("error");
      return;
    }
    setResult("Sending....");
    setStatus('sending');

    const formData = new FormData(event.target);
    formData.append("access_key", "a53d95f5-b332-44a7-a9a7-37d48961024c");
    formData.append("h-captcha-response", captchaToken);

    try{

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
                });

                 const data = await response.json();
                
                  if (data.success) {
        setResult("Message sent — I'll be in touch soon. Thank You!");
        setStatus("success");
        event.target.reset();
        // Reset the captcha widget after successful submission
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      } else {
        setResult(data.message || "Something went wrong. Please try again.");
        setStatus("error");
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      }

    }
    catch(err){

        setResult("Network error. Please try again.");
              setStatus("error");
              captchaRef.current?.resetCaptcha();
              setCaptchaToken(null);


            }
      

  /*     const data = await response.json();
        if (data.success) {
          setResult("Form Submitted Successfully");
          event.target.reset();
        } else {
          setResult("Error");
        } 
  };


    return(
  <div className="contact-wrap">
      <div className="contact-card">
 
        <div className="contact-header">
          <span className="contact-header__icon">✉</span>
          <h2 className="contact-header__title">Get In Touch</h2>
          <p className="contact-header__sub">
            Fill out the form and I'll respond as soon as possible.
          </p>
        </div>
 
        <form className="contact-form" onSubmit={onSubmit} noValidate>
 
          <div className="contact-field">
            <label className="contact-label" htmlFor="cf-name">Name</label>
            <input
              id="cf-name"
              className="contact-input"
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
          </div>
 
          <div className="contact-field">
            <label className="contact-label" htmlFor="cf-email">Email</label>
            <input
              id="cf-email"
              className="contact-input"
              type="email"
              name="email"
              placeholder="your@email.com"
              required
            />
          </div>
 
          <div className="contact-field">
            <label className="contact-label" htmlFor="cf-message">Message</label>
            <textarea
              id="cf-message"
              className="contact-input contact-textarea"
              name="message"
              placeholder="What's on your mind?"
              rows={5}
              required
            />
          </div>
 
          {/* hCaptcha widget — centred via CSS }
          <div className="contact-captcha">
            <HCaptcha
              sitekey={HCAPTCHA_SITE_KEY}
              reCaptchaCompat={false}
              onVerify={onCaptchaVerify}
              onExpire={onCaptchaExpire}
              ref={captchaRef}
              theme="dark"
            />
          </div>
 
          <button
            type="submit"
            className={`contact-submit ${status === 'sending' ? 'contact-submit--loading' : ''}`}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
 
          {result && (
            <p className={`contact-result contact-result--${status}`}>
              {status === 'success' && '✓ '}{result}
            </p>
          )}
 
        </form>
      </div>
    </div>
    );
}

*/