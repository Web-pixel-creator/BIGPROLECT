"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-background p-8 text-foreground">
      <section className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Shadcn UI подключен. Ниже кнопка для проверки toasts.
        </p>
      </section>
      <div>
        <Button
          onClick={() =>
            toast({
              title: "Toast работает",
              description: "Shadcn UI готов к использованию."
            })
          }
        >
          Проверить toast
        </Button>
      </div>
    </main>
  );
}
