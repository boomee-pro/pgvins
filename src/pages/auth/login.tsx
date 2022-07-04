import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import AuthError from "../../component/auth-error";
import { LoginSchema } from "../../utils/types";
import type { LoginData } from "../../utils/types";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(LoginSchema) });

  const handleLogin = (user: LoginData) => {
    console.log(JSON.stringify(user));
    signIn("credentials", {
      email: user.email,
      password: user.password,
      callbackUrl: "http://localhost:3000",
    });
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors?.email && <AuthError msg={errors.email.message} />}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors?.password && <AuthError msg={errors.password.message} />}
      </div>
      <button>Submit</button>
    </form>
  );
};

export default Login;
