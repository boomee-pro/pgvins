import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { registerSchema } from "../../utils/types";
import type { RegisterData } from "../../utils/types";
import { trpc } from "../../utils/trpc";

const Error = ({ msg }: { msg: string }) => {
  return <small style={{ color: "red" }}>{msg}</small>;
};

const Signup = () => {
  const signupMutation = trpc.useMutation("auth.signup", {
    onSuccess(data, variables, context) {
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
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const handleRegistration = (user: RegisterData) => {
    signupMutation.mutate(user);
  };

  return (
    <form onSubmit={handleSubmit(handleRegistration)}>
      <div>
        <label>Name</label>
        <input type="text" {...register("name")} />
        {errors?.name && <Error msg={errors.name.message as string} />}
      </div>
      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors?.email && <Error msg={errors.email.message as string} />}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors?.password && <Error msg={errors.password.message as string} />}
      </div>
      <button>Submit</button>
    </form>
  );
};

export default Signup;
