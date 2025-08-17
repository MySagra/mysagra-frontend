"use client"

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";

import { useOrder } from "@/contexts/OrderContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/logo";

const formSchema = z.object({
  customer: z.string({ required_error: "Il campo è obbligatorio" }),
  table: z.string({ required_error: "Il campo è obbligatorio" })
    .refine(val => {
      const num = Number(val);
      return Number.isInteger(num) && num >= 1 && num <= 50;
    }, {
      message: "Il numero del tavolo deve essere un intero tra 1 e 50"
    })
});

export default function Home() {
  const { setOrder } = useOrder();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: "",
      table: "", // deve essere stringa, non number o undefined
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOrder(o => ({
      ...o,
      customer: values.customer,
      table: values.table.toString()
    }));
    router.push("/menu");
  }

  //clear session storage
  useEffect(() => {
    sessionStorage.removeItem("order");
    sessionStorage.removeItem("createdOrder");
  })

  return (
    <div className="h-screen w-full flex place-content-center items-center">
      <h1 className="text-primary absolute top-0 p-3 md:left-0 font-bold text-lg">My Sagra</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="h-screen w-full flex flex-col items-center place-content-center">
            <Card className="w-[350px]">
              <CardHeader>
                <div className="relative flex w-full place-content-center pb-6">
                  <Logo className="h-28" />
                </div>
                <CardTitle>Benvenuto</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">

                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Input placeholder="Name and Surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="table"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Table</FormLabel>
                      <FormControl>
                        <Input placeholder="Table number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => form.reset()}
                >
                  Cancella
                </Button>
                <Button type="submit">Next</Button>
              </CardFooter>
            </Card>
          </div >
        </form>
      </Form >
      <div className=" absolute bottom-0 text-sm">
        <Link href={"https://www.nicolospampa.it/"} target="_blank" rel="noopener noreferrer" >
          Powered by
          <Button variant={"link"} className="p-1.5">
            Spampatti Nicolò
          </Button>
        </Link>
      </div>
    </div>
  );
}
