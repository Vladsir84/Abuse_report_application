import { useState, useEffect, useRef, useCallback } from "react";
import {
  TextField,
  Button,
  Grid,
  Radio,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@material-ui/core";
import { Formik, Form } from "formik";
import { data, getData, validationSchema, generateToken } from "../utils";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ReCAPTCHA from "react-google-recaptcha";

const AbuseForm = () => {
  const [reportValue, setReportValue] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [failedMessage, setFailedMessage] = useState(false);
  const [countries, setCountries] = useState([]);
  const token = generateToken();

  const [recaptchaVisible, setRecaptchaVisible] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const captchaRef = useRef(null);
  const reCaptchaSiteKey = "6Ld0EWEUAAAAAFSnSvsm-azMwTHMbi5kdw1qmEti";

  interface FormValues {
    clientToken: any;
    abusedURL: string;
    email: string;
    reportType: string;
    spamProof: string;
    targetCountry: string;
    captchaToken: any;
    captcha2Token: string;
  }

  const initialValues: FormValues = {
    clientToken: window.localStorage.getItem("token"),
    abusedURL: "",
    email: "",
    reportType: reportValue,
    spamProof: "",
    targetCountry: "",
    captchaToken: window.localStorage.getItem("recaptchaToken"),
    captcha2Token: "",
  };

  useEffect(() => {
    const userToken = window.localStorage.getItem("token");
    if (!userToken) {
      window.localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    getData()
      .then((response) => response.json())
      .then((data) => setCountries(data));
  }, []);

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("abuse");
    window.localStorage.setItem("recaptchaToken", token);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  const handleSubmit = async (values: FormValues) => {
    fetch("https://profile.short.io/tmp/abuse-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setMessage(true);
        setTimeout(() => {
          setMessage(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
        setFailedMessage(true);
        setTimeout(() => {
          setFailedMessage(false);
        }, 3000);
        if (error.status === 403) {
          setRecaptchaVisible(true);
        }
      });
  };

  const handleSelect = () => {
    setOpen(!open);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <Paper className="form_wrapper">
              <Grid container spacing={3}>
                <input
                  type="hidden"
                  name="clientToken"
                  value={values.clientToken}
                />
                <Grid item xs={12}>
                  <TextField
                    required
                    type="text"
                    variant="outlined"
                    name="abusedURL"
                    label="Abused URL"
                    value={values.abusedURL}
                    onChange={handleChange}
                    fullWidth
                  />
                  {errors.abusedURL && touched.abusedURL && (
                    <Grid className="invalid-feedback">{errors.abusedURL}</Grid>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    variant="outlined"
                    name="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography className="report_title">Report Type</Typography>
                  {data.map((item) => (
                    <Grid className="radio_element" key={item.id}>
                      <Radio
                        name="reportType"
                        value={item.value}
                        onChange={(e) => {
                          handleChange(e);
                          setReportValue(e.target.value);
                        }}
                        checked={values.reportType === item.value}
                      />
                      <Typography>{item.label}</Typography>
                    </Grid>
                  ))}
                </Grid>
                {reportValue === "spam" && (
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      name="spamProof"
                      label="Spam Proof"
                      value={values.spamProof}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                )}
                {reportValue === "gambling" && (
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="target-country-label">
                        Target Country
                      </InputLabel>
                      <Select
                        onClose={handleSelect}
                        onOpen={handleSelect}
                        open={open}
                        variant="outlined"
                        name="targetCountry"
                        label="Target Country"
                        value={values.targetCountry}
                        onChange={handleChange}
                        fullWidth
                      >
                        {countries.map((item: any) => (
                          <MenuItem key={item.name} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <input required type="hidden" value={values.captchaToken} />
                {recaptchaVisible && (
                  <ReCAPTCHA sitekey={reCaptchaSiteKey} ref={captchaRef} />
                )}
                <Grid item xs={12} className="btn_wrapper">
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Form>
        )}
      </Formik>
      {message && (
        <Typography className="succsess_message">
          Report sent successfully
        </Typography>
      )}
      {failedMessage && (
        <Typography className="failed_message">Report failed</Typography>
      )}
    </>
  );
};

export default AbuseForm;
