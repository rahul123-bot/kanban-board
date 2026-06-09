// Temporary module and JSX declarations to reduce editor/type errors
// These are stop-gap measures until `npm install` is run and proper types are available.

declare module "sonner";
declare module "lucide-react";
declare module "next/link";
declare module "next/navigation";
declare module "react";
declare module "react/jsx-runtime";
declare module "write-file-atomic";

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
