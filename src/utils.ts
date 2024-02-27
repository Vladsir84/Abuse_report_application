import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

export const validationSchema = Yup.object().shape({
  abusedURL: Yup.string().url('Invalid URL').required('URL is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

export const data = [
  { id: 1, label: "Social Engineering", value: "social_engineering" },
  { id: 2, label: "Child Abuse", value: "child_abuse" },
  { id: 3, label: "SPAM", value: "spam" },
  { id: 4, label: "Illegal Goods and Services", value: "illegal_goods" },
  { id: 5, label: "Malicious Software", value: "malware" },
  { id: 6, label: "IP Infrigement (DMCA report)", value: "ip_infrigement" },
  { id: 7, label: "Gambling, Casino", value: "gambling" },
  { id: 8, label: "Hate Speech", value: "hate_speech" },
  { id: 9, label: "Terrorism", value: "terrorism" },
  { id: 10, label: "I don't like this content", value: "i_dont_like_this" },
];

const countriesUrl = "https://restcountries.com/v2/all?fields=name,region,area";

export const getData = () =>
  fetch(countriesUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  export function generateToken(): string {
    const token = uuidv4().replace(/-/g, '');
    return token;
}