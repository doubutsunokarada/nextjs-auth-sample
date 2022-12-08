import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  getSession,
} from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getToken } from "next-auth/jwt";
import { BuiltInProviderType } from "next-auth/providers";
import { GetServerSideProps } from "next/types";

export default function SignIn({
  providers,
  loginError,
}: {
  providers: Promise<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>;
  loginError: string;
}) {
  const router = useRouter();
  const [values, setValues] = React.useState({
    email: "cred_test@example.com",
    password: "password",
    showPassword: false,
    rememberMe: false,
  });

  const [showAlert, setShowAlert] = React.useState(false);

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, rememberMe: !values.rememberMe });
  };

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLoginUser = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    await signIn("credentials", {
      redirect: true,
      email: values.email,
      password: values.password,
    }).then((res) => {
      if (res?.error) {
        setShowAlert(true);
      } else {
        router.push("/");
      }
    });
  };

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>Authentication Demo</title>
      </Head>
      <Container component={"main"} maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ bgcolor: blue[200] }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component={"h1"} variant="h5" sx={{ mb: 2 }}>
            Sign In
          </Typography>
          {showAlert && (
            <Typography component={"h1"} variant="h5" sx={{ mb: 2 }}>
              <Alert
                severity="error"
                onClose={() => {
                  setShowAlert(false);
                }}
              >
                <AlertTitle>Warning</AlertTitle>
                Incorrect Email or Password.
              </Alert>
            </Typography>
          )}
          <Box component={"form"} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              required
              tabIndex={1}
              fullWidth
              onChange={handleChange("email")}
              value={values.email}
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              sx={{ mb: 3 }}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                tabIndex={2}
                required
                label="Password"
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  onChange={handleRememberMe}
                  value={values.rememberMe}
                />
              }
              label={"Remember me"}
            />
            <Button
              type="button"
              tabIndex={3}
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              disabled={
                values.email.length === 0 || values.password.length === 0
              }
              onClick={handleLoginUser}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req, res } = context;

  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    return {
      props: { providers: await getProviders(), loginError: query.error ?? "" },
    };
  } catch (e) {
    return {
      props: { providers: await getProviders(), loginError: query.error ?? "" },
    };
  }
};
