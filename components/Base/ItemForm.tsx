import React from "react";

type BaseItemFormProps = {
  id?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  error?: string | null;
};

export default function BaseItemForm({
  id,
  children,
  onSubmit,
  className = "",
  error,
}: BaseItemFormProps) {
  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className={`space-y-6 ${className}`}
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {children}
    </form>
  );
}