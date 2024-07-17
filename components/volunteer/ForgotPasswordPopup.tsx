"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordResetSchema } from "@/lib/zod";
import { Button } from "@/components/ui/button";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import axios from "axios";

export function ForgotPasswordPopup() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function PasswordResetForm() {
    const form = useForm<z.infer<typeof passwordResetSchema>>({
      resolver: zodResolver(passwordResetSchema),
      defaultValues: {
        email: "",
      },
    });

    async function onSubmit(values: z.infer<typeof passwordResetSchema>) {
      try {
        if (email) {
          const resp = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profileset`,
            {
              destination: email,
            },
          );
          if (resp.data.success) setEmailSent(true);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (emailSent) {
      return (
        <div>
          <MailAccountIcon className="mx-auto my-5" />
          <div className="px-4 text-center text-neutral-600">
            An email will be sent to your account with the password reset
            instructions if an valid profile exists.
          </div>
        </div>
      );
    }
    return (
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormDescription className="pl-3">
              Provide your email to send instructions to reset the password
            </FormDescription>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="px-3">
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder=""
                      {...field}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-3">
              Sent reset email
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="ml-auto inline-block text-sm text-gray-500 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
          Forgot your password?
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Reset your password
            </DialogTitle>
          </DialogHeader>
          <PasswordResetForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="ml-auto inline-block text-sm text-gray-500 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
        Forgot your password?
      </DrawerTrigger>
      <DrawerContent className="pb-6">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold px-1">
            Reset your password
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-2">
          <PasswordResetForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

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
