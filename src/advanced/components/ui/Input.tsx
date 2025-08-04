import {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  memo,
  PropsWithChildren,
} from "react";

// 상태공유 필요 시 Root에 context 추가해서 확장 가능

const InputRoot = memo(({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
});

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label = memo(({ children, className, ...props }: LabelProps) => {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
});

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  sizes?: "sm" | "md";
}

const Field = ({
  className,
  fullWidth = true,
  sizes = "md",
  ...props
}: FieldProps) => {
  const sizeClass = {
    sm: "px-2 py-1 rounded border",
    md: "px-3 py-2 rounded-md shadow-sm border-gray-300",
  };

  return (
    <input
      className={`focus:ring-indigo-500 focus:border-indigo-500 border
        ${fullWidth ? "w-full" : ""} ${sizeClass[sizes]} ${className}`}
      {...props}
    />
  );
};

// 컴파운드 컴포넌트 조립
export const Input = Object.assign(InputRoot, {
  Label,
  Field,
});
