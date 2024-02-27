import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import moment from "moment";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
  const token = window.localStorage.getItem("token");
  
  const baseUrl = `https://profile.short.io/tmp/abuse-reports?clientToken=${token}`;

  const getReports = () =>
    fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

  useEffect(() => {
    getReports()
      .then((response) => response.json())
      .then((data) => {
        setReports(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : reports.length === 0 ? (
        <Typography align="center">There are no reports yet</Typography>
      ) : (
        <TableContainer component={Paper} className="reports_wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Abused URL</TableCell>
                <TableCell>Report Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Spam Proof</TableCell>
                <TableCell>Target Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((el: any) => (
                <TableRow key={el.id}>
                  <TableCell>
                    {moment(el.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                  </TableCell>
                  <TableCell>{el.abusedURL}</TableCell>
                  <TableCell>{el.reportType.replace(/_/g, " ")}</TableCell>
                  <TableCell>{el.email}</TableCell>
                  <TableCell>{el.spamProof || "-"}</TableCell>
                  <TableCell>{el.targetCountry || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default Reports;
