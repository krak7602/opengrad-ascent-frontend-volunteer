"use client";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";
import { signInSchema } from "@/lib/zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function SignIn({ curRole }: { curRole: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [emailForReset, setEmailForReset] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      role: curRole,
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const validatedFields = signInSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
    const { email, password, role } = validatedFields.data;

    await signIn("credentials", {
      email: email,
      password: password,
      role: role,
      redirect: false,
    }).then((callback) => {
      console.log("The callback:", callback);
      if (callback?.error != null) {
        toast({ title: "Invalid credentials!" });
      } else if (callback?.ok && !callback?.error) {
        router.push("/dashboard");
      }
    });
  }

  async function resetFormSubmit() {
    try {
      if (emailForReset) {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profileset`,
          {
            destination: emailForReset,
          },
        );
        if (resp.data.success) setEmailSent(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function togglePasswordVisiblity() {
    setShowPassword(!showPassword);
  }

  return (
    <div>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Sign in to your account
              </CardTitle>
              <CardDescription>
                Enter your email and password to access your volunteer account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          required
                          type="email"
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative space-y-2">
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        {/* <ForgotPasswordPopup /> */}
                      </div>
                      <FormControl>
                        <div>
                          <Input
                            placeholder=""
                            {...field}
                            required
                            type={showPassword ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            className="absolute top-9 right-1 h-4 w-7 "
                            size="icon"
                            variant="ghost"
                            onClick={togglePasswordVisiblity}
                          >
                            <EyeIcon
                              className={
                                showPassword ? "visible h-4 w-4" : "hidden"
                              }
                            />
                            <EyeSlashIcon
                              className={
                                showPassword ? "hidden" : "visible h-4 w-4"
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
                Sign in
              </Button>
            </CardFooter>
          </form>
        </Form>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger className="ml-auto inline-block text-sm text-gray-500 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 pl-6 pb-5">
            Forgot your password?
          </DrawerTrigger>
          <DrawerContent className="pb-6">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-2xl font-bold px-1">
                Reset your password
              </DrawerTitle>
            </DrawerHeader>
            <DrawerDescription className="px-4 pb-3">
              Provide your email to send instructions to reset the password
            </DrawerDescription>
            <div className="px-4">
              {emailSent && (
                <div>
                  <MailAccountIcon className="mx-auto my-5" />
                  <div className="px-4 text-center text-sm text-neutral-600">
                    An email will be sent to your account with the password
                    reset instructions if an valid profile exists.
                  </div>
                </div>
              )}
              {!emailSent && (
                <form className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder=""
                    onChange={(e) => {
                      setEmailForReset(e.target.value);
                    }}
                  />
                  <Button type="button" onClick={resetFormSubmit}>
                    Send Reset Email
                  </Button>
                </form>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </Card>
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

const MailAccountIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={60}
    height={60}
    color={"#22c55e"}
    fill={"none"}
    {...props}
  >
    <path
      d="M2 5L8.91302 8.92462C11.4387 10.3585 12.5613 10.3585 15.087 8.92462L22 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M21.996 10.5024C21.9933 10.1357 21.9894 9.77017 21.9842 9.5265C21.9189 6.46005 21.8862 4.92682 20.7551 3.79105C19.6239 2.65528 18.0497 2.61571 14.9012 2.53658C12.9607 2.48781 11.0393 2.48781 9.09882 2.53657C5.95033 2.6157 4.37608 2.65526 3.24495 3.79103C2.11382 4.92681 2.08114 6.46003 2.01576 9.52648C1.99474 10.5125 1.99475 11.4926 2.01577 12.4786C2.08114 15.5451 2.11383 17.0783 3.24496 18.2141C4.37608 19.3498 5.95033 19.3894 9.09883 19.4685C9.7068 19.4838 10.4957 19.4943 11 19.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.586 18.6482C14.9572 19.0167 13.3086 19.7693 14.3127 20.711C14.8032 21.171 15.3495 21.5 16.0364 21.5H19.9556C20.6424 21.5 21.1887 21.171 21.6792 20.711C22.6834 19.7693 21.0347 19.0167 20.4059 18.6482C18.9314 17.7839 17.0605 17.7839 15.586 18.6482Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M19.996 14C19.996 15.1046 19.1005 16 17.996 16C16.8914 16 15.996 15.1046 15.996 14C15.996 12.8954 16.8914 12 17.996 12C19.1005 12 19.996 12.8954 19.996 14Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
