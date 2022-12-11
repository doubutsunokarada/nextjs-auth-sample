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
  getCsrfToken,
  getProviders,
  LiteralUnion,
  signIn,
  useSession,
} from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BuiltInProviderType } from "next-auth/providers";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GetServerSideProps, NextComponentType, NextPage } from "next";
import { getToken } from "next-auth/jwt";
import { render } from "react-dom";

const schema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1).max(32),
  csrfToken: z.string(),
});

type SignInProps = {
  providers: Promise<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>;
  loginError: string;
  csrfToken: string;
};

type SignInInputs = z.infer<typeof schema>;

const SignIn: NextPage<SignInProps> = (props: SignInProps) => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { control, handleSubmit } = useForm<SignInInputs>({
    defaultValues: {
      email: "cred_test@example.com",
      password: "password",
      csrfToken: props.csrfToken,
    },
    resolver: zodResolver(schema),
  });
  const [showAlert, setShowAlert] = React.useState(false);
  const { status } = useSession();

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setRememberMe(!rememberMe);
  };

  const handleClickShowPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<SignInInputs> = async (
    values: SignInInputs
  ) => {
    await signIn("credentials", {
      redirect: false,
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

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

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
          <Box
            component={"form"}
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="csrfToken"
              defaultValue={props.csrfToken}
              render={({ field, fieldState }) => {
                return <TextField {...field} type="hidden" value={field.value} />;
              }}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <TextField
                    {...field}
                    variant="outlined"
                    type="text"
                    tabIndex={1}
                    fullWidth
                    label="Email"
                    autoComplete="email"
                    sx={{ mb: 3 }}
                    error={fieldState.error !== undefined}
                    helperText={fieldState.error?.message}
                  />
                );
              }}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <OutlinedInput
                      {...field}
                      tabIndex={2}
                      label="Password"
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      error={fieldState.error !== undefined}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  );
                }}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  onChange={handleRememberMe}
                  value={rememberMe}
                />
              }
              label={"Remember me"}
            />
            <Button
              type="submit"
              tabIndex={3}
              fullWidth
              size="large"
              variant="contained"
              color="primary"
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req, res } = context;

  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });
    const props = {
      providers: await getProviders(),
      loginError: query.error ?? "",
      csrfToken: await getCsrfToken(),
    };
    return {
      props: props,
    };
  } catch (e) {
    const props = {
      providers: await getProviders(),
      loginError: query.error ?? "",
      csrfToken: await getCsrfToken(),
    };
    return {
      props: props,
    };
  }
};

export default SignIn;
