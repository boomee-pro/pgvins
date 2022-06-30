import Head from "next/head";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { BiEnvelope, BiLockAlt, BiUser } from "react-icons/bi";

import styles from "../../styles/auth.module.scss";
import Wine from "../../../public/wine2.png";
import { registerSchema } from "../../utils/types";
import type { RegisterData } from "../../utils/types";
import { trpc } from "../../utils/trpc";

const SignUp = () => {
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
    <section>
      <Head>
        <title>Inscription</title>
        <meta name="description" content="Page de d'inscription" />
      </Head>
      <div className={styles.auth__container}>
        <div className={styles.auth__banner}>
          <Image src={Wine} alt="" layout="fill" />
        </div>

        <div className={styles.form__container}>
          <div className={styles.form}>
            <h2>Inscription</h2>

            <form>
              <ul>
                {errors.email && <li>{errors.email.message}</li>}
                {errors.forename && <li>{errors.forename.message}</li>}
                {errors.surname && <li>{errors.surname.message}</li>}
                {errors.password && <li>{errors.password.message}</li>}
              </ul>
              <div className={styles.split__container}>
                <div className={styles.form__input}>
                  <BiUser size={24} />
                  <input
                    {...register("forename")}
                    type="text"
                    name="firstName"
                    placeholder="Prénom*"
                  />
                </div>

                <div className={styles.form__input}>
                  <BiUser size={24} />
                  <input
                    {...register("surnname")}
                    type="text"
                    name="lastName"
                    placeholder="Nom*"
                  />
                </div>
              </div>

              <div className={styles.form__input}>
                <BiEnvelope size={24} />
                <input
                  {...register("email")}
                  type="text"
                  name="email"
                  placeholder="Adresse e-mail*"
                />
              </div>

              <div className={styles.form__input}>
                <BiLockAlt size={24} />
                <input
                  {...register("password")}
                  type="password"
                  name="password"
                  placeholder="Mot de passe*"
                />
              </div>

              <button onClick={handleSubmit((e) => e.preventDefault())}>
                S&apos;inscrire
              </button>

              <p>
                Vous avez déjà un compte ? <a onClick={signIn}>Se connecter</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
