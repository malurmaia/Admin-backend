import { useLocation, useNavigate } from "react-router-dom";
import { Stack, Box, Typography, Grid, Button } from "@mui/material";
import { TextField } from "../components";
import logo from "../assets/img/logo.png";
import { useState, useEffect } from 'react'; 
import { register, userIsLoggedIn } from '../services/auth';

const Register = ({ setCurrentRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();
  setCurrentRoute(location.pathname);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
      userIsLoggedIn(navigate, location.pathname);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={0} sm={4}></Grid>
      <Grid item xs={12} sm={4}>
        <Stack direction={"column"}>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <img
              style={{
                height: "50px",
                width: "auto",
                padding: "15px 0",
              }}
              src={logo}
              alt="Logo"
            />
            <Typography variant="h6" component="h1" gutterBottom>
              Create your account
            </Typography>
          </Box>
          <TextField
                            id={'name-register'}
                            fullWidth={true}
                            label={'Name'}
                            type={'text'}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        <TextField
                            id={'email-register'}
                            fullWidth={true}
                            label={'E-mail'}
                            type={'email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        <TextField
                            id={'username-register'}
                            fullWidth={true}
                            label={'User'}
                            type={'text'}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        <TextField
                            id={'password-register'}
                            fullWidth={true}
                            label={'Password'}
                            type={'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
          <Button
                            size={'large'}
                            variant={'contained'} 
                            onClick={async () => {
                                const response = await register(username, name, email, password)
                                if(response.status === 200){
                                    alert("We send you a confirmation email.")
                                }else if(response.status === 404){
                                    alert(response.data.msg)
                                }
                            }}>Register</Button>
          <Button
            size={"large"}
            onClick={() => {
              navigate(`/login`);
            }}
          >
            Login
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Register;
