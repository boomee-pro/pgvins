type Props = {
  msg?: string;
};

const AuthError = ({ msg }: Props) => {
  return <small style={{ color: "red" }}>{msg ? msg : "erreur"}</small>;
};

export default AuthError;
