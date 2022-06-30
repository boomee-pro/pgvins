import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { registerSchema } from "../../utils/types";
import type { RegisterData } from "../../utils/types";
import { trpc } from "../../utils/trpc";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const signupMutation = trpc.useMutation("auth.signup");

  const onSubmit = (data: RegisterData) => {
    console.log(JSON.stringify(data));
    signupMutation.mutate(data);
    signIn("credentials", {
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form>
      <ul>
        {errors.email && <li>{errors.email.message}</li>}
        {errors.forename && <li>{errors.forename.message}</li>}
        {errors.surname && <li>{errors.surname.message}</li>}
        {errors.password && <li>{errors.password.message}</li>}
      </ul>

      <input {...register("email")} />
      <input {...register("forename")} />
      <input {...register("surname")} />
      <input {...register("password")} />

      <input type="submit" onClick={handleSubmit((e) => e.preventDefault())} />
    </form>
  );
};

export default Signup;
