"use client";

import Container from "@/components/shared/Container";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body className="bg-gray-100">
        <Container className="max-w-4xl">
          <div className="min-h-screen flex flex-col items-center justify-center w-full">
            <p className="text-lg md:text-3xl font-semibold text-rose-500 capitalize ">
              Something went wrong!
            </p>
            <p className="text-red-500 mt-4 bg-red-500/5 border border-red-500/10 p-4 rounded-lg border-l-3 w-full text-sm">
              {error.message}
            </p>
            <button
              className="text-sm text-primary border border-primary py-2 px-4 rounded cursor-pointer mt-4"
              onClick={() => window.location.reload()}
            >
              Reload The page
            </button>
          </div>
        </Container>
      </body>
    </html>
  );
}
