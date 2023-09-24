import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Footer from "./components/Footer";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const defaultTheme = createTheme();
export interface AlertSeverity {
  success: string;
  error: string;
}
export interface ResData {
  status: string;
  message: string;
  token: string;
  profile: {
    username: string;
    email: string;
    role: string;
  };
}

export default function Edit() {
  const { username } = useParams();
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string[]>([]);
  const [alertSeverity, setAlertSeverity] =
    React.useState<keyof AlertSeverity>("success");
  const handleAlertClose = () => {
    setOpen(false);
  };
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:4000/user/${username}`)
      .then((response) => {
        setFormData(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [username]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const password = data.get("password");
      const role = data.get("role");

      if (!email && !password && !role) {
        setAlertSeverity("error");
        setAlertMessage(["Please fill in required fields."]);
        setOpen(true);
        return;
      }

      const jsonData = {
        password,
        email,
        role,
      };
      const response = await axios({
        method: "put",
        url: `http://localhost:4000/edit/${username}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: jsonData,
      });

      const responseData: ResData = response.data;
      if (responseData.status === "ok") {
        setAlertSeverity("success");
        setAlertMessage([responseData.message]);
        setOpen(true);
        setTimeout(() => {
          window.location.href = "/adminhome";
        }, 500);
      } else {
        setAlertSeverity("error");
        setAlertMessage([responseData.message + "An error occurred."]);
        setOpen(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setAlertSeverity("error");
        setAlertMessage(error.response.data.message);
        setOpen(true);
      } else {
        setAlertSeverity("error");
        setAlertMessage(error);
        setOpen(true);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  disabled
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    required
                    fullWidth
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Edit
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/adminhome" variant="body2">
                  Go Back To Admin Home
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Footer />
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert severity={alertSeverity} onClose={handleAlertClose}>
          {alertMessage.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
