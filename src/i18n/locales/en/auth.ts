export const enAuth = {
  "auth.login.title": "Sign in",
  "auth.login.username": "Username",
  "auth.login.password": "Password",
  "auth.login.submit": "Sign in",
  "auth.login.forgotPassword": "Forgot password?",
  "auth.login.integrationHint":
    "Connect the sign-in API and call signIn(accessToken) after successful authentication.",
  "auth.login.demoSubmit": "Sign in (demo)",

  "auth.logout.title": "Sign out",
  "auth.logout.message": "Are you sure you want to sign out?",

  "auth.errors.invalidCredentials": "The username or password is incorrect.",

  "auth.errors.sessionExpired":
    "Your session has expired. Please sign in again.",
  "auth.errors.sessionPersistence":
    "Unable to update the sign-in session. Please try again.",
} as const;
