import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { BiEnvelope, BiLockAlt, BiUser } from "react-icons/bi";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import Wine from "../../../public/wine2.png";

import styles from "../../styles/auth.module.scss";
import { trpc } from "../../utils/trpc";

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
    <section>
      <Head>
        <title>Inscription</title>
      </Head>
      <div className={styles.auth__container}>
        <div className={styles.auth__banner}>
          <Image src={Wine} alt="auth-banner" layout="fill" />
        </div>
        <div className={styles.form__container}>
          <form className={styles.form}>
            <h2>Inscription</h2>
            <div>
              <div className={styles.split__container}>
                <div className={styles.form__input}>
                  <BiUser size={24} />
                  <input placeholder="Prénom" {...register("forename")} />
                </div>

                <div className={styles.form__input}>
                  <BiUser size={24} />
                  <input placeholder="Nom" {...register("surname")} />
                </div>

                <div className={styles.form__input}>
                  <BiEnvelope size={24} />
                  <input placeholder="Email" {...register("email")} />
                </div>

                <div className={styles.form__input}>
                  <BiLockAlt size={24} />
                  <input placeholder="Mot de passe" {...register("password")} />
                </div>

                <input
                  type="submit"
                  onClick={handleSubmit((e) => e.preventDefault())}
                />

                <p>
                  Vous avez déjà un compte ?{" "}
                  <Link href="sign-in">Se connecter</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
