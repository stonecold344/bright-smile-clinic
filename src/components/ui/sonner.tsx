import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      expand
      richColors
      closeButton
      toastOptions={{
        duration: 5000,
        style: {
          fontSize: '0.95rem',
          fontFamily: "'Heebo', sans-serif",
          direction: 'rtl',
          padding: '1rem 1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 12px 40px -8px rgba(0,0,0,0.2)',
          border: '1px solid hsl(200, 20%, 88%)',
          textAlign: 'center' as const,
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg [&_[data-close-button]]:!absolute [&_[data-close-button]]:!left-2 [&_[data-close-button]]:!right-auto [&_[data-close-button]]:!top-2 [&_[data-close-button]]:!rounded-full [&_[data-close-button]]:!border [&_[data-close-button]]:!border-border [&_[data-close-button]]:!bg-background [&_[data-close-button]]:!text-muted-foreground [&_[data-close-button]]:!opacity-100 [&_[data-close-button]]:!w-5 [&_[data-close-button]]:!h-5",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "!bg-red-50 !border-red-300 !text-red-800",
          success: "!bg-emerald-50 !border-emerald-300 !text-emerald-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
