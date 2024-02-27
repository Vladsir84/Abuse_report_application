import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import AbuseForm from "../components/AbuseForm";

function AbuseFormReport() {
  const reCaptchaKey = "6LdO8JcUAAAAAJWQi_B27yDFuShbD2Cvq4AqcOCQ";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      <AbuseForm />
    </GoogleReCaptchaProvider>
  );
}

export default AbuseFormReport;
