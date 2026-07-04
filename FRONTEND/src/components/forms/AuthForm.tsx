interface AuthFormProps {
  children: React.ReactNode;
}

export default function AuthForm({ children }: AuthFormProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {children}
    </div>
  );
}
