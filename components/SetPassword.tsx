"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { setPasswordSchema } from "@/lib/zod";
import axios from "axios";

export default function SetPassword({ token }: { token: string }) {
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState(false);
  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password1: "",
      password2: "",
    },
  });

  async function onSubmit(values: z.infer<typeof setPasswordSchema>) {
    const validatedFields = setPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
    const { password1, password2 } = validatedFields.data;

    if (password1 === password2) {
      try {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/callback?token=${token}`,
          {
            password: password1,
          },
        );
        if (resp.data.id) setConfirmPassword(true);
      } catch (e) {
        console.log(e);
      }
    }
  }

  function togglePasswordVisiblity1() {
    setShowPassword1(!showPassword1);
  }

  function togglePasswordVisiblity2() {
    setShowPassword2(!showPassword2);
  }

  return (
    <div>
      {!confirmPassword && (
        <div>
          <Form {...form}>
            <Card>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader className="flex flex-row justify-center">
                  <CardTitle className="text-2xl font-bold">
                    Set your password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password1"
                      render={({ field }) => (
                        <FormItem className="relative space-y-2">
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                          </div>
                          <FormControl>
                            <div>
                              <Input
                                placeholder=""
                                {...field}
                                required
                                type={showPassword1 ? "text" : "password"}
                              />
                              <Button
                                type="button"
                                className="absolute top-7 right-1 h-7 w-7 "
                                size="icon"
                                variant="ghost"
                                onClick={togglePasswordVisiblity1}
                              >
                                <EyeIcon
                                  className={
                                    showPassword1 ? "visible h-4 w-4" : "hidden"
                                  }
                                />
                                <EyeSlashIcon
                                  className={
                                    showPassword1 ? "hidden" : "visible h-4 w-4"
                                  }
                                />
                                <span className="sr-only">
                                  Toggle password visibility
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password2"
                      render={({ field }) => (
                        <FormItem className="relative space-y-2">
                          <div className="flex items-center">
                            <FormLabel>Confirm password</FormLabel>
                          </div>
                          <FormControl>
                            <div>
                              <Input
                                placeholder=""
                                {...field}
                                required
                                type={showPassword2 ? "text" : "password"}
                              />
                              <Button
                                type="button"
                                className="absolute top-7 right-1 h-7 w-7 "
                                size="icon"
                                variant="ghost"
                                onClick={togglePasswordVisiblity2}
                              >
                                <EyeIcon
                                  className={
                                    showPassword2 ? "visible h-4 w-4" : "hidden"
                                  }
                                />
                                <EyeSlashIcon
                                  className={
                                    showPassword2 ? "hidden" : "visible h-4 w-4"
                                  }
                                />
                                <span className="sr-only">
                                  Toggle password visibility
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit">
                    Confirm
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </Form>
        </div>
      )}
      {confirmPassword && (
        <div>
          <div>
            <CheckmarkCircleIcon className="mx-auto my-5" />
            <div className="px-4 text-center text-neutral-600">
              Password has been successfully set.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#9b9b9b"}
    fill={"none"}
    {...props}
  >
    <path
      d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#9b9b9b"}
    fill={"none"}
    {...props}
  >
    <path
      d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 3L21 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckmarkCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <path
      d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 12.5C8 12.5 9.5 12.5 11.5 16C11.5 16 17.0588 6.83333 22 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
