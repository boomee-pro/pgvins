import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { signIn } from "next-auth/react";

const schema = z.object({
  email: z.string().email("Email requise."),
  password: z.string().min(8, {
    message: "Le mot de passe doit comporter au minimum 8 caractères",
  }),
  surname: z.string().min(1, { message: "Le prénom est requis." }),
  forename: z.string().min(1, { message: "Le nom est requis." }),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const signupMutation = trpc.useMutation("auth.signup");

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(JSON.stringify(data));
    signupMutation.mutate(data);
    signIn("credentials", {
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("forename")} />
      {errors.forename && <p>{errors.forename.message}</p>}

      <input {...register("surname")} />
      {errors.surname && <p>{errors.surname.message}</p>}

      <input {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="submit" onClick={handleSubmit(onSubmit)} />
    </form>
  );
};

export default Signup;
