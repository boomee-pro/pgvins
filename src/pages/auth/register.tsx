import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import AuthError from "../../component/auth-error";
import { RegisterSchema } from "../../utils/types";
import type { RegisterData } from "../../utils/types";
import { trpc } from "../../utils/trpc";

const Signup = () => {
  const signupMutation = trpc.useMutation("auth.signup", {
    onSuccess(data, variables) {
      console.log(JSON.stringify(data));
      signIn("credentials", {
        email: variables.email,
        password: variables.password,
        callbackUrl: "http://localhost:3000",
      });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({ resolver: zodResolver(RegisterSchema) });

  const handleRegistration = (user: RegisterData) => {
    signupMutation.mutate(user);
  };

  return (
    <form onSubmit={handleSubmit(handleRegistration)}>
      <div>
        <label>Name</label>
        <input type="text" {...register("name")} />
        {errors?.name && <AuthError msg={errors.name.message} />}
      </div>
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

export default Signup;
